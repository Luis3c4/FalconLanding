import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useHeroPhase } from "@/hooks/use-hero-phase";
import { SocialIcons } from "./SocialDock";

const links = [
  { href: "#ecosystem", label: "Ecosistema" },
  { href: "#featured", label: "Productos" },
  { href: "#why", label: "Por qué FalconTec" },
  { href: "#experience", label: "Experiencia" },
  { href: "#contact", label: "Contacto" },
];

export function Nav() {
  const phase = useHeroPhase();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sliding pill that follows the hovered link, top-bar nav only.
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const [pill, setPill] = useState({ left: 0, width: 0 });

  const moveTo = (index: number) => {
    const el = itemRefs.current[index];
    if (!el) return;
    setPill({ left: el.offsetLeft, width: el.offsetWidth });
    setHovered(index);
  };

  return (
    <>
      {/* Full-width bar: only before the hero frame sequence takes over. */}
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled ? "glass-nav" : "bg-transparent",
          phase === "top" ? "opacity-100" : "opacity-0 pointer-events-none -translate-y-4",
        )}
      >
        <nav className="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-center">
          <ul
            className="relative hidden md:flex items-center gap-1 text-[15px] font-medium text-foreground/70"
            onMouseLeave={() => setHovered(null)}
          >
            <span
              className="absolute inset-y-0 top-0 rounded-full bg-foreground transition-all duration-300 ease-out"
              style={{
                left: pill.left,
                width: pill.width,
                opacity: hovered === null ? 0 : 1,
              }}
            />
            {links.map((l, i) => (
              <li
                key={l.href}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className="relative z-10"
                onMouseEnter={() => moveTo(i)}
              >
                <a
                  href={l.href}
                  className={cn(
                    "block px-4 py-2 rounded-full transition-colors duration-300",
                    hovered === i ? "text-background" : "hover:text-foreground",
                  )}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Merged top-center pill: nav links + social icons, revealed once the
          user scrolls past the hero's pinned frame sequence. Animates in
          from above (top edge) down into its resting top-center spot. */}
      <div
        className={cn(
          "hidden lg:flex fixed top-4 left-1/2 z-50 items-center gap-5 rounded-full px-5 py-2.5 glass-dock transition-all duration-700",
          phase === "after"
            ? "opacity-100 translate-x-[-50%] translate-y-0"
            : "opacity-0 pointer-events-none translate-x-[-50%] -translate-y-12",
        )}
      >
        <ul className="flex items-center gap-6 text-[13px] text-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.45)]">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="hover:text-white transition-colors duration-300"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="h-5 w-px bg-white/25" />
        <div className="flex items-center gap-1">
          <SocialIcons iconClassName="h-8 w-8" />
        </div>
      </div>
    </>
  );
}