import { useState } from "react";
import type { Variant } from "./variants";
import { useImageSwapTransition } from "./useImageSwapTransition";

type DeviceCardProps = {
    variants: Variant[];
    alt: string;
};

export function DeviceCard({ variants, alt }: DeviceCardProps) {
    const [selected, setSelected] = useState(variants[0]);
    const { displayed, imageClass } = useImageSwapTransition(selected);

    return (
        <div className="flex flex-col items-center">
            <div className="flex w-full">
                <img
                    src={displayed.image}
                    alt={alt}
                    style={{ maxWidth: 500, height: 531 }}
                    className={`mx-auto will-change-transform transition-all duration-420 ease-[cubic-bezier(0.22,1,0.36,1)] ${imageClass}`}
                    draggable={false}
                />
            </div>
            {variants.length > 1 && (
                <div className="mt-8 flex flex-wrap items-center justify-center">
                    {variants.map((variant) => (
                        <button
                            key={variant.id}
                            type="button"
                            onClick={() => setSelected(variant)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all cursor-pointer"
                            aria-pressed={selected.id === variant.id}
                        >
                            <span
                                className={`h-8 w-8 rounded-full ${variant.swatch} ring-1 ring-foreground/10 shadow-[inset_0_4px_4px_rgba(0,0,0,0.25)]`}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
