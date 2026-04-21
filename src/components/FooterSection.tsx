import { Heart } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="py-12 bg-card border-t border-border">
      <div className="container text-center">
        <Heart className="w-5 h-5 text-sand-dark mx-auto mb-4" />
        <p className="font-heading text-2xl text-foreground mb-2">María & Carlos</p>
        <p className="text-muted-foreground text-sm font-light">
          15 de Junio de 2026 — Sevilla
        </p>
        <p className="text-muted-foreground/60 text-xs mt-6">
          Hecho con amor
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
