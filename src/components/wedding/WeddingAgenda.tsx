import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Clock, Church, Wine, UtensilsCrossed, Music, PartyPopper, Camera, MapPin } from "lucide-react";

interface AgendaItem {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location: string;
  description: string;
  icon: string;
  sort_order: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  clock: Clock,
  church: Church,
  wine: Wine,
  food: UtensilsCrossed,
  music: Music,
  party: PartyPopper,
  camera: Camera,
  location: MapPin,
};

const WeddingAgenda = ({ weddingId }: { weddingId: string }) => {
  const [items, setItems] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("agenda_items")
        .select("*")
        .eq("wedding_id", weddingId)
        .order("sort_order");
      setItems((data as AgendaItem[]) || []);
      setLoading(false);
    };
    fetch();
  }, [weddingId]);

  if (loading) return <div className="py-24 text-center text-muted-foreground">Cargando...</div>;

  if (items.length === 0) return null;

  return (
    <div className="py-24 bg-secondary">
      <div className="container max-w-2xl">
        <div className="text-center mb-12">
          <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-3">Agenda del día</h2>
          <p className="text-muted-foreground font-light">El plan para nuestro gran día</p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-8">
            {items.map((item, i) => {
              const Icon = iconMap[item.icon] || Clock;
              return (
                <div key={item.id} className="relative flex gap-5">
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="bg-card border border-border rounded-xl p-5 flex-1">
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-sm font-semibold text-primary">
                        {item.start_time}{item.end_time ? ` – ${item.end_time}` : ""}
                      </span>
                    </div>
                    <h3 className="font-heading text-lg text-foreground">{item.title}</h3>
                    {item.location && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {item.location}
                      </p>
                    )}
                    {item.description && (
                      <p className="text-sm text-foreground/70 mt-2">{item.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeddingAgenda;
