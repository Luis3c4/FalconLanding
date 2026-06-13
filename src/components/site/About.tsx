export function About() {
  return (
    <section id="about" className="py-32 px-6 bg-background">
      <div className="mx-auto max-w-5xl text-center reveal">
        <p className="text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
          Sobre FalconTec
        </p>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight">
          Confianza, calidad y{" "}
          <span className="text-gradient">productos 100% originales.</span>
        </h2>
        <p className="mt-8 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
          Somos distribuidor garantizado de Apple. Cada dispositivo que sale de
          FalconTec llega con la promesa de autenticidad, soporte experto y la
          experiencia que define a la marca más admirada del mundo.
        </p>
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-10">
          {[
            ["+10k", "Clientes satisfechos"],
            ["100%", "Productos originales"],
            ["Apple", "Garantía oficial"],
            ["24/7", "Atención experta"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="text-3xl sm:text-4xl font-semibold text-gradient">
                {n}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}