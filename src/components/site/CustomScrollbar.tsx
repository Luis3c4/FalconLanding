import { useEffect, useRef } from "react";
import { isPageScrollLocked } from "@/hooks/use-scroll-lock";

// Replaces the native (now hidden, see styles.css) scrollbar with a thin,
// auto-hiding thumb — Apple/macOS overlay-scrollbar style. Only the thumb is
// visible/draggable; there's no rendered track. Position and height are
// written straight to the DOM via refs rather than React state, so dragging
// and scrolling stay perfectly smooth without triggering re-renders.
const EDGE_PADDING = 8; // px kept clear at the very top/bottom of the viewport
const MIN_THUMB_HEIGHT = 32; // px, so the thumb stays grabbable on long pages
const HIDE_DELAY = 900; // ms of inactivity before the thumb fades out

export function CustomScrollbar() {
    const thumbRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const thumb = thumbRef.current;
        if (!thumb) return;

        let rafId = 0;
        let hideTimer: ReturnType<typeof setTimeout>;
        let dragging = false;
        let dragStartClientY = 0;
        let dragStartScrollY = 0;
        let availableTravel = 0;
        let scrollableHeight = 0;

        const setVisible = (visible: boolean) => {
            thumb.style.opacity = visible ? "1" : "0";
        };

        const scheduleHide = () => {
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => {
                if (!dragging) setVisible(false);
            }, HIDE_DELAY);
        };

        const update = () => {
            rafId = 0;
            const viewportHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            scrollableHeight = documentHeight - viewportHeight;

            // Nothing to scroll (or Hero's video-intro lock is active): hide
            // entirely rather than show a thumb that can't actually move
            // anything.
            if (scrollableHeight <= 1 || isPageScrollLocked()) {
                thumb.style.display = "none";
                return;
            }
            thumb.style.display = "block";

            const trackHeight = viewportHeight - EDGE_PADDING * 2;
            const thumbHeight = Math.max(
                MIN_THUMB_HEIGHT,
                (viewportHeight / documentHeight) * trackHeight,
            );
            availableTravel = trackHeight - thumbHeight;

            const progress = Math.min(1, Math.max(0, window.scrollY / scrollableHeight));
            const top = EDGE_PADDING + progress * availableTravel;

            thumb.style.height = `${thumbHeight}px`;
            thumb.style.transform = `translateY(${top}px)`;
        };

        const requestUpdate = () => {
            if (rafId) return;
            rafId = requestAnimationFrame(update);
        };

        const onScroll = () => {
            requestUpdate();
            if (!dragging) {
                setVisible(true);
                scheduleHide();
            }
        };

        const onPointerEnter = () => {
            if (isPageScrollLocked()) return;
            clearTimeout(hideTimer);
            setVisible(true);
        };
        const onPointerLeave = () => {
            if (!dragging) scheduleHide();
        };

        const onPointerDown = (event: PointerEvent) => {
            if (event.pointerType !== "mouse" || isPageScrollLocked() || availableTravel <= 0) return;
            event.preventDefault();
            dragging = true;
            dragStartClientY = event.clientY;
            dragStartScrollY = window.scrollY;
            document.documentElement.style.userSelect = "none";
            thumb.setPointerCapture(event.pointerId);
        };

        const onPointerMove = (event: PointerEvent) => {
            if (!dragging || availableTravel <= 0) return;
            const deltaY = event.clientY - dragStartClientY;
            const scrollDelta = (deltaY / availableTravel) * scrollableHeight;
            window.scrollTo(0, dragStartScrollY + scrollDelta);
        };

        const endDrag = () => {
            if (!dragging) return;
            dragging = false;
            document.documentElement.style.userSelect = "";
            scheduleHide();
        };

        const resizeObserver = new ResizeObserver(requestUpdate);
        resizeObserver.observe(document.documentElement);

        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", requestUpdate);
        thumb.addEventListener("pointerenter", onPointerEnter);
        thumb.addEventListener("pointerleave", onPointerLeave);
        thumb.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", endDrag);
        window.addEventListener("pointercancel", endDrag);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            clearTimeout(hideTimer);
            resizeObserver.disconnect();
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", requestUpdate);
            thumb.removeEventListener("pointerenter", onPointerEnter);
            thumb.removeEventListener("pointerleave", onPointerLeave);
            thumb.removeEventListener("pointerdown", onPointerDown);
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", endDrag);
            window.removeEventListener("pointercancel", endDrag);
        };
    }, []);

    return (
        <div
            ref={thumbRef}
            aria-hidden="true"
            className="fixed right-1 top-0 z-60 w-1.5 cursor-pointer rounded-full bg-foreground/30 opacity-0 transition-[opacity,background-color] duration-300 hover:bg-foreground/50 active:bg-foreground/60"
            style={{ touchAction: "none" }}
        />
    );
}
