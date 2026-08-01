import { useEffect, useState, useSyncExternalStore } from "react";
import { useProgress } from "@react-three/drei";
import { useFramesReady } from "@/lib/frame-preload";

// Broadcasts PageLoader's own `ready` flag (plain external store, same
// pattern as use-hero-phase.ts) so components with no parent/child
// relationship to it — Hero, mounted deep inside the routed page tree — can
// react to the loading screen actually being gone. Hero specifically needs
// this to delay the intro video's autoplay: without it, the video starts as
// soon as it mounts, hidden behind the splash screen, and can be partway
// through (or finished) by the time the screen fades out.
let pageLoaderReady = false;
const readyListeners = new Set<() => void>();

function publishPageLoaderReady(value: boolean) {
    if (value === pageLoaderReady) return;
    pageLoaderReady = value;
    readyListeners.forEach((l) => l());
}

function subscribePageLoaderReady(listener: () => void) {
    readyListeners.add(listener);
    return () => readyListeners.delete(listener);
}

function getPageLoaderReadySnapshot() {
    return pageLoaderReady;
}

function getServerSnapshot() {
    return false;
}

export function usePageLoaderReady(): boolean {
    return useSyncExternalStore(subscribePageLoaderReady, getPageLoaderReadySnapshot, getServerSnapshot);
}

/**
 * Drives the initial full-page loading screen. Combines three signals:
 *
 * - `useProgress` (drei), which tracks THREE.DefaultLoadingManager — in
 *   practice this is almost entirely the big iphone.glb fetch, since that's
 *   the only asset going through a THREE loader.
 * - `useFramesReady`, which tracks the Hero and Experience scroll-scrubbed
 *   frame sequences (heroIMG / experienceIMG) — these are fetched and
 *   decoded from inside a `useEffect`, which typically runs *after* the
 *   browser's own `load` event has already fired, so `load` alone can't be
 *   trusted to cover them.
 * - the browser `load` event, covering everything else (fonts, the first
 *   frame of each sequence already present in the initial markup, the
 *   background videos' initial buffering via their own network requests).
 *
 * `maxWaitMs` is a safety valve: if a loader errors out (e.g. the GLB fails
 * to fetch) progress can get stuck below 100 forever, so we force-reveal the
 * page after a timeout rather than trap the user behind a loading screen.
 */
export function useAppReady(minVisibleMs = 500, maxWaitMs = 15000) {
    const { progress, active } = useProgress();
    const framesReady = useFramesReady();
    const [windowLoaded, setWindowLoaded] = useState(
        typeof document !== "undefined" && document.readyState === "complete",
    );
    const [minVisibleElapsed, setMinVisibleElapsed] = useState(false);
    const [timedOut, setTimedOut] = useState(false);

    useEffect(() => {
        if (windowLoaded) return;
        const onLoad = () => setWindowLoaded(true);
        window.addEventListener("load", onLoad);
        return () => window.removeEventListener("load", onLoad);
    }, [windowLoaded]);

    useEffect(() => {
        const id = setTimeout(() => setMinVisibleElapsed(true), minVisibleMs);
        return () => clearTimeout(id);
    }, [minVisibleMs]);

    useEffect(() => {
        const id = setTimeout(() => setTimedOut(true), maxWaitMs);
        return () => clearTimeout(id);
    }, [maxWaitMs]);

    const glbDone = !active && progress >= 100;
    const ready = timedOut || (glbDone && framesReady && windowLoaded && minVisibleElapsed);

    useEffect(() => {
        publishPageLoaderReady(ready);
    }, [ready]);

    return { progress: Math.round(progress), ready };
}
