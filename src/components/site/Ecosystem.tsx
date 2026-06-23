import iphoneProOrange from "@/assets/iphoneproorangesvg.svg";
import iphone17baserosa from "@/assets/iphone17baserosa.svg";
import iphone17baseverde from "@/assets/iphone17baseaverde.svg";
import iphone17baseazul from "@/assets/iphone17baseazul.svg";
import iphone17baseblanco from "@/assets/iphone17baseablanco.svg";
import iphone17basenegro from "@/assets/iphone17basenegro.svg";

import iphoneWhite from "@/assets/iphoneprowhitesvg.svg";
import iphoneBlue from "@/assets/iphoneprobluesvg.svg";

import { useEffect, useState } from "react";

type Variant = {
    id: string;
    image: string;
    swatch: string;
};

const proVariants: Variant[] = [
    {
        id: "orange",
        image: iphoneProOrange,
        swatch: "bg-orange-500",
    },
    {
        id: "white",
        image: iphoneWhite,
        swatch: "bg-zinc-100",
    },
    {
        id: "blue",
        image: iphoneBlue,
        swatch: "bg-[#46527C]",
    },
];

const baseVariants: Variant[] = [
    {
        id:"levanda",
        image: iphone17baserosa,
        swatch: "bg-[#EEE3F3]",
    },
    {
        id:"sage",
        image: iphone17baseverde,
        swatch: "bg-[#A9B689]",
    },
    {
        id:"blue",
        image: iphone17baseazul,
        swatch: "bg-[#ABC0DE]",
    },
    {
        id:"white",
        image: iphone17baseblanco,
        swatch: "bg-zinc-100",
    },
    {
        id:"black",
        image: iphone17basenegro,
        swatch: "bg-[#484C4F]",
    }
];

/**
 * Hook personalizado para manejar transiciones suaves al cambiar de imagen
 * Implementa un efecto fade-out, cambio de imagen, y fade-in estilo Apple
 * 
 * @param selected - El variant seleccionado actualmente (contiene id, image, swatch)
 * @returns Objeto con la imagen a mostrar y las clases CSS de transición
 */
function useImageSwapTransition(selected: Variant) {
    // Estado que almacena la imagen que se está mostrando actualmente en el DOM
    // Se inicializa con el primer variant pero se actualiza según el ciclo de transición
    const [displayed, setDisplayed] = useState(selected);
    
    // Estado que controla la fase de la animación con tres posibles valores:
    // - "idle": sin transición activa, imagen en estado normal (opacidad 100%, sin blur)
    // - "out": imagen desapareciendo (opacidad 0%, escala reducida, blur aplicado)
    // - "in": imagen apareciendo (transición de "out" a "idle")
    const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");

    // Hook de efecto que ejecuta la lógica de transición cuando el usuario selecciona un color diferente
    useEffect(() => {
        // Comparación: si el variant seleccionado es el mismo que se está mostrando,
        // no hacer nada (evita disparar transiciones innecesarias)
        if (selected.id === displayed.id) {
            return;
        }

        // Paso 1: Iniciar fase de desaparición (fade-out)
        // Cambia el estado a "out" que activa los estilos de opacidad 0 y blur
        setPhase("out");

        // Timer 1 (180ms): Espera a que la imagen se desvanezca
        // Luego cambia la imagen del DOM al nuevo variant y cambia a fase "in"
        // (esto ocurre mientras la pantalla está oscura, por lo que el cambio no es visible)
        const swapTimer = setTimeout(() => {
            setDisplayed(selected);  // Actualiza la imagen que se muestra
            setPhase("in");          // Inicia la fase de reaparición
        }, 180);

        // Timer 2 (460ms desde el inicio): Espera a que termine la transición completa
        // (fade-in gradual desde opacidad 0 a 100), luego regresa a estado "idle"
        // Esto asegura que los estilos de transición se mantengan durante todo el ciclo
        const settleTimer = setTimeout(() => {
            setPhase("idle");  // Vuelve al estado normal sin transiciones activas
        }, 460);

        // Función de limpieza: Se ejecuta si el componente se desmonta o si el efecto
        // se dispara nuevamente antes de que terminen los timers
        // Cancela ambos timers para evitar memory leaks y actualizaciones de estado huérfanas
        return () => {
            clearTimeout(swapTimer);
            clearTimeout(settleTimer);
        };
        // Dependency array: El efecto se ejecuta cuando:
        // - displayed.id cambia (para reaccionar a cambios de imagen)
        // - selected cambia (cuando el usuario hace clic en otro botón de color)
    }, [displayed.id, selected]);

    // Calcula dinámicamente las clases Tailwind CSS según la fase actual:
    // - Si está en fase "out": opacidad 0 (invisible), escala 98.5% (ligeramente contraída), blur 1px
    // - En cualquier otro caso (idle o in): opacidad 100% (visible), escala normal, sin blur
    // Las clases "in" usan la transición del elemento <img> para animar suavemente hacia este estado
    const imageClass =
        phase === "out"
            ? "opacity-0 scale-[0.985] blur-[1px]"           // Estado de desaparición
            : "opacity-100 scale-100 blur-0";               // Estado visible/reaparición

    // Retorna un objeto con:
    // - displayed: el variant actual (imagen, id, color) a mostrar
    // - imageClass: las clases CSS dinámicas para la animación
    return {
        displayed,
        imageClass,
    };
}



export function Ecosystem() {
    const [selectedPro, setSelectedPro] = useState(proVariants[0]);
    const [selectedBase, setSelectedBase] = useState(baseVariants[0]);
    const {
        displayed: displayedPro,
        imageClass: proImageClass,
    } = useImageSwapTransition(selectedPro);
    const {
        displayed: displayedBase,
        imageClass: baseImageClass,
    } = useImageSwapTransition(selectedBase);

    return (
        <section id="ecosystem" className="py-18 px-6 bg-secondary">
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
                    <div className="flex flex-col items-center">
                        <div className="flex w-full">
                            <img
                                src={displayedPro.image}
                                alt="iPhone 17 pro"
                                className={`mx-auto will-change-transform transition-all duration-420 ease-[cubic-bezier(0.22,1,0.36,1)] ${proImageClass}`}
                                draggable={false}
                            />
                        </div>
                        <div className="mt-8 flex flex-wrap items-center justify-center ">
                            {proVariants.map((variant) => {
                                const isActive = selectedPro.id === variant.id;

                                return (
                                    <button
                                        key={variant.id}
                                        type="button"
                                        onClick={() => setSelectedPro(variant)}
                                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all cursor-pointer`}
                                        aria-pressed={isActive}
                                    >
                                        <span
                                            className={`h-8 w-8 rounded-full ${variant.swatch} ring-1 ring-foreground/10 shadow-[inset_0_4px_4px_rgba(0,0,0,0.25)] `}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex w-full">
                            <img
                                src={displayedBase.image}
                                alt="iPhone 17 base"
                                className={`mx-auto will-change-transform transition-all duration-420 ease-[cubic-bezier(0.22,1,0.36,1)] ${baseImageClass}`}
                                draggable={false}
                            />
                        </div>
                        <div className="mt-8 flex flex-wrap items-center justify-center ">
                            {baseVariants.map((variant) => {
                                const isActive = selectedBase.id === variant.id;

                                return (
                                    <button
                                        key={variant.id}
                                        type="button"
                                        onClick={() => setSelectedBase(variant)}
                                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all cursor-pointer`}
                                        aria-pressed={isActive}
                                    >
                                        <span
                                            className={`h-8 w-8 rounded-full ${variant.swatch} ring-1 ring-foreground/10 shadow-[inset_0_4px_4px_rgba(0,0,0,0.25)]`}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}