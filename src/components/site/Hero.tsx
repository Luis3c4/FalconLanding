import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import heroVideo from "@/assets/output.mp4";
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP)
gsap.registerPlugin(ScrollTrigger);

// All frames from src/assets/heroIMG, sorted by filename (0095.png ... 0230.png)
const heroFrameModules = import.meta.glob("../../assets/heroIMG/*.webp", {
    eager: true,
    query: "?url",
    import: "default",
});
const heroFrames = Object.keys(heroFrameModules)
    .sort()
    .map((key) => heroFrameModules[key] as string);

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const video1Ref = useRef<HTMLVideoElement>(null);
    const sequenceImgRef = useRef<HTMLImageElement>(null);
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
        </section>
    );
}