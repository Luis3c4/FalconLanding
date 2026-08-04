// Fires `onIntent` once, on the user's first scroll-like input — wheel,
// touch drag, keyboard (arrows/page/space/home/end), or dragging the
// scrollbar thumb itself. Wheel/touchmove alone miss that last one:
// dragging the scrollbar thumb only ever emits a native `scroll` event.
const SCROLL_KEYS = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "]);

export function onScrollIntent(onIntent: () => void, options: { signal?: AbortSignal } = {}) {
    const controller = new AbortController();
    const signal = options.signal
        ? AbortSignal.any([options.signal, controller.signal])
        : controller.signal;

    const fire = () => {
        controller.abort();
        onIntent();
    };
    const onKeydown = (event: KeyboardEvent) => {
        if (SCROLL_KEYS.has(event.key)) fire();
    };

    window.addEventListener("wheel", fire, { passive: true, signal });
    window.addEventListener("touchmove", fire, { passive: true, signal });
    window.addEventListener("scroll", fire, { passive: true, signal });
    window.addEventListener("keydown", onKeydown, { signal });
}
