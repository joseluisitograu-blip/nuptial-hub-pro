import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Clock, MapPin, Camera, Music, Navigation, Sparkles } from "lucide-react";

interface AgendaItem {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location: string;
  description: string;
  icon: string;
}

interface Props {
  weddingId: string;
  weddingDate: string;
  ceremonyAddress?: string;
  receptionAddress?: string;
}

const WeddingDayMode = ({ weddingId, weddingDate, ceremonyAddress, receptionAddress }: Props) => {
  const [items, setItems] = useState<AgendaItem[]>([]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const fetchAgenda = async () => {
      const { data } = await supabase
        .from("agenda_items")
        .select("id, title, start_time, end_time, location, description, icon")
        .eq("wedding_id", weddingId)
        .order("sort_order");
      if (data) setItems(data);
    };
    fetchAgenda();
  }, [weddingId]);

  // Update clock every minute
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  // Determine if wedding day is today
  const weddingDay = new Date(weddingDate);
  const isToday =
    now.getFullYear() === weddingDay.getFullYear() &&
    now.getMonth() === weddingDay.getMonth() &&
    now.getDate() === weddingDay.getDate();

  if (!isToday) return null;

  const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

  const getStatus = (start: string, end: string) => {
    if (!start) return "upcoming";
    if (currentTime >= start && (!end || currentTime <= end)) return "now";
    if (currentTime > (end || start)) return "past";
    return "upcoming";
  };

  const currentItem = items.find((i) => getStatus(i.start_time, i.end_time) === "now");
  const nextItem = items.find((i) => getStatus(i.start_time, i.end_time) === "upcoming");

  const activeAddress = ceremonyAddress || receptionAddress;
  const mapsUrl = activeAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeAddress)}`
    : null;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[55] bg-foreground/95 backdrop-blur-lg text-background border-t border-background/10 shadow-2xl animate-fade-in safe-bottom">
      <div className="max-w-lg mx-auto px-4 py-3">
        {/* Live badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-[10px] uppercase tracking-widest text-background/60 font-medium">
            Día de la boda · En directo
          </span>
        </div>

        {/* Current / next event */}
        <div className="mb-3">
          {currentItem ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-background/50">Ahora mismo</p>
                <p className="text-sm font-medium text-background truncate">{currentItem.title}</p>
                {currentItem.location && (
                  <p className="text-[10px] text-background/40 truncate">{currentItem.location}</p>
                )}
              </div>
            </div>
          ) : nextItem ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-background/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-background/60" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-background/50">Siguiente · {nextItem.start_time?.slice(0, 5)}</p>
                <p className="text-sm font-medium text-background truncate">{nextItem.title}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-background/60 font-light">¡Disfruta de la celebración! 🎉</p>
          )}
        </div>

        {/* Quick action buttons */}
        <div className="flex gap-2">
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-background/10 hover:bg-background/15 transition-colors text-xs font-medium text-background"
            >
              <Navigation className="w-3.5 h-3.5" />
              Cómo llegar
            </a>
          )}
          <button
            onClick={() => scrollTo("fotos")}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-background/10 hover:bg-background/15 transition-colors text-xs font-medium text-background"
          >
            <Camera className="w-3.5 h-3.5" />
            Subir foto
          </button>
          <button
            onClick={() => scrollTo("playlist")}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-background/10 hover:bg-background/15 transition-colors text-xs font-medium text-background"
          >
            <Music className="w-3.5 h-3.5" />
            Playlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeddingDayMode;
