import { useRef } from "react";
import gsap from "gsap";
import { useScrollRecedeVideo } from "@/hooks/use-scroll-recede-video";

const experienceVideo = "/hf_20260623_174336_b12e810c-f18f-441c-8da9-3081b622a409.mp4";

const FEATURES = [
    { title: "Continuidad", desc: "Empieza en un dispositivo, termina en otro." },
    { title: "Privacidad", desc: "Tus datos, siempre bajo tu control." },
    { title: "iCloud", desc: "Todo, en todas partes, al instante." },
    { title: "Handoff", desc: "Una experiencia fluida y natural." },
];

// The text phase (title + intro line, then the full features group) plays
// out while the video is still fullscreen, over the first 55% of the pin's
// scroll. Only after both slots have shown and faded does the recede
// (shrink-away) begin.
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
    const boxRef = useRef<HTMLDivElement>(null);
    const dimRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const introRef = useRef<HTMLDivElement>(null);
    const featuresRef = useRef<HTMLDivElement>(null);

    useScrollRecedeVideo({
        sectionRef,
        videoRef,
        boxRef,
        scrollDistance: "+=320%",
        recedeStart: TEXT_PHASE_END,
        onProgress: (progress) => {
            const tp = Math.min(progress / TEXT_PHASE_END, 1);

            // Text-phase envelope: fades in quickly, holds, fades out right
            // before the recede takes over — drives the dark filter and (via
            // its own slightly wider window) the title.
            const phase = trapezoid(tp, 0, 1, 0.06);
            // Filter covers the whole video, but only ever partially — it
            // dims for legibility without ever hiding the video underneath.
            gsap.set(dimRef.current, { opacity: phase * 0.6 });

            const titleAlpha = trapezoid(tp, 0, 1, 0.06);
            gsap.set(titleRef.current, { opacity: titleAlpha, y: (1 - titleAlpha) * -16 });

            const introAlpha = trapezoid(tp, SLOT_WINDOWS[0].from, SLOT_WINDOWS[0].to);
            gsap.set(introRef.current, { opacity: introAlpha, y: (1 - introAlpha) * 16 });

            const featuresAlpha = trapezoid(tp, SLOT_WINDOWS[1].from, SLOT_WINDOWS[1].to);
            gsap.set(featuresRef.current, { opacity: featuresAlpha, y: (1 - featuresAlpha) * 16 });
        },
    });

    return (
        <section
            id="experience"
            ref={sectionRef}
            className="relative min-h-screen overflow-hidden bg-black text-white"
        >
            <div ref={boxRef} className="absolute inset-0 overflow-hidden">
                <video
                    ref={videoRef}
                    src={experienceVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
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
