import { useEffect, useState } from "react";
import type { Variant } from "./variants";

export function useImageSwapTransition(selected: Variant) {
    const [displayed, setDisplayed] = useState(selected);
    const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");

    useEffect(() => {
        if (selected.id === displayed.id) {
            return;
        }

        setPhase("out");

        const swapTimer = setTimeout(() => {
            setDisplayed(selected);
            setPhase("in");
        }, 180);

        const settleTimer = setTimeout(() => {
            setPhase("idle");
        }, 460);

        return () => {
            clearTimeout(swapTimer);
            clearTimeout(settleTimer);
        };
    }, [displayed.id, selected]);

    const imageClass =
        phase === "out"
            ? "opacity-0 scale-[0.985] blur-[1px]"
            : "opacity-100 scale-100 blur-0";

    return { displayed, imageClass };
}
