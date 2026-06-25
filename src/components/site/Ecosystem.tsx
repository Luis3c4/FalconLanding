import { useRef, useState, useEffect } from "react";
import { proVariants, baseVariants, iPadsProVariants,iPadAirVariants, iPadMiniVariants, iPadVariants } from "./ecosystem/variants";
import { DeviceCard } from "./ecosystem/DeviceCard";

export function Ecosystem() {
    const iPadScrollRef = useRef<HTMLDivElement>(null);
    // false = aún no se ha scrolleado, el botón ← empieza desactivado
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    // true = asumimos que hay contenido a la derecha hasta comprobarlo en el efecto
    const [canScrollRight, setCanScrollRight] = useState(true);

    const updateScrollState = () => {
        const el = iPadScrollRef.current;
        if (!el) return; // sale si el ref todavía no apunta a ningún elemento

        // hay contenido a la izquierda si el scroll no está en el origen
        setCanScrollLeft(el.scrollLeft > 0);

        // hay contenido a la derecha si la suma de posición + ancho visible
        // es menor que el ancho total del contenido (−1 para tolerar decimales)
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    useEffect(() => {
        const el = iPadScrollRef.current;
        if (!el) return; // sale si el ref todavía no está listo

        updateScrollState(); // sincroniza el estado inicial al montar

        // escucha el scroll del carrusel; passive:true mejora el rendimiento
        el.addEventListener("scroll", updateScrollState, { passive: true });

        // recalcula si el viewport cambia de tamaño (responsive)
        window.addEventListener("resize", updateScrollState);

        // limpieza: elimina los listeners al desmontar el componente
        return () => {
            el.removeEventListener("scroll", updateScrollState);
            window.removeEventListener("resize", updateScrollState);
        };
    }, []); // [] = solo se ejecuta una vez al montar

    const scrollIpads = (dir: "left" | "right") => {
        const el = iPadScrollRef.current;
        if (!el) return;
        el.scrollBy({ left: dir === "right" ? el.clientWidth / 2 : -(el.clientWidth / 2), behavior: "smooth" });
    };

    return (
        <section id="ecosystem" className="py-18 px-6 bg-secondary overflow-x-clip">
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
                <div className="reveal grid gap-10 lg:grid-cols-2 lg:gap-14">
                    <DeviceCard variants={proVariants} alt="iPhone 17 pro" />
                    <DeviceCard variants={baseVariants} alt="iPhone 17 base" />
                </div>
            </div>

            {/* iPad row – full-bleed scrollable carousel */}
            <div className="reveal mt-10 lg:mt-14">
                <div
                    ref={iPadScrollRef}
                    className="flex gap-8 overflow-x-auto scroll-smooth px-52 scrollbar-none [&::-webkit-scrollbar]:hidden"
                >
                    <div className="min-w-140 shrink-0">
                        <DeviceCard variants={iPadsProVariants} alt="iPad Pro" />
                    </div>
                    <div className="min-w-140 shrink-0">
                        <DeviceCard variants={iPadAirVariants} alt="iPad Air" />
                    </div>
                    <div className="min-w-140 shrink-0">
                        <DeviceCard variants={iPadMiniVariants} alt="iPad Mini" />
                    </div>
                    <div className="min-w-140 shrink-0">
                        <DeviceCard variants={iPadVariants} alt="iPad" />
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-6 px-6 mx-auto max-w-7xl">
                    <button
                        type="button"
                        onClick={() => scrollIpads("left")}
                        disabled={!canScrollLeft}
                        aria-label="Scroll izquierda"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-background/80 shadow-md backdrop-blur-sm ring-1 ring-foreground/10 transition hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" className="h-5 w-5 rotate-180 fill-current">
                                <path d="M23.5587,16.916 C24.1447,17.4999987 24.1467,18.446 23.5647,19.034 L16.6077,26.056 C16.3147,26.352 15.9287,26.4999987 15.5427,26.4999987 C15.1607,26.4999987 14.7787,26.355 14.4867,26.065 C13.8977,25.482 13.8947,24.533 14.4777,23.944 L20.3818,17.984 L14.4408,12.062 C13.8548,11.478 13.8528,10.5279 14.4378,9.941 C15.0218,9.354 15.9738,9.353 16.5588,9.938 L23.5588,16.916 L23.5587,16.916 Z" />
                            </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => scrollIpads("right")}
                        disabled={!canScrollRight}
                        aria-label="Scroll derecha"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-background/80 shadow-md backdrop-blur-sm ring-1 ring-foreground/10 transition hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" className="h-5 w-5 fill-current">
                                <path d="M23.5587,16.916 C24.1447,17.4999987 24.1467,18.446 23.5647,19.034 L16.6077,26.056 C16.3147,26.352 15.9287,26.4999987 15.5427,26.4999987 C15.1607,26.4999987 14.7787,26.355 14.4867,26.065 C13.8977,25.482 13.8947,24.533 14.4777,23.944 L20.3818,17.984 L14.4408,12.062 C13.8548,11.478 13.8528,10.5279 14.4378,9.941 C15.0218,9.354 15.9738,9.353 16.5588,9.938 L23.5588,16.916 L23.5587,16.916 Z" />
                            </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}