import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type HeroPhase = "top" | "frames" | "after";

// Watches the same pinned range Hero.tsx scrubs its frame sequence through
// (#top, "top top" -> "+=600%") without creating its own pin, so other fixed
// UI (Nav, SocialDock) can react to it: "top" before any scroll, "frames"
// while the sequence is being scrubbed (progress isn't 0 yet, but hasn't
// reached the end), "after" once scrolled past the pinned section.
export function useHeroPhase(): HeroPhase {
    const [phase, setPhase] = useState<HeroPhase>("top");

    useEffect(() => {
        const section = document.querySelector<HTMLElement>("#top");
        if (!section) return;

        const trigger = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "+=600%",
            onUpdate: (self) => {
                setPhase(self.progress >= 1 ? "after" : self.progress > 0 ? "frames" : "top");
            },
        });

        return () => trigger.kill();
    }, []);

    return phase;
}
