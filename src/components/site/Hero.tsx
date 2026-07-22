import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import heroVideo from "@/assets/output.mp4";
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP)
gsap.registerPlugin(ScrollTrigger);

// All frames from src/assets/heroIMG, sorted by filename (0096.webp ... 0233.webp)
const heroFrameModules = import.meta.glob("../../assets/heroIMG/*.webp", {
    eager: true,
    query: "?url",
    import: "default",
});
const heroFrameKeys = Object.keys(heroFrameModules).sort();
const heroFrames = heroFrameKeys.map((key) => heroFrameModules[key] as string);

// Frame numbers are consecutive (see filenames above), so a frame number can
// be converted to a scroll-progress fraction (0..1) just by offsetting from
// the first frame and dividing by the total count.
const FIRST_FRAME_NUMBER = Number(heroFrameKeys[0]?.match(/(\d+)\.webp$/)?.[1] ?? 0);
const frameProgress = (frameNumber: number) =>
    (frameNumber - FIRST_FRAME_NUMBER) / heroFrames.length;

// Four captions pulled from WhyUs, each pinned to a 10-frame window with the
// next caption's window starting 30 frames later (10 for the text itself +
// 20 frames of pure product animation in between with no text at all). Each
// one enters from a different side, Apple-keynote style, instead of all
// sliding in from the same spot.
const CAPTIONS = [
    { from: 110, to: 120, title: "Productos originales", desc: "100% auténticos, sellados de fábrica.", dir: "left" as const },
    { from: 140, to: 150, title: "Última generación", desc: "Los modelos más recientes del catálogo Apple.", dir: "top" as const },
    { from: 170, to: 180, title: "Garantía oficial", desc: "Cobertura respaldada por el distribuidor autorizado.", dir: "bottom" as const },
    { from: 200, to: 210, title: "Soporte post-venta", desc: "Acompañamiento continuo después de tu compra.", dir: "right" as const },
].map((c) => ({ ...c, fromP: frameProgress(c.from), toP: frameProgress(c.to) }));

// Position + text alignment for each entrance direction. Left/right sit at
// vertical center clear of the centered product; top sits close under the
// nav so it doesn't read as detached from the image; bottom is the original
// spot.
const CAPTION_POSITION_CLASS: Record<(typeof CAPTIONS)[number]["dir"], string> = {
    left: "left-[6%] sm:left-[10%] top-1/2 -translate-y-1/2 max-w-[16rem] items-start text-left",
    top: "left-1/2 top-[10%] sm:top-[10%] -translate-x-1/2 max-w-md items-center text-center",
    bottom: "left-1/2 bottom-[8%] sm:bottom-[10%] -translate-x-1/2 max-w-lg items-center text-center",
    right: "right-[6%] sm:right-[10%] top-1/2 -translate-y-1/2 max-w-[16rem] items-end text-right",
};

// Trapezoid alpha: fades in over the first 35% of the window, holds at full
// opacity, then fades out over the last 35% — 0 outside the window entirely.
function captionAlpha(progress: number, fromP: number, toP: number) {
    if (progress <= fromP || progress >= toP) return 0;
    const span = toP - fromP;
    const edge = span * 0.35;
    if (progress < fromP + edge) return (progress - fromP) / edge;
    if (progress > toP - edge) return (toP - progress) / edge;
    return 1;
}

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const video1Ref = useRef<HTMLVideoElement>(null);
    const sequenceImgRef = useRef<HTMLImageElement>(null);
    const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [showSequence, setShowSequence] = useState(false);

    // Preload every frame in the background so scrubbing stays smooth
    useEffect(() => {
        heroFrames.forEach((src) => {
            const preload = new Image();
            preload.src = src;
        });
    }, []);

    // Phase 1: the intro video must play to completion before any scrolling is
    // allowed to move the page (scroll is fully absorbed via preventDefault).
    // Phase 2: once the video ends (or a safety timeout / load error fires as
    // a fallback so users are never permanently stuck), scroll unlocks and we
    // create the ScrollTrigger that pins the section and drives the image
    // sequence. Creating it only at that point (when no scroll gesture is in
    // flight) avoids the earlier layout-shift jump bug. The video stays
    // visible until scroll progress actually leaves 0, then crossfades into
    // the frame sequence (so if the video ends before any scroll happens, it
    // simply freezes on its natural last frame, matching default <video>
    // behavior without `loop`).
    const { contextSafe } = useGSAP(() => {
        if (heroFrames.length === 0) return;

        const section = sectionRef.current;
        const img = sequenceImgRef.current;
        const video = video1Ref.current;
        if (!section || !img || !video) return;

        let trigger: ScrollTrigger | undefined;
        let sequenceRevealed = false;

        // Each phase gets its own controller: aborting one removes every
        // listener registered with its signal in a single call, instead of
        // pairing every addEventListener with a matching removeEventListener.
        const lockController = new AbortController();
        const revealController = new AbortController();

        const lockScroll = (event: Event) => {
            event.preventDefault();
        };

        // Only reveal the frame sequence once the user makes a real scroll
        // gesture after the video has ended. We deliberately don't infer this
        // from ScrollTrigger's `self.progress` (it can already read as > 0
        // right when the trigger is created/refreshed, before any actual user
        // input), so without a scroll gesture the hero simply stays frozen on
        // the video's last frame.
        const revealSequence = () => {
            if (sequenceRevealed) return;
            sequenceRevealed = true;
            setShowSequence(true);
        };

        const unlockAndStart = contextSafe(() => {
            lockController.abort();
            clearTimeout(fallbackTimer);
            if (trigger) return;

            window.addEventListener("wheel", revealSequence, {
                passive: true,
                once: true,
                signal: revealController.signal,
            });
            window.addEventListener("touchmove", revealSequence, {
                passive: true,
                once: true,
                signal: revealController.signal,
            });

            trigger = ScrollTrigger.create({
                trigger: section,
                start: "top top",
                end: "+=600%",
                pin: true,
                scrub: 0.5,
                onUpdate: (self) => {
                    if (!sequenceRevealed) return;
                    // 1. Calcula qué fotograma toca mostrar según el progreso (de 0 a 1)
                    const index = Math.min(
                        heroFrames.length - 1,
                        Math.floor(self.progress * heroFrames.length),
                    );
                    // 2. Obtiene la ruta de la imagen correspondiente
                    const nextSrc = heroFrames[index];
                    // 3. Solo cambia el 'src' si  es un fotograma diferente (optimiza el rendimiento)
                    if (img.src !== nextSrc) {
                        img.src = nextSrc;
                    }
                    // 4. Same progress value drives the caption fades, so text
                    // and frame always stay perfectly in sync. Each one
                    // travels in from its own side as it fades in.
                    CAPTIONS.forEach((c, i) => {
                        const el = captionRefs.current[i];
                        if (!el) return;
                        const alpha = captionAlpha(self.progress, c.fromP, c.toP);
                        const travel = (1 - alpha) * (c.dir === "left" || c.dir === "right" ? 56 : 28);
                        const sign = c.dir === "left" || c.dir === "top" ? -1 : 1;
                        const isHorizontal = c.dir === "left" || c.dir === "right";
                        gsap.set(el, {
                            opacity: alpha,
                            x: isHorizontal ? sign * travel : 0,
                            y: isHorizontal ? 0 : sign * travel,
                        });
                    });
                },
            });
        });

        // Safety fallback: never trap the user if the video can't play for any
        // reason (autoplay blocked, load failure, etc.).
        const fallbackTimer = setTimeout(unlockAndStart, 15000);

        window.addEventListener("wheel", lockScroll, { passive: false, signal: lockController.signal });
        window.addEventListener("touchmove", lockScroll, { passive: false, signal: lockController.signal });
        video.addEventListener("ended", unlockAndStart, { signal: lockController.signal });
        video.addEventListener("error", unlockAndStart, { signal: lockController.signal });

        return () => {
            lockController.abort();
            revealController.abort();
            clearTimeout(fallbackTimer);
            trigger?.kill();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="top"
            className="relative min-h-screen overflow-hidden pt-24 pb-14"
        >
            {/* Video background */}
            <video
                ref={video1Ref}
                autoPlay
                muted
                playsInline
                className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                    showSequence ? "opacity-0" : "opacity-100",
                )}
            >
                <source src={heroVideo} type="video/mp4" />
            </video>
            <img
                ref={sequenceImgRef}
                src={heroFrames[0]}
                alt=""
                className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                    showSequence ? "opacity-100" : "opacity-0",
                )}
            />
            {/* Legibility scrim for the captions below, and the captions
                themselves — each starts at opacity-0 and is driven purely by
                the ScrollTrigger onUpdate above via gsap.set, in lockstep
                with the frame being shown. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-black/60 to-transparent" />
            {CAPTIONS.map((c, i) => (
                <div
                    key={c.title}
                    ref={(el) => {
                        captionRefs.current[i] = el;
                    }}
                    className={cn(
                        "pointer-events-none absolute flex flex-col px-6 opacity-0",
                        CAPTION_POSITION_CLASS[c.dir],
                    )}
                >
                    <p className="mb-2 text-[11px] uppercase tracking-[0.3em] text-white/50">
                        0{i + 1}
                    </p>
                    <h3 className="text-2xl font-semibold text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.65)] sm:text-3xl md:text-4xl">
                        {c.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/70 sm:text-base">
                        {c.desc}
                    </p>
                </div>
            ))}
        </section>
    );
}