import { MapPin } from "lucide-react";

interface Props {
  lat: number;
  lng: number;
}

const WeddingMap = ({ lat, lng }: Props) => {
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.005},${lng + 0.01},${lat + 0.005}&layer=mapnik&marker=${lat},${lng}`;
  const linkUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <div className="relative">
      <iframe
        src={mapUrl}
        className="w-full h-[400px] border-0"
        loading="lazy"
        title="Ubicación de la boda"
      />
      <div className="absolute bottom-4 right-4">
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card/90 backdrop-blur-sm border border-border text-foreground text-sm font-medium hover:bg-card transition-colors shadow-lg"
        >
          <MapPin className="w-4 h-4" /> Abrir en Google Maps
        </a>
      </div>
    </div>
  );
};

export default WeddingMap;
