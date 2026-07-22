import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { SocialDock } from "@/components/site/SocialDock";
import { Hero } from "@/components/site/Hero";
import { Ecosystem } from "@/components/site/Ecosystem";
import { Featured } from "@/components/site/Featured";
import { Experience } from "@/components/site/Experience";
import { Testimonials } from "@/components/site/Testimonials";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FalconTec — Distribuidor Garantizado de Apple" },
      { name: "description", content: "Distribuidor garantizado de Apple. iPhone, MacBook, iPad, Apple Watch y AirPods originales con garantía y asesoría experta." },
      { property: "og:title", content: "FalconTec — Distribuidor Garantizado de Apple" },
      { property: "og:description", content: "Descubre el ecosistema Apple completo. Productos originales, última generación, atención premium." },
    ],
  }),
  component: Index,
});

function Index() {
  useReveal();
  return (
    <main className="bg-background text-foreground">
      <Nav />
      <SocialDock />
      <Hero />
      <Ecosystem />
      <Featured />
      <Experience />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
