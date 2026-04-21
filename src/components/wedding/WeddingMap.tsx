import { MapPin, Navigation } from "lucide-react";

interface Props {
  ceremonyVenue: string;
  ceremonyAddress: string;
  receptionVenue: string;
  receptionAddress: string;
}

const WeddingMap = ({ ceremonyVenue, ceremonyAddress, receptionVenue, receptionAddress }: Props) => {
  const ceremonyQuery = encodeURIComponent(`${ceremonyVenue}, ${ceremonyAddress}`);
  const receptionQuery = encodeURIComponent(`${receptionVenue}, ${receptionAddress}`);

  const openMaps = (query: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  return (
    <div className="py-24 bg-background">
      <div className="container max-w-2xl">
        <div className="text-center mb-12">
          <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-3">Cómo llegar</h2>
          <p className="text-muted-foreground font-light">Ubicaciones del evento</p>
        </div>

        <div className="grid gap-4">
          {ceremonyVenue && (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <iframe
                title="Ceremonia"
                src={`https://www.google.com/maps?q=${ceremonyQuery}&output=embed`}
                className="w-full h-48"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Ceremonia</p>
                  <h3 className="font-heading text-lg text-foreground">{ceremonyVenue}</h3>
                  <p className="text-sm text-muted-foreground">{ceremonyAddress}</p>
                </div>
                <button
                  onClick={() => openMaps(ceremonyQuery)}
                  className="flex-shrink-0 p-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <Navigation className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {receptionVenue && (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <iframe
                title="Recepción"
                src={`https://www.google.com/maps?q=${receptionQuery}&output=embed`}
                className="w-full h-48"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Recepción</p>
                  <h3 className="font-heading text-lg text-foreground">{receptionVenue}</h3>
                  <p className="text-sm text-muted-foreground">{receptionAddress}</p>
                </div>
                <button
                  onClick={() => openMaps(receptionQuery)}
                  className="flex-shrink-0 p-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <Navigation className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeddingMap;
