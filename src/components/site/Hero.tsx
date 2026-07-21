import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import heroVideo from "@/assets/output.mp4";
import { useGSAP } from '@gsap/react';

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

    // Only pin the section and start driving the image sequence once the user
    // makes a real scroll gesture, so the intro video is never cut short by
    // layout shifts or other non-user-driven scroll changes.
    useGSAP(() => {
        if (heroFrames.length === 0) return;

        const section = sectionRef.current;
        const img = sequenceImgRef.current;
        if (!section || !img) return;

        let trigger: ScrollTrigger | undefined;

        const setupScrub = () => {
            if (trigger) return;

            setShowSequence(true);
            trigger = ScrollTrigger.create({
                trigger: section,
                start: "top top",
                end: "+=600%",
                pin: true,
                scrub: 10,
                onUpdate: (self) => {
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
        };

        window.addEventListener("wheel", setupScrub, { passive: true, once: true });
        window.addEventListener("touchmove", setupScrub, { passive: true, once: true });

        return () => {
            window.removeEventListener("wheel", setupScrub);
            window.removeEventListener("touchmove", setupScrub);
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