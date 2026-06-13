import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <Logo className="h-10 w-auto" />
          <p className="mt-6 text-sm text-muted-foreground max-w-sm">
            Distribuidor garantizado de Apple. Productos originales, atención
            experta y la mejor experiencia del ecosistema Apple.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4">Productos</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {["iPhone", "MacBook", "iPad", "Apple Watch", "AirPods"].map((i) => (
              <li key={i}>
                <a href="#ecosystem" className="hover:text-foreground transition">
                  {i}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4">Compañía</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#about" className="hover:text-foreground transition">Sobre nosotros</a></li>
            <li><a href="#why" className="hover:text-foreground transition">Por qué FalconTec</a></li>
            <li><a href="#contact" className="hover:text-foreground transition">Contacto</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground gap-3">
          <p>© {new Date().getFullYear()} FalconTec. Todos los derechos reservados.</p>
          <p>Apple, iPhone, MacBook, iPad, Apple Watch y AirPods son marcas de Apple Inc.</p>
        </div>
      </div>
    </footer>
  );
}