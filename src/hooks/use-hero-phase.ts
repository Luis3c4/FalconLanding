import { useSyncExternalStore } from "react";

export type HeroPhase = "top" | "frames" | "after";

// A plain external store instead of each consumer creating its own
// ScrollTrigger on Hero's #top: that section is actively pinned by Hero's
// own trigger for the entire "top"..."after" range, and a second, unrelated
// ScrollTrigger reading that same (already-pinned) element's rect computes a
// bogus, offset start/end instead of matching Hero's real one. Hero's own
// trigger is the only correct source of truth for this progress, so it just
// pushes phase updates here directly from its own onUpdate.
let phase: HeroPhase = "top";
const listeners = new Set<() => void>();

export function setHeroPhase(next: HeroPhase) {
    if (next === phase) return;
    phase = next;
    listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function getSnapshot() {
    return phase;
}

export function useHeroPhase(): HeroPhase {
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
