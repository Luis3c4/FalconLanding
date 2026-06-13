import hero from "@/assets/hero-ecosystem.jpg";

export function Hero() {
    return (
        <section
            id="top"
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-silver pt-24"
        >
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[60vh] w-[60vh] rounded-full bg-white blur-3xl opacity-70" />
            </div>
            <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
                <p className="animate-fade-up text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
                    Distribuidor Garantizado de Apple
                </p>
                <h1
                    className="animate-fade-up text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[1.02] tracking-tight"
                    style={{ animationDelay: "120ms" }}
                >
                    La innovación,
                    <br />
                    <span className="text-gradient">en su forma más pura.</span>
                </h1>
                <p
                    className="animate-fade-up mt-7 mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground"
                    style={{ animationDelay: "260ms" }}
                >
                    Descubre el ecosistema Apple completo en FalconTec. iPhone, MacBook,
                    iPad, Apple Watch y AirPods, originales y de última generación.
                </p>
                <div
                    className="animate-fade-up mt-10 flex items-center justify-center gap-3"
                    style={{ animationDelay: "380ms" }}
                >
                    <a
                        href="#ecosystem"
                        className="px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition"
                    >
                        Explorar ecosistema
                    </a>
                    <a
                        href="#contact"
                        className="px-6 py-3 rounded-full border border-foreground/20 text-sm font-medium hover:bg-foreground/5 transition"
                    >
                        Hablar con un experto
                    </a>
                </div>
                <div className="relative mt-16 animate-hero">
                    <img
                        src={hero}
                        alt="Ecosistema Apple — iPhone, MacBook, iPad, Apple Watch, AirPods"
                        width={1920}
                        height={1080}
                        className="w-full max-w-5xl mx-auto select-none animate-float"
                        draggable={false}
                    />
                </div>
            </div>
        </section>
    );
}