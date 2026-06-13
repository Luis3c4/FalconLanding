const items = [
    { t: "Productos originales", d: "100% auténticos, sellados de fábrica con número de serie verificable." },
    { t: "Última generación", d: "Los modelos más recientes del catálogo Apple, recién llegados." },
    { t: "Atención experta", d: "Asesores certificados que entienden cada detalle del ecosistema." },
    { t: "Garantía oficial", d: "Cobertura Apple respaldada por el distribuidor autorizado." },
    { t: "Proceso seguro", d: "Transparencia total desde la consulta hasta la entrega." },
    { t: "Soporte post-venta", d: "Acompañamiento continuo después de tu compra." },
];

export function WhyUs() {
    return (
        <section id="why" className="py-32 px-6 bg-background">
            <div className="mx-auto max-w-7xl">
                <div className="reveal text-center mb-20">
                    <p className="text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
                        Por qué FalconTec
                    </p>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight">
                        Una experiencia premium,
                        <br />
                        <span className="text-gradient">de principio a fin.</span>
                    </h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-3xl overflow-hidden">
                    {items.map((it, i) => (
                        <div
                            key={it.t}
                            className="reveal bg-background p-10 hover:bg-secondary transition-colors duration-500"
                        >
                            <div className="text-xs text-muted-foreground tabular-nums">
                                0{i + 1}
                            </div>
                            <h3 className="mt-6 text-xl font-semibold">{it.t}</h3>
                            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                                {it.d}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}