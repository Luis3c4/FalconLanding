import featured from "@/assets/featured-iphone.jpg";
import macbook from "@/assets/macbook.jpg";
import ipad from "@/assets/ipad.jpg";

export function Featured() {
    return (
        <section id="featured" className="bg-background">
            <div className="relative min-h-[90vh] bg-gradient-dark text-background flex items-center overflow-hidden">
                <div className="mx-auto max-w-7xl w-full px-6 grid md:grid-cols-2 gap-12 items-center py-24">
                    <div className="reveal">
                        <p className="text-[13px] uppercase tracking-[0.25em] text-white/50 mb-6">
                            Última generación
                        </p>
                        <h2 className="text-5xl md:text-7xl font-semibold leading-[1.05] text-white">
                            iPhone.
                            <br />
                            <span className="text-white/60">Forjado en titanio.</span>
                        </h2>
                        <p className="mt-6 text-lg text-white/70 max-w-md">
                            El smartphone más avanzado de Apple, con chip de última
                            generación, cámara Pro y diseño aeroespacial.
                        </p>
                        <ul className="mt-10 space-y-4 text-sm text-white/80">
                            {[
                                "Chip A-series con Neural Engine",
                                "Sistema de cámara Pro 48MP",
                                "Pantalla Super Retina XDR",
                                "Conectividad USB-C",
                            ].map((f) => (
                                <li key={f} className="flex items-center gap-3">
                                    <span className="h-1 w-6 bg-white/40" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="reveal relative">
                        <img
                            src={featured}
                            alt="iPhone última generación"
                            loading="lazy"
                            className="w-full max-w-md mx-auto animate-float"
                        />
                    </div>
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-px bg-border">
                {[
                    {
                        t: "MacBook Pro",
                        s: "Una bestia de potencia.",
                        d: "Rendimiento profesional para crear, diseñar y construir sin límites.",
                        img: macbook,
                    },
                    {
                        t: "iPad Pro",
                        s: "Tu lienzo infinito.",
                        d: "Liviano, brillante y diseñado para profesionales creativos.",
                        img: ipad,
                    },
                ].map((c) => (
                    <article
                        key={c.t}
                        className="reveal bg-secondary p-10 md:p-16 flex flex-col justify-between min-h-140 group"
                    >
                        <div>
                            <h3 className="text-3xl md:text-4xl font-semibold">{c.t}</h3>
                            <p className="text-xl text-muted-foreground mt-2">{c.s}</p>
                            <p className="text-sm text-muted-foreground mt-4 max-w-sm">
                                {c.d}
                            </p>
                        </div>
                        <img
                            src={c.img}
                            alt={c.t}
                            loading="lazy"
                            className="mt-8 w-full max-w-md mx-auto transition-transform duration-700 group-hover:-translate-y-2"
                        />
                    </article>
                ))}
            </div>
        </section>
    );
}