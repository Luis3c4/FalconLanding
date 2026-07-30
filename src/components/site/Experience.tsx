import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const experienceVideo = "/hf_20260623_174336_b12e810c-f18f-441c-8da9-3081b622a409.mp4";

// MacBook camera pull-back frames (rendered on a black background, screen
// itself is flat black in every frame) — the <video> sits on top, tracking
// the screen's rect frame by frame, so it reads as the MacBook's wallpaper.
const macbookFrameModules = import.meta.glob("../../assets/experienceIMG/*.webp", {
    eager: true,
    query: "?url",
    import: "default",
});
const macbookFrameKeys = Object.keys(macbookFrameModules).sort();
const macbookFrames = macbookFrameKeys.map((key) => macbookFrameModules[key] as string);

const FRAME_W = 1920;
const FRAME_H = 1080;

// The screen's inner edges (as fractions of the frame image itself), hand-
// measured off the rendered frames at a few points along the pull-back and
// interpolated between them — the edges don't move at a uniform rate, so a
// single lerp from "fullscreen" to "final rect" isn't enough. At p=0 the
// screen fills the whole frame (camera starts inside it); by p=1 it's
// settled into the MacBook's actual screen position.
const SCREEN_RECT_KEYFRAMES = [
    { p: 0.00, l: 0.000, r: 1.000, t: 0.000, b: 1.000 },
    { p: 0.23, l: 0.035, r: 0.969, t: 0.000, b: 1.000 },
    { p: 0.35, l: 0.073, r: 0.934, t: 0.000, b: 0.980 },
    { p: 0.52, l: 0.135, r: 0.875, t: 0.025, b: 0.895 },
    { p: 0.76, l: 0.185, r: 0.815, t: 0.095, b: 0.885 },
    { p: 1.00, l: 0.205, r: 0.795, t: 0.135, b: 0.875 },
];

function screenRectAt(p: number) {
    const kfs = SCREEN_RECT_KEYFRAMES;
    if (p <= kfs[0].p) return kfs[0];
    if (p >= kfs[kfs.length - 1].p) return kfs[kfs.length - 1];
    for (let i = 0; i < kfs.length - 1; i++) {
        const a = kfs[i];
        const b = kfs[i + 1];
        if (p <= b.p) {
            const t = (p - a.p) / (b.p - a.p);
            return {
                l: a.l + (b.l - a.l) * t,
                r: a.r + (b.r - a.r) * t,
                t: a.t + (b.t - a.t) * t,
                b: a.b + (b.b - a.b) * t,
            };
        }
    }
    return kfs[kfs.length - 1];
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);

const FEATURES = [
    { title: "Continuidad", desc: "Empieza en un dispositivo, termina en otro." },
    { title: "Privacidad", desc: "Tus datos, siempre bajo tu control." },
    { title: "iCloud", desc: "Todo, en todas partes, al instante." },
    { title: "Handoff", desc: "Una experiencia fluida y natural." },
];

// The text phase (title + intro line, then the full features group) plays
// out while the video is still fullscreen, over the first 55% of the pin's
// scroll. Only after both slots have shown and faded does the MacBook
// camera pull-back begin.
const TEXT_PHASE_END = 0.55;

function trapezoid(t: number, from: number, to: number, edgeRatio = 0.35) {
    if (t <= from || t >= to) return 0;
    const span = to - from;
    const edge = span * edgeRatio;
    if (t < from + edge) return (t - from) / edge;
    if (t > to - edge) return (to - t) / edge;
    return 1;
}

// Two sequential slots below the title: the intro line, then all four
// features together as a group.
const SLOT_WINDOWS = [
    { from: 0.08, to: 0.46 },
    { from: 0.46, to: 1 },
];

export function Experience() {
    const sectionRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoBoxRef = useRef<HTMLDivElement>(null);
    const frameImgRef = useRef<HTMLImageElement>(null);
    const dimRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const introRef = useRef<HTMLDivElement>(null);
    const featuresRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        macbookFrames.forEach((src) => {
            const preload = new Image();
            preload.src = src;
        });
    }, []);

    useGSAP(() => {
        const section = sectionRef.current;
        const box = videoBoxRef.current;
        const img = frameImgRef.current;
        if (!section || !box || !img || macbookFrames.length === 0) return;

        const trigger = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "+=320%",
            pin: true,
            scrub: 0.6,
            onUpdate: (self) => {
                const progress = self.progress;
                const tp = Math.min(progress / TEXT_PHASE_END, 1);

                // Text-phase envelope: fades in quickly, holds, fades out
                // right before the pull-back takes over.
                const phase = trapezoid(tp, 0, 1, 0.06);
                gsap.set(dimRef.current, { opacity: phase * 0.6 });

                const titleAlpha = trapezoid(tp, 0, 1, 0.06);
                gsap.set(titleRef.current, { opacity: titleAlpha, y: (1 - titleAlpha) * -16 });

                const introAlpha = trapezoid(tp, SLOT_WINDOWS[0].from, SLOT_WINDOWS[0].to);
                gsap.set(introRef.current, { opacity: introAlpha, y: (1 - introAlpha) * 16 });

                const featuresAlpha = trapezoid(tp, SLOT_WINDOWS[1].from, SLOT_WINDOWS[1].to);
                gsap.set(featuresRef.current, { opacity: featuresAlpha, y: (1 - featuresAlpha) * 16 });

                // The MacBook pull-back only starts once the text phase is
                // fully done — same gating the plain recede used before.
                const recedeRaw = progress <= TEXT_PHASE_END
                    ? 0
                    : (progress - TEXT_PHASE_END) / (1 - TEXT_PHASE_END);
                const recede = ease(recedeRaw);

                const frameIndex = Math.min(
                    macbookFrames.length - 1,
                    Math.floor(recede * (macbookFrames.length - 1)),
                );
                const nextSrc = macbookFrames[frameIndex];
                if (img.src !== nextSrc) img.src = nextSrc;

                // Replicate the frame <img>'s own object-cover mapping by
                // hand, so the screen rect (normalized to the frame image)
                // can be converted into real viewport pixels for the video
                // box that sits on top of it.
                const rect = screenRectAt(recede);
                const vw = window.innerWidth;
                const vh = window.innerHeight;
                const scale = Math.max(vw / FRAME_W, vh / FRAME_H);
                const dW = FRAME_W * scale;
                const dH = FRAME_H * scale;
                const offX = (vw - dW) / 2;
                const offY = (vh - dH) / 2;

                gsap.set(box, {
                    left: offX + rect.l * dW,
                    top: offY + rect.t * dH,
                    width: (rect.r - rect.l) * dW,
                    height: (rect.b - rect.t) * dH,
                    borderRadius: lerp(0, 14, recede),
                });
            },
        });

        return () => trigger.kill();
    }, []);

    return (
        <section
            id="experience"
            ref={sectionRef}
            className="relative min-h-screen overflow-hidden bg-black text-white"
        >
            <img
                ref={frameImgRef}
                src={macbookFrames[0]}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
            />

            <div ref={videoBoxRef} className="absolute overflow-hidden">
                <video
                    ref={videoRef}
                    src={experienceVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-contain"
                />
            </div>

            {/* Dark filter over the whole video for legibility — dims, never
                hides it completely. */}
            <div ref={dimRef} className="pointer-events-none absolute inset-0 bg-black opacity-0" />

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-8 px-6 text-center">
                <div ref={titleRef} className="flex flex-col items-center opacity-0">
                    <p className="mb-4 text-[13px] uppercase tracking-[0.25em] text-white/50">
                        La experiencia Apple
                    </p>
                    <h2 className="text-4xl font-semibold leading-[1.05] md:text-6xl">
                        Todo conectado.
                        <br />
                        <span className="text-white/60">Todo sincronizado.</span>
                    </h2>
                </div>

                <div className="relative min-h-32 w-full max-w-3xl">
                    <div ref={introRef} className="absolute inset-x-0 opacity-0">
                        <p className="mx-auto max-w-md text-lg text-white/80 md:text-xl">
                            Tu iPhone, tu Mac, tu iPad y tu Watch hablan el mismo
                            idioma — el tuyo.
                        </p>
                    </div>
                    <div
                        ref={featuresRef}
                        className="absolute inset-x-0 grid grid-cols-2 gap-x-10 gap-y-6 opacity-0 sm:grid-cols-4"
                    >
                        {FEATURES.map((f) => (
                            <div key={f.title}>
                                <div className="text-base font-semibold">{f.title}</div>
                                <div className="mt-1 text-sm text-white/60">{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
