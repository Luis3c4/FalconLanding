import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const links = [
  { href: "#ecosystem", label: "Ecosistema" },
  { href: "#featured", label: "Productos" },
  { href: "#why", label: "Por qué FalconTec" },
  { href: "#experience", label: "Experiencia" },
  { href: "#contact", label: "Contacto" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/75 backdrop-blur-xl border-b border-border/60"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <Logo className="h-8 w-auto" />
        </a>
        <ul className="hidden md:flex items-center gap-9 text-[13px] text-muted-foreground">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="hover:text-foreground transition-colors duration-300"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="text-[13px] font-medium px-4 py-2 rounded-full bg-foreground text-background hover:opacity-90 transition-opacity"
        >
          Contáctanos
        </a>
      </nav>
    </header>
  );
}