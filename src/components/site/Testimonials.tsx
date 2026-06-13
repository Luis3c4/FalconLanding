const items = [
  {
    q: "El servicio de FalconTec es impecable. Me asesoraron para elegir el MacBook perfecto para mi estudio.",
    n: "Mariana López",
    r: "Diseñadora",
  },
  {
    q: "Compré mi iPhone y llegó sellado, original y con garantía. Confianza total.",
    n: "Andrés Ramírez",
    r: "Fotógrafo",
  },
  {
    q: "Pasé al ecosistema Apple gracias a su equipo. La diferencia se nota cada día.",
    n: "Sofía Núñez",
    r: "Emprendedora",
  },
];

export function Testimonials() {
  return (
    <section className="py-32 px-6 bg-secondary">
      <div className="mx-auto max-w-7xl">
        <div className="reveal text-center mb-16">
          <p className="text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
            Testimonios
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight">
            Lo que dicen <span className="text-gradient">nuestros clientes.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((t) => (
            <figure
              key={t.n}
              className="reveal bg-background rounded-3xl p-10 shadow-soft border border-border/50"
            >
              <div className="text-3xl text-gradient leading-none">&ldquo;</div>
              <blockquote className="mt-4 text-lg leading-relaxed text-foreground/90">
                {t.q}
              </blockquote>
              <figcaption className="mt-8 pt-6 border-t border-border">
                <div className="font-semibold text-sm">{t.n}</div>
                <div className="text-xs text-muted-foreground mt-1">{t.r}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}   