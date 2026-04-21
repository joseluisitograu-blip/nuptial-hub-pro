import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Hotel, ExternalLink, Phone, MapPin } from "lucide-react";

interface Accommodation {
  id: string;
  name: string;
  address: string;
  phone: string;
  website: string;
  notes: string;
}

const WeddingAccommodations = ({ weddingId }: { weddingId: string }) => {
  const [items, setItems] = useState<Accommodation[]>([]);

  useEffect(() => {
    supabase
      .from("accommodations")
      .select("*")
      .eq("wedding_id", weddingId)
      .order("sort_order")
      .then(({ data }) => setItems((data as Accommodation[]) || []));
  }, [weddingId]);

  if (items.length === 0) {
    return (
      <div className="py-24 bg-background text-center">
        <Hotel className="w-10 h-10 text-sand-dark mx-auto mb-4 opacity-30" />
        <p className="text-muted-foreground font-light">No hay alojamientos recomendados aún.</p>
      </div>
    );
  }

  return (
    <div className="py-24 bg-background">
      <div className="container max-w-4xl">
        <div className="text-center mb-16">
          <Hotel className="w-8 h-8 text-sand-accent mx-auto mb-4" />
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-2">Alojamiento</h2>
          <p className="text-muted-foreground font-light">Opciones recomendadas para tu estancia</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-heading text-xl text-foreground mb-3">{item.name}</h3>
              {item.address && (
                <p className="flex items-start gap-2 text-muted-foreground text-sm mb-2">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" /> {item.address}
                </p>
              )}
              {item.phone && (
                <p className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <Phone className="w-4 h-4 shrink-0" />
                  <a href={`tel:${item.phone}`} className="hover:text-foreground transition-colors">{item.phone}</a>
                </p>
              )}
              {item.notes && (
                <p className="text-muted-foreground text-sm font-light mt-3">{item.notes}</p>
              )}
              {item.website && (
                <a
                  href={item.website.startsWith("http") ? item.website : `https://${item.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 text-sm text-primary hover:opacity-80 transition-opacity"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Ver web
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeddingAccommodations;
