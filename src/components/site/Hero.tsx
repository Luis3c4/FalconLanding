import hero from "@/assets/hero-ecosystem.jpg";

export function Hero() {
    return (
        <section
            id="top"
            className="relative min-h-screen overflow-hidden bg-gradient-silver pt-24 pb-14"
        >
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[60vh] w-[60vh] rounded-full bg-white blur-3xl opacity-70" />
                <div className="absolute top-28 left-[12%] h-44 w-44 rounded-full bg-white/70 blur-3xl" />
                <div className="absolute bottom-24 right-[10%] h-56 w-56 rounded-full bg-white/65 blur-3xl" />
            </div>
            <div className="relative z-10 w-full">
                <div className="relative grid min-h-[84vh] grid-cols-1 gap-8 px-6 py-10 sm:px-8 lg:grid-cols-12 lg:px-14 lg:py-10 ">
                    <div className="order-1 flex h-full flex-col lg:col-span-4 lg:pt-10 ">
                        <p className="animate-fade-up text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                             FalconTec
                        </p>
                        <h1
                            className="animate-fade-up mt-5 max-w-sm text-4xl font-semibold leading-[0.95] tracking-[-0.03em] sm:text-5xl lg:text-6xl text-gradient"
                            style={{ animationDelay: "120ms" }}
                        >
                            Tecnología
                            <br />
                            premium
                            <br />
                            que se
                            <br />
                            siente real
                        </h1>
                        <div className="mt-auto">
                            <p
                                className="animate-fade-up mt-10 max-w-sm text-sm text-muted-foreground sm:text-base"
                                style={{ animationDelay: "220ms" }}
                            >
                                Armamos experiencias Apple completas para personas y equipos
                                que quieren rendimiento, diseño y respaldo en un mismo lugar.
                            </p>

                            <div
                                className="animate-fade-up mt-8 flex flex-wrap items-center gap-3 bg-gradient"
                                style={{ animationDelay: "320ms" }}
                            >
                                <a
                                    href="#ecosystem"
                                    className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90"
                                >
                                    Ver catálogo
                                </a>
                                <a
                                    href="#contact"
                                    className="rounded-full border border-foreground/20 px-6 py-3 text-sm font-medium transition hover:bg-foreground/5"
                                >
                                    Asesoría directa
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="order-3 flex items-center justify-center lg:order-2 lg:col-span-5">
                        <div className="relative w-full animate-hero">
                            <img
                                src={hero}
                                alt="Ecosistema Apple — iPhone, MacBook, iPad, Apple Watch, AirPods"
                                width={1920}
                                height={1080}
                                className="mx-auto w-full max-w-xl select-none drop-shadow-[0_28px_50px_rgba(0,0,0,0.2)]"
                                draggable={false}
                            />
                        </div>
                    </div>

                    <div className="order-2 flex flex-col  lg:order-3 lg:col-span-3 lg:pt-8 space-y-12">
                        <div className="animate-fade-up text-right" style={{ animationDelay: "160ms" }}>
                            <p className="text-5xl font-semibold leading-none sm:text-6xl">100%</p>
                            <p className="mt-1 text-sm uppercase tracking-[0.18em] text-muted-foreground">originales</p>
                            <p className="ml-auto mt-4 max-w-[18rem] text-sm text-muted-foreground">
                                Equipamos marcas y creadores con tecnología confiable para
                                acelerar su operación digital.
                            </p>
                        </div>
                        <div className="animate-fade-up flex items-center justify-end" style={{ animationDelay: "240ms" }}>
                            <div className="flex flex-col gap-3 rounded-full bg-gray-300/50 px-3 py-4 backdrop-blur-sm">
                                <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-400/50">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 12a4 4 0 1 1 8 0a4 4 0 0 1-8 0" />
                                        <path d="M12.05 1c1.827 0 3.266 0 4.42.105c1.178.106 2.156.328 3.03.833A7 7 0 0 1 22.062 4.5c.505.874.727 1.852.833 3.03C23 8.684 23 10.123 23 11.95v.1c0 1.827 0 3.266-.105 4.42c-.106 1.178-.328 2.156-.833 3.03a7 7 0 0 1-2.562 2.562c-.874.505-1.852.727-3.03.833c-1.154.105-2.593.105-4.42.105h-.1c-1.827 0-3.266 0-4.42-.105c-1.178-.106-2.156-.328-3.03-.833A7 7 0 0 1 1.938 19.5c-.505-.874-.727-1.852-.833-3.03C1 15.316 1 13.877 1 12.05v-.1c0-1.827 0-3.266.105-4.42c.106-1.178.328-2.156.833-3.03A7 7 0 0 1 4.5 1.938c.874-.505 1.852-.727 3.03-.833C8.684 1 10.123 1 11.95 1zm6.2 3.75a1 1 0 0 0-1 1v.004a1 1 0 0 0 1 1h.004a1 1 0 0 0 1-1V5.75a1 1 0 0 0-1-1zM12 6a6 6 0 1 0 0 12a6 6 0 0 0 0-12" />
                                    </svg>
                                </a>
                                <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-400/50">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-400/50">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M64 32C28.7 32 0 60.7 0 96v320c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64zm297.1 84L257.3 234.6L379.4 396h-95.6L209 298.1L123.3 396H75.8l111-126.9L69.7 116h98l67.7 89.5l78.2-89.5zm-37.8 251.6L153.4 142.9h-28.3l171.8 224.7h26.3z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        
                    </div>

                    <div className="pointer-events-none absolute bottom-2 left-0 right-0 hidden justify-center lg:flex">
                        <span className="rounded-full border border-black/10 bg-white/70 px-5 py-2 text-xs tracking-[0.14em] text-muted-foreground">
                            SCROLL PARA EXPLORAR
                        </span>
                    </div>

                    <div className=" pointer-events-none absolute left-64 right-4 top-[54%] select-none overflow-hidden text-left text-[16vw] font-semibold leading-none tracking-[0.08em] text-black/20 lg:text-[10vw] -z-10">
                        FALCON
                    </div>

                    <div className="pointer-events-none absolute bottom-16 right-58 select-none overflow-hidden text-right text-[16vw] font-semibold leading-none tracking-[0.08em] text-gradient-soft lg:text-[10vw]">
                        TEC
                    </div>
                </div>
            </div>
        </section>
    );
}