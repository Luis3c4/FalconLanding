import logoMeta from "@/assets/falcontec-logo.png";

export function Logo({ className = "h-9 w-auto" }: { className?: string }) {
    return <img src={logoMeta} alt="FalconTec" className={className} loading="eager" />;
}