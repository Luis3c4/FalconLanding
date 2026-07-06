import { useState } from "react";

export function Contact() {
    const [sent, setSent] = useState(false);
    return (
        <section id="contact" className="py-32 px-6 bg-background">
            <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16">
                <div className="reveal">
                    <p className="text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
                        Contacto
                    </p>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight">
                        Hablemos del
                        <br />
                        <span className="text-gradient">producto perfecto para ti.</span>
                    </h2>
                    <p className="mt-8 text-lg text-muted-foreground max-w-md">
                        Nuestro equipo de expertos está listo para asesorarte y ayudarte a
                        elegir el dispositivo Apple ideal.
                    </p>
                    <div className="mt-10 space-y-5">
                        <a
                            href="https://wa.me/000000000"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition"
                        >
                            <span className="h-2 w-2 rounded-full bg-green-400" />
                            WhatsApp
                        </a>
                        <div className="text-sm text-muted-foreground space-y-2 pt-4">
                            <div>
                                <span className="text-foreground font-medium">Tienda — </span>
                                Av. Principal 123, Ciudad
                            </div>
                            <div>
                                <span className="text-foreground font-medium">Lun – Sáb — </span>
                                10:00 a 19:00
                            </div>
                            <div>
                                <span className="text-foreground font-medium">Email — </span>
                                hola@falcontec.com
                            </div>
                        </div>
                        <div className="flex gap-3 pt-4">
                            {["Instagram", "Facebook", "TikTok", "X"].map((s) => (
                                <a
                                    key={s}
                                    href="#"
                                    className="text-xs px-4 py-2 rounded-full border border-border hover:bg-secondary transition"
                                >
                                    {s}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setSent(true);
                    }}
                    className="reveal bg-secondary rounded-3xl p-8 md:p-10 space-y-5"
                >
                    <div className="grid sm:grid-cols-2 gap-5">
                        <Field label="Nombre" name="name" />
                        <Field label="Apellido" name="last" />
                    </div>
                    <Field label="Email" name="email" type="email" />
                    <Field label="Teléfono" name="phone" />
                    <div>
                        <label className="text-xs uppercase tracking-wider text-muted-foreground">
                            Producto de interés
                        </label>
                        <select className="mt-2 w-full bg-background rounded-xl border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10">
                            <option>iPhone</option>
                            <option>MacBook</option>
                            <option>iPad</option>
                            <option>Apple Watch</option>
                            <option>AirPods</option>
                            <option>Accesorios</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs uppercase tracking-wider text-muted-foreground">
                            Mensaje
                        </label>
                        <textarea
                            rows={4}
                            className="mt-2 w-full bg-background rounded-xl border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10 resize-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-6 py-3.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition"
                    >
                        {sent ? "Mensaje enviado ✓" : "Enviar mensaje"}
                    </button>
                </form>
            </div>
        </section>
    );
}

function Field({
    label,
    name,
    type = "text",
}: {
    label: string;
    name: string;
    type?: string;
}) {
    return (
        <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">
                {label}
            </label>
            <input
                name={name}
                type={type}
                className="mt-2 w-full bg-background rounded-xl border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10"
            />
        </div>
    );
}