// Fully blocks page scrolling — wheel, touch, keyboard, and scrollbar-thumb
// dragging — by removing overflow from the document instead of trying to
// preventDefault every individual input event. That per-event approach
// can't cover scrollbar-thumb dragging at all: it never fires wheel or
// touchmove, only a native `scroll` event, which can't be preventDefault-ed.
// touchAction covers iOS Safari, where overflow: hidden alone doesn't stop
// touch-driven rubber-band scrolling.
export function lockPageScroll(): () => void {
    const { style } = document.documentElement;

    const previousOverflow = style.overflow;
    const previousTouchAction = style.touchAction;

    style.overflow = "hidden";
    style.touchAction = "none";

    return () => {
        style.overflow = previousOverflow;
        style.touchAction = previousTouchAction;
    };
}

// CustomScrollbar checks this before letting a thumb-drag move window
// scroll: without it, dragging the custom thumb during Hero's video-lock
// phase would call `window.scrollTo` directly, which (unlike user input)
// isn't blocked by `overflow: hidden` — the same class of bug this file
// exists to fix, just via a different input path.
export function isPageScrollLocked(): boolean {
    return document.documentElement.style.overflow === "hidden";
}
