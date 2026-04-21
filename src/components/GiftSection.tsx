import { useState } from "react";
import { Gift, Copy, Check } from "lucide-react";

const GiftSection = () => {
  const [copied, setCopied] = useState(false);
  const iban = "ES12 3456 7890 1234 5678 9012";

  const handleCopy = () => {
    navigator.clipboard.writeText(iban.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 bg-background">
      <div className="container max-w-2xl text-center">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
          <Gift className="w-7 h-7 text-sand-accent" />
        </div>
        <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-2">
          Lista de bodas
        </h2>
        <p className="text-muted-foreground font-light mb-8 max-w-lg mx-auto leading-relaxed">
          El mejor regalo es vuestra presencia. Pero si queréis tener un detalle con nosotros, 
          podéis contribuir a nuestro viaje de luna de miel.
        </p>
        <div className="bg-card border border-border rounded-lg p-6 inline-flex items-center gap-3">
          <span className="text-foreground font-mono text-sm md:text-base tracking-wide">
            {iban}
          </span>
          <button
            onClick={handleCopy}
            className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Copiar IBAN"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        {copied && (
          <p className="text-sm text-muted-foreground mt-3 animate-fade-in-up">
            ¡Copiado al portapapeles!
          </p>
        )}
      </div>
    </section>
  );
};

export default GiftSection;
