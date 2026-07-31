import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Logo } from "@/components/site/Logo";
import { useAppReady } from "@/hooks/use-app-ready";

gsap.registerPlugin(useGSAP);

export function PageLoader() {
    const { progress, ready } = useAppReady();
    const [mounted, setMounted] = useState(true);
    const overlayRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);

    // Block scroll behind the overlay while it's up — the page's sections
    // are all mounted and animating (GSAP ScrollTriggers, the 3D scene)
    // underneath it the whole time, only hidden visually.
    useEffect(() => {
        if (!mounted) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, [mounted]);

    useGSAP(() => {
        if (!barRef.current) return;
        gsap.to(barRef.current, { width: `${progress}%`, duration: 0.4, ease: "power2.out" });
    }, [progress]);

    useGSAP(() => {
        if (!ready || !overlayRef.current) return;
        gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0.6,
            delay: 0.2,
            ease: "power2.inOut",
            onComplete: () => setMounted(false),
        });
    }, [ready]);

    if (!mounted) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-100 flex flex-col items-center justify-center gap-6 bg-gradient-dark"
        >
            <Logo className="h-10 w-auto animate-pulse" />
            <div className="h-px w-40 overflow-hidden rounded-full bg-white/15">
                <div ref={barRef} className="h-full w-0 rounded-full bg-white" />
            </div>
            <p className="text-xs tracking-[0.2em] text-white/50 tabular-nums">{progress}%</p>
        </div>
    );
}
