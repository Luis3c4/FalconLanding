import iphone from "@/assets/iphone.jpg";
import macbook from "@/assets/macbook.jpg";
import ipad from "@/assets/ipad.jpg";
import watch from "@/assets/watch.jpg";
import airpods from "@/assets/airpods.jpg";

const items = [
    {
        title: "iPhone",
        tag: "Diseñado para asombrar",
        img: iphone,
        span: "md:col-span-2 md:row-span-2",
        tall: true,
    },
    { title: "MacBook", tag: "Potencia profesional", img: macbook, span: "md:col-span-2" },
    { title: "iPad", tag: "Tu lienzo digital", img: ipad, span: "md:col-span-2" },
    { title: "Apple Watch", tag: "Salud en tu muñeca", img: watch, span: "" },
    { title: "AirPods", tag: "Sonido inmersivo", img: airpods, span: "" },
];

export function Ecosystem() {
    return (
        <section id="ecosystem" className="py-32 px-6 bg-secondary">
            <div className="mx-auto max-w-7xl">
                <div className="text-center reveal mb-16">
                    <p className="text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
                        Ecosistema Apple
                    </p>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight">
                        Un universo perfectamente
                        <br />
                        <span className="text-gradient">conectado.</span>
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 md:auto-rows-[280px]">
                    {items.map((it) => (
                        <article
                            key={it.title}
                            className={`reveal group relative overflow-hidden rounded-3xl bg-background shadow-soft ${it.span}`}
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <img
                                    src={it.img}
                                    alt={it.title}
                                    loading="lazy"
                                    className={`object-contain transition-transform duration-700 ease-out group-hover:scale-105 ${it.tall ? "h-[88%]" : "h-[72%]"
                                        }`}
                                />
                            </div>
                            <div className="absolute inset-x-0 top-0 p-6 md:p-8">
                                <h3 className="text-2xl md:text-3xl font-semibold">{it.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{it.tag}</p>
                            </div>
                            <div className="absolute bottom-6 right-6 h-9 w-9 rounded-full bg-foreground/90 text-background flex items-center justify-center text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                →
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}