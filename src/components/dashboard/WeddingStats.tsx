import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Music, Camera, BookOpen, TrendingUp } from "lucide-react";

interface Stats {
  rsvps: number;
  attending: number;
  totalGuests: number;
  songs: number;
  photos: number;
  guestbook: number;
}

const WeddingStats = ({ weddingId }: { weddingId: string }) => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const [rsvpRes, songRes, photoRes, gbRes] = await Promise.all([
        supabase.from("rsvps").select("attending, num_guests").eq("wedding_id", weddingId),
        supabase.from("playlist_songs").select("id").eq("wedding_id", weddingId),
        supabase.from("wedding_photos").select("id").eq("wedding_id", weddingId),
        supabase.from("guestbook").select("id").eq("wedding_id", weddingId),
      ]);

      const rsvps = rsvpRes.data || [];
      const attending = rsvps.filter((r) => r.attending);
      const totalGuests = attending.reduce((sum, r) => sum + (r.num_guests || 1), 0);

      setStats({
        rsvps: rsvps.length,
        attending: attending.length,
        totalGuests,
        songs: songRes.data?.length || 0,
        photos: photoRes.data?.length || 0,
        guestbook: gbRes.data?.length || 0,
      });
    };
    fetchStats();
  }, [weddingId]);

  if (!stats) return null;

  const cards = [
    { icon: Users, label: "RSVPs", value: stats.rsvps, sub: `${stats.attending} asisten · ${stats.totalGuests} personas` },
    { icon: Music, label: "Canciones", value: stats.songs, sub: "en la playlist" },
    { icon: Camera, label: "Fotos", value: stats.photos, sub: "subidas" },
    { icon: BookOpen, label: "Firmas", value: stats.guestbook, sub: "mensajes" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-secondary/50 border border-border rounded-lg p-3 text-center">
          <c.icon className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
          <p className="font-heading text-2xl text-foreground">{c.value}</p>
          <p className="text-[10px] text-muted-foreground leading-tight">{c.sub}</p>
        </div>
      ))}
    </div>
  );
};

export default WeddingStats;
