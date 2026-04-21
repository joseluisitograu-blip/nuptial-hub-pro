import { MapPin, Clock } from "lucide-react";

const VenueSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-2">
            Lugar & Hora
          </h2>
          <p className="text-muted-foreground font-light">
            Os esperamos con los brazos abiertos
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card rounded-lg p-8 border border-border text-center">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-5 h-5 text-sand-accent" />
            </div>
            <h3 className="font-heading text-2xl mb-2">Ceremonia</h3>
            <p className="text-muted-foreground font-light mb-1">
              Iglesia de Santa María
            </p>
            <p className="text-muted-foreground font-light text-sm">
              Calle Mayor, 12 — Sevilla
            </p>
            <p className="text-foreground mt-4 font-medium flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" /> 17:00h
            </p>
          </div>
          <div className="bg-card rounded-lg p-8 border border-border text-center">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-5 h-5 text-sand-accent" />
            </div>
            <h3 className="font-heading text-2xl mb-2">Celebración</h3>
            <p className="text-muted-foreground font-light mb-1">
              Finca Los Olivos
            </p>
            <p className="text-muted-foreground font-light text-sm">
              Camino Rural s/n — Alcalá de Guadaíra
            </p>
            <p className="text-foreground mt-4 font-medium flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" /> 19:30h
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VenueSection;
