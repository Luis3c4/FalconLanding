import { proVariants, baseVariants, iPadsProVariants } from "./ecosystem/variants";
import { DeviceCard } from "./ecosystem/DeviceCard";

export function Ecosystem() {
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
                    <DeviceCard variants={proVariants} alt="iPhone 17 pro" />
                    <DeviceCard variants={baseVariants} alt="iPhone 17 base" />
                    <DeviceCard variants={iPadsProVariants} alt="iPad Pro" />
                </div>
            </div>
        </section>
    );
}