import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

/**
 * Drives the initial full-page loading screen. Combines two signals:
 *
 * - `useProgress` (drei), which tracks THREE.DefaultLoadingManager — in
 *   practice this is almost entirely the big iphone.glb fetch, since that's
 *   the only asset going through a THREE loader.
 * - the browser `load` event, covering everything else (fonts, images, the
 *   background video's initial buffering via its own network request).
 *
 * `maxWaitMs` is a safety valve: if a loader errors out (e.g. the GLB fails
 * to fetch) progress can get stuck below 100 forever, so we force-reveal the
 * page after a timeout rather than trap the user behind a loading screen.
 */
export function useAppReady(minVisibleMs = 500, maxWaitMs = 15000) {
    const { progress, active } = useProgress();
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
    const ready = timedOut || (glbDone && windowLoaded && minVisibleElapsed);

    return { progress: Math.round(progress), ready };
}
