import exp from "@/assets/experience.jpg";

export function Experience() {
  return (
    <section id="experience" className="relative bg-black text-white overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 py-32 grid lg:grid-cols-2 gap-16 items-center">
        <div className="reveal">
          <p className="text-[13px] uppercase tracking-[0.25em] text-white/50 mb-6">
            La experiencia Apple
          </p>
          <h2 className="text-4xl md:text-6xl font-semibold leading-[1.05]">
            Todo conectado.
            <br />
            <span className="text-white/60">Todo sincronizado.</span>
          </h2>
          <p className="mt-8 text-lg text-white/70 max-w-md">
            Entrar al ecosistema Apple es descubrir una manera distinta de
            trabajar, crear y vivir. Tu iPhone, tu Mac, tu iPad y tu Watch
            hablan el mismo idioma — el tuyo.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-8">
            {[
              ["Continuidad", "Empieza en un dispositivo, termina en otro."],
              ["Privacidad", "Tus datos, siempre bajo tu control."],
              ["iCloud", "Todo, en todas partes, al instante."],
              ["Handoff", "Una experiencia fluida y natural."],
            ].map(([t, d]) => (
              <div key={t}>
                <div className="text-base font-semibold">{t}</div>
                <div className="text-sm text-white/60 mt-1">{d}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="reveal">
          <img
            src={exp}
            alt="Ecosistema Apple sincronizado"
            loading="lazy"
            className="w-full rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
}