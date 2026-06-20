import iphoneProOrange from "@/assets/iphoneproorange.png";
import iphone17base from "@/assets/iphone17base.png";
import iphoneWhite from "@/assets/iphoneprowhite.png";
import iphoneBlue from "@/assets/iphoneproblue.png";

import { useState } from "react";

const proVariants = [
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

const baseVariants = [
    {
        id:"levanda",
        image: iphone17base,
        swatch: "bg-[#EEE3F3]",
    },
    {
        id:"sage",
        image: iphone17base,
        swatch: "bg-[#A9B689]",
    },
    {
        id:"blue",
        image: iphone17base,
        swatch: "bg-[#ABC0DE]",
    },
    {
        id:"white",
        image: iphone17base,
        swatch: "bg-zinc-100",
    },
    {
        id:"black",
        image: iphone17base,
        swatch: "bg-[#484C4F]",
    }
]
;



export function Ecosystem() {
    const [selectedPro, setSelectedPro] = useState(proVariants[0]);
    const [selectedBase, setSelectedBase] = useState(baseVariants[0]);

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
                <div className="reveal grid gap-10 lg:grid-cols-2 lg:gap-14">
                    <div className="flex flex-col items-center">
                        <div className="flex w-full">
                            <img
                                src={selectedPro.image}
                                alt="iPhone 17 pro"
                                className="mx-auto "
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
                                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all`}
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
                    <div className="flex flex-col items-center">
                        <div className="flex w-full">
                            <img
                                src={iphone17base}
                                alt="iPhone 17 base"
                                className="mx-auto "
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
                                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all`}
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