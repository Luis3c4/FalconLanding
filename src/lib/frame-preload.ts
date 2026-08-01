import { useSyncExternalStore } from "react";

// A plain external store (same pattern as use-hero-phase.ts) so PageLoader —
// mounted in __root.tsx, with no parent/child relationship to Hero or
// Experience — can find out when their frame sequences are actually decoded
// and ready to paint, instead of only knowing about the GLB (via drei's
// useProgress) and the browser's native `load` event, neither of which
// covers images fetched from inside a useEffect after hydration.
type Group = { total: number; loaded: number };
const groups = new Map<string, Group>();
const listeners = new Set<() => void>();

function notify() {
    listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function allReady() {
    for (const g of groups.values()) {
        if (g.loaded < g.total) return false;
    }
    return true;
}

let snapshot = true;
function getSnapshot() {
    return snapshot;
}

/**
 * Preloads and force-decodes every image in `srcs`, tracked under `key` as
 * one group. A single failed/broken frame still counts as "settled" (not
 * stuck) so it can't block the loading screen forever.
 */
export function preloadImages(key: string, srcs: string[]) {
    groups.set(key, { total: srcs.length, loaded: 0 });
    snapshot = allReady();
    notify();

    srcs.forEach((src) => {
        const img = new Image();
        img.src = src;
        const settle = () => {
            const g = groups.get(key);
            if (!g) return;
            g.loaded += 1;
            const next = allReady();
            if (next !== snapshot) {
                snapshot = next;
                notify();
            }
        };
        if (img.decode) {
            img.decode().then(settle).catch(settle);
        } else {
            img.onload = settle;
            img.onerror = settle;
        }
    });
}

export function useFramesReady(): boolean {
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
