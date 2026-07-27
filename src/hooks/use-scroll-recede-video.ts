import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
// Smoothstep instead of a linear scrub — the shrink eases in/out instead of
// moving at a constant rate, which reads as far more "physical".
const ease = (t: number) => t * t * (3 - 2 * t);

export type ScrollRecedeVideoOptions = {
    sectionRef: RefObject<HTMLElement | null>;
    videoRef: RefObject<HTMLVideoElement | null>;
    boxRef: RefObject<HTMLDivElement | null>;
    /** Extra scroll distance the pin consumes, as a ScrollTrigger `end` value. */
    scrollDistance?: string;
    /**
     * Fraction (0..1) of the pin's total progress before the shrink starts.
     * Below this, the box is held at fullscreen — e.g. to leave room for a
     * text phase over the still-fullscreen video before it recedes.
     */
    recedeStart?: number;
    /** Rest-state width as a fraction of viewport width (desktop). */
    finalWidthRatio?: number;
    /** Rest-state width as a fraction of viewport width (narrow viewports). */
    finalWidthRatioMobile?: number;
    /** Rest-state corner radius in px. */
    finalRadius?: number;
    /** Fallback aspect ratio (width / height) used before video metadata loads. */
    fallbackAspect?: number;
    /** Called on every scrub tick with the raw (non-eased) 0..1 pin progress. */
    onProgress?: (progress: number) => void;
};

/**
 * Drives the "video fills the screen, then recedes into a small, uncropped
 * card" scroll effect shared by Experience and (later) the MacBook section.
 * The video's own opacity is never touched — the black margin is just the
 * section's background showing through as the box shrinks — so the effect
 * can be reused wherever a plain black backdrop is appropriate.
 */
export function useScrollRecedeVideo({
    sectionRef,
    videoRef,
    boxRef,
    scrollDistance = "+=250%",
    recedeStart = 0,
    finalWidthRatio = 0.46,
    finalWidthRatioMobile = 0.86,
    finalRadius = 28,
    fallbackAspect = 16 / 9,
    onProgress,
}: ScrollRecedeVideoOptions) {
    useGSAP(() => {
        const section = sectionRef.current;
        const video = videoRef.current;
        const box = boxRef.current;
        if (!section || !video || !box) return;

        let aspect = fallbackAspect;
        const readAspect = () => {
            if (video.videoWidth && video.videoHeight) {
                aspect = video.videoWidth / video.videoHeight;
            }
        };
        readAspect();
        video.addEventListener("loadedmetadata", readAspect);

        const trigger = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: scrollDistance,
            pin: true,
            scrub: 0.6,
            onUpdate: (self) => {
                const rectRaw = recedeStart > 0
                    ? Math.max(0, (self.progress - recedeStart) / (1 - recedeStart))
                    : self.progress;
                const p = ease(rectRaw);
                const vw = window.innerWidth;
                const vh = window.innerHeight;
                const widthRatio = vw < 768 ? finalWidthRatioMobile : finalWidthRatio;
                // Cap by viewport height too so a tall/portrait video never
                // grows taller than the screen at rest.
                const finalWidth = Math.min(vw * widthRatio, vh * 0.82 * aspect);
                const finalHeight = finalWidth / aspect;

                gsap.set(box, {
                    width: lerp(vw, finalWidth, p),
                    height: lerp(vh, finalHeight, p),
                    left: lerp(0, (vw - finalWidth) / 2, p),
                    top: lerp(0, (vh - finalHeight) / 2, p),
                    borderRadius: lerp(0, finalRadius, p),
                });

                onProgress?.(self.progress);
            },
        });

        return () => {
            video.removeEventListener("loadedmetadata", readAspect);
            trigger.kill();
        };
    }, []);
}
