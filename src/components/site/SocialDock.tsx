import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useHeroPhase } from "@/hooks/use-hero-phase";

// The bare icon buttons, reused both by the standalone dock below and by
// Nav's merged top-center pill once the hero's frame sequence is done.
export function SocialIcons({ iconClassName }: { iconClassName?: string }) {
    return (
        <>
            <a href="#" className={cn("inline-flex items-center justify-center rounded-lg text-white/90 transition hover:bg-white/15 hover:text-white", iconClassName)}>
                <svg className="h-5 w-5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 12a4 4 0 1 1 8 0a4 4 0 0 1-8 0" />
                    <path d="M12.05 1c1.827 0 3.266 0 4.42.105c1.178.106 2.156.328 3.03.833A7 7 0 0 1 22.062 4.5c.505.874.727 1.852.833 3.03C23 8.684 23 10.123 23 11.95v.1c0 1.827 0 3.266-.105 4.42c-.106 1.178-.328 2.156-.833 3.03a7 7 0 0 1-2.562 2.562c-.874.505-1.852.727-3.03.833c-1.154.105-2.593.105-4.42.105h-.1c-1.827 0-3.266 0-4.42-.105c-1.178-.106-2.156-.328-3.03-.833A7 7 0 0 1 1.938 19.5c-.505-.874-.727-1.852-.833-3.03C1 15.316 1 13.877 1 12.05v-.1c0-1.827 0-3.266.105-4.42c.106-1.178.328-2.156.833-3.03A7 7 0 0 1 4.5 1.938c.874-.505 1.852-.727 3.03-.833C8.684 1 10.123 1 11.95 1zm6.2 3.75a1 1 0 0 0-1 1v.004a1 1 0 0 0 1 1h.004a1 1 0 0 0 1-1V5.75a1 1 0 0 0-1-1zM12 6a6 6 0 1 0 0 12a6 6 0 0 0 0-12" />
                </svg>
            </a>
            <a href="#" className={cn("inline-flex items-center justify-center rounded-lg text-white/90 transition hover:bg-white/15 hover:text-white", iconClassName)}>
                <svg className="h-5 w-5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            </a>
            <a href="#" className={cn("inline-flex items-center justify-center rounded-lg text-white/90 transition hover:bg-white/15 hover:text-white", iconClassName)}>
                <svg className="h-5 w-5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]" fill="currentColor" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                    <path d="M64 32C28.7 32 0 60.7 0 96v320c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64zm297.1 84L257.3 234.6L379.4 396h-95.6L209 298.1L123.3 396H75.8l111-126.9L69.7 116h98l67.7 89.5l78.2-89.5zm-37.8 251.6L153.4 142.9h-28.3l171.8 224.7h26.3z" />
                </svg>
            </a>
        </>
    );
}

// Floating social icons dock, right side of the viewport. Only shown before
// the hero's frame sequence starts: it hides on the first real scroll (same
// moment the hero frames take over) and, once scrolled past that block,
// stays hidden because its icons re-appear merged into Nav's top-center pill
// instead of a separate standalone dock. Also hides near the footer via an
// IntersectionObserver, for the brief window it's still the "top" phase.
export function SocialDock() {
    const phase = useHeroPhase();
    const [footerVisible, setFooterVisible] = useState(false);

    useEffect(() => {
        const footer = document.querySelector("footer");
        if (!footer) return;

        const io = new IntersectionObserver(
            ([entry]) => setFooterVisible(entry.isIntersecting),
            { threshold: 0 },
        );
        io.observe(footer);
        return () => io.disconnect();
    }, []);

    const visible = phase === "top" && !footerVisible;

    return (
        <div
            className={cn(
                "hidden lg:flex fixed right-14 top-1/2 z-50 -translate-y-1/2 flex-col items-end transition-opacity duration-300",
                visible ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
        >
            <div className="animate-fade-up flex items-center justify-end" style={{ animationDelay: "240ms" }}>
                <div className="glass-dock flex flex-col gap-3 rounded-full px-3 py-4">
                    <SocialIcons iconClassName="h-10 w-10" />
                </div>
            </div>
        </div>
    );
}
