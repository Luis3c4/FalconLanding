import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import heroVideo from "@/assets/output.mp4";
import { useGSAP } from '@gsap/react';
import { setHeroPhase, useHeroPhase } from "@/hooks/use-hero-phase";
import { preloadImages } from "@/lib/frame-preload";
import { usePageLoaderReady } from "@/hooks/use-app-ready";
import { lockPageScroll } from "@/hooks/use-scroll-lock";
import { onScrollIntent } from "@/hooks/use-scroll-intent";

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

// One HTMLImageElement per frame, created once (lazily, on first client
// access — `Image` doesn't exist during this app's SSR pass, so this can't
// run at module scope like `heroFrames` above) and reused for every
// `drawImage` call below. Decoding straight into a <canvas> instead of
// swapping an <img src> avoids a synchronous decode+layout+paint on every
// scroll tick (the browser decodes each element exactly once, in
// preloadImages below, well ahead of when it's actually drawn).
let heroFrameImages: HTMLImageElement[] | null = null;
function getHeroFrameImages() {
    if (!heroFrameImages) {
        heroFrameImages = heroFrames.map((src) => {
            const img = new Image();
            img.src = src;
            return img;
        });
    }
    return heroFrameImages;
}

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
    const sequenceCanvasRef = useRef<HTMLCanvasElement>(null);
    const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const infoItemRefs = useRef<(HTMLElement | null)[]>([]);
    const [showSequence, setShowSequence] = useState(false);
    const phase = useHeroPhase();
    const unlockAndStartRef = useRef<() => void>(() => {});
    const pageLoaderReady = usePageLoaderReady();

    // Preload every frame in the background so scrubbing stays smooth, and
    // report progress to the shared tracker so PageLoader can hold the
    // splash screen until this sequence is actually decoded — otherwise the
    // earliest scroll-driven swaps after a fresh page load can stall on a
    // synchronous decode right as ScrollTrigger's onUpdate is running.
    // Reuses `heroFrameImages` so the exact elements drawn to the canvas
    // below are the ones getting decoded here, instead of decoding a
    // throwaway set.
    useEffect(() => {
        preloadImages("hero-frames", heroFrames, getHeroFrameImages());
    }, []);

    // Phase 1: the intro video must play to completion before any scrolling is
    // allowed to move the page (scroll is fully locked, see use-scroll-lock).
    // Phase 2: once the video ends (or a safety timeout / load error fires as
    // a fallback so users are never permanently stuck), the lock lifts and a
    // real scroll gesture reveals the frame sequence. The video stays visible
    // until scroll progress actually leaves 0, then crossfades into the frame
    // sequence (so if the video ends before any scroll happens, it simply
    // freezes on its natural last frame, matching default <video> behavior
    // without `loop`).
    //
    // The pin itself is created immediately on mount rather than deferred
    // until the video ends. Every other section creates its own ScrollTrigger
    // on mount too, measuring the page as it exists right then — if Hero's
    // ~700vh pin-spacer only showed up later, all of those would be computed
    // against a much shorter, stale layout and scrolling through Hero would
    // eventually overrun their (too-early) ranges. Creating it up front costs
    // nothing here: real scrollY can't move at all while the page-scroll
    // lock is active, so the pin just sits inert at progress 0 until the lock
    // lifts.
    useGSAP(() => {
        if (heroFrames.length === 0) return;

        const section = sectionRef.current;
        const canvas = sequenceCanvasRef.current;
        const video = video1Ref.current;
        if (!section || !canvas || !video) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const frameImages = getHeroFrameImages();
        let sequenceRevealed = false;
        let lastDrawnIndex = -1;

        // Drawing buffer is sized in device pixels (capped at 2x so a 3x/4x
        // phone doesn't push a huge canvas through drawImage every tick)
        // while the CSS box stays 100%/100% via the classes below — this is
        // what lets `drawImage` below do its own "cover" crop instead of
        // relying on `object-fit`, which a canvas's drawing buffer ignores.
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const resizeCanvas = () => {
            const rect = section.getBoundingClientRect();
            canvas.width = Math.max(1, Math.round(rect.width * dpr));
            canvas.height = Math.max(1, Math.round(rect.height * dpr));
        };

        // Replicates `object-cover`: scales the frame up just enough that it
        // fully covers the canvas on both axes, then centers and crops the
        // overflow, so switching from <img> to <canvas> doesn't change how
        // the sequence is framed.
        const drawFrame = (index: number) => {
            const frame = frameImages[index];
            if (!frame || !frame.complete || frame.naturalWidth === 0) return;
            const scale = Math.max(
                canvas.width / frame.naturalWidth,
                canvas.height / frame.naturalHeight,
            );
            const dw = frame.naturalWidth * scale;
            const dh = frame.naturalHeight * scale;
            ctx.drawImage(frame, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
            lastDrawnIndex = index;
        };

        resizeCanvas();
        // Paint the first frame as soon as it's decoded so the canvas isn't
        // blank the instant it crossfades in, mirroring the old <img
        // src={heroFrames[0]}> poster behavior.
        const firstFrame = frameImages[0];
        if (firstFrame.complete) {
            drawFrame(0);
        } else {
            firstFrame.addEventListener("load", () => drawFrame(0), { once: true });
        }

        // The pin-spacer changes section's rendered size on viewport
        // resize/rotation; redraw the current frame at the new resolution
        // instead of leaving stale (or now-blank, since resizing a canvas
        // clears it) pixels on screen.
        const resizeObserver = new ResizeObserver(() => {
            resizeCanvas();
            if (lastDrawnIndex >= 0) drawFrame(lastDrawnIndex);
        });
        resizeObserver.observe(section);

        // Controls the video's "ended"/"error" listeners: aborting it removes
        // both in one call instead of pairing each addEventListener with a
        // matching removeEventListener.
        const videoListenerController = new AbortController();
        const revealController = new AbortController();

        // Page scroll is fully locked (wheel, touch, keyboard, *and*
        // scrollbar-thumb dragging — see use-scroll-lock) until the video
        // ends, so real scrollY can't move at all yet.
        const unlockPageScroll = lockPageScroll();

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
            // This first real gesture is also the only trustworthy signal
            // that it's time to leave the "top" nav phase — see the note
            // above about why self.progress itself can't be used for that.
            setHeroPhase("frames");
        };

        const unlockAndStart = () => {
            videoListenerController.abort();
            unlockPageScroll();
            // Unified across wheel/touch/keyboard/scrollbar-drag — see
            // use-scroll-intent for why a plain wheel/touchmove pair used to
            // miss scrollbar-thumb dragging entirely.
            onScrollIntent(revealSequence, { signal: revealController.signal });
        };
        // Exposed so the effect below (which starts the video once
        // PageLoader is done) can also reach this without re-running the
        // whole ScrollTrigger/listener setup.
        unlockAndStartRef.current = unlockAndStart;

        const trigger = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "+=600%",
            pin: true,
            scrub: 0.5,
            onUpdate: (self) => {
                // Once the first real gesture has happened, progress is a
                // trustworthy, bidirectional signal (the only spurious
                // reading was the one right at trigger creation, before any
                // real scrolling — see the note in revealSequence above).
                // That lets the top nav reappear if the user scrolls back up
                // to the very start instead of staying hidden for good the
                // moment they first scroll past it. The lower bound uses a
                // small epsilon instead of a strict 0: GSAP can report
                // progress as e.g. 1.85e-7 rather than exactly 0 right at the
                // very top, so a strict `<= 0` check never re-triggers.
                if (sequenceRevealed) {
                    setHeroPhase(self.progress >= 1 ? "after" : self.progress <= 0.001 ? "top" : "frames");
                }
                if (!sequenceRevealed) return;
                // 1. Calcula qué fotograma toca mostrar según el progreso (de 0 a 1)
                const index = Math.min(
                    heroFrames.length - 1,
                    Math.floor(self.progress * heroFrames.length),
                );
                // 2. Solo redibuja si es un fotograma diferente (optimiza el rendimiento)
                if (index !== lastDrawnIndex) {
                    drawFrame(index);
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

        video.addEventListener("ended", unlockAndStart, { signal: videoListenerController.signal });
        video.addEventListener("error", unlockAndStart, { signal: videoListenerController.signal });

        return () => {
            videoListenerController.abort();
            revealController.abort();
            resizeObserver.disconnect();
            unlockPageScroll();
            trigger.kill();
        };
    }, []);

    // The intro video only starts once PageLoader itself is gone — it used
    // to have `autoPlay` and would run (partially or entirely) behind the
    // splash screen, so by the time the page was revealed the user could
    // miss part or all of it. Its own fallback timer only starts counting
    // from here too, not from Hero's mount, since PageLoader can itself take
    // several seconds.
    useEffect(() => {
        if (!pageLoaderReady) return;
        const video = video1Ref.current;
        if (!video) return;

        video.play().catch(() => unlockAndStartRef.current());

        const fallbackTimer = setTimeout(() => unlockAndStartRef.current(), 15000);
        const clearFallback = () => clearTimeout(fallbackTimer);
        video.addEventListener("ended", clearFallback);
        video.addEventListener("error", clearFallback);

        return () => {
            clearTimeout(fallbackTimer);
            video.removeEventListener("ended", clearFallback);
            video.removeEventListener("error", clearFallback);
        };
    }, [pageLoaderReady]);
    // Bottom info strip: each item slides in left-to-right, staggered, once
    // PageLoader is gone — a 1s hold first so it doesn't compete with the
    // video/splash reveal.
    useEffect(() => {
        if (!pageLoaderReady) return;
        const items = infoItemRefs.current.filter((el): el is HTMLElement => Boolean(el));
        if (items.length === 0) return;

        const tween = gsap.fromTo(
            items,
            { x: -40, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.15, delay: 1 },
        );

        return () => {
            tween.kill();
        };
    }, [pageLoaderReady]);

    return (
        <section
            ref={sectionRef}
            id="top"
            className="relative min-h-screen overflow-hidden pt-24 pb-14"
        >
            {/* Video background — no `autoPlay`: playback is started
                manually once PageLoader signals ready, see the effect above. */}
            <video
                ref={video1Ref}
                muted
                playsInline
                className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                    showSequence ? "opacity-0" : "opacity-100",
                )}
            >
                <source src={heroVideo} type="video/mp4" />
            </video>
            <canvas
                ref={sequenceCanvasRef}
                aria-hidden="true"
                className={cn(
                    "absolute inset-0 h-full w-full transition-opacity duration-500",
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
            {/* Bottom info strip: same reveal behavior as the top nav — only
                shown in the "top" phase, fades out on the first scroll. */}
            <div
                className={cn(
                    "absolute inset-x-0 bottom-6 z-10 px-6 lg:px-10 transition-all duration-500",
                    phase === "top"
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 pointer-events-none translate-y-4",
                )}
            >
                <div className="mx-auto flex max-w-7xl items-end justify-between gap-8 text-black">
                    <div className="flex items-end gap-10">
                        <div
                            ref={(el) => {
                                infoItemRefs.current[0] = el;
                            }}
                        >
                            <p className="text-[11px] uppercase tracking-[0.3em] text-black">
                                lugar
                            </p>
                            <p className="mt-1 text-sm font-medium">Magdalena, Perú</p>
                        </div>
                        <div
                            ref={(el) => {
                                infoItemRefs.current[1] = el;
                            }}
                        >
                            <p className="text-[11px] uppercase tracking-[0.3em] text-black">
                                desde
                            </p>
                            <p className="mt-1 text-sm font-medium">2022</p>
                        </div>
                    </div>
                    <p
                        ref={(el) => {
                            infoItemRefs.current[2] = el;
                        }}
                        className="max-w-md text-right text-sm text-black sm:text-base"
                    >
                        La última generación de productos Apple, seleccionada para quienes valoran innovación, rendimiento y diseño en cada detalle.
                    </p>
                </div>
            </div>
        </section>
    );
}