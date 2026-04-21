import { MapPin, Clock } from "lucide-react";

interface Props {
  wedding: {
    ceremony_venue: string;
    ceremony_address: string;
    ceremony_time: string;
    reception_venue: string;
    reception_address: string;
    reception_time: string;
    dress_code: string;
  };
}

const WeddingVenue = ({ wedding }: Props) => {
  return (
    <div className="py-24 bg-background">
      <div className="container max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-2">El Gran Día</h2>
          <p className="text-muted-foreground font-light">Todos los detalles que necesitas</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {wedding.ceremony_venue && (
            <div className="bg-card rounded-xl p-8 border border-border text-center group hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-sand-accent" />
              </div>
              <h3 className="font-heading text-2xl mb-2">Ceremonia</h3>
              <p className="text-muted-foreground font-light">{wedding.ceremony_venue}</p>
              {wedding.ceremony_address && (
                <p className="text-muted-foreground font-light text-sm mt-1">{wedding.ceremony_address}</p>
              )}
              {wedding.ceremony_time && (
                <p className="text-foreground mt-4 font-medium flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" /> {wedding.ceremony_time}
                </p>
              )}
            </div>
          )}

          {wedding.reception_venue && (
            <div className="bg-card rounded-xl p-8 border border-border text-center group hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-sand-accent" />
              </div>
              <h3 className="font-heading text-2xl mb-2">Celebración</h3>
              <p className="text-muted-foreground font-light">{wedding.reception_venue}</p>
              {wedding.reception_address && (
                <p className="text-muted-foreground font-light text-sm mt-1">{wedding.reception_address}</p>
              )}
              {wedding.reception_time && (
                <p className="text-foreground mt-4 font-medium flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" /> {wedding.reception_time}
                </p>
              )}
            </div>
          )}
        </div>

        {wedding.dress_code && (
          <div className="text-center">
            <p className="text-muted-foreground text-sm uppercase tracking-widest mb-1">Código de vestimenta</p>
            <p className="font-heading text-xl text-foreground">{wedding.dress_code}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeddingVenue;
