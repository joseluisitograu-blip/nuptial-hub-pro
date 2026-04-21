import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-wedding.jpg";
import WeddingCountdown from "@/components/wedding/WeddingCountdown";
import WeddingVenue from "@/components/wedding/WeddingVenue";
import WeddingGift from "@/components/wedding/WeddingGift";
import WeddingPlaylist from "@/components/wedding/WeddingPlaylist";
import WeddingPhotos from "@/components/wedding/WeddingPhotos";
import WeddingRsvp from "@/components/wedding/WeddingRsvp";
import WeddingStory from "@/components/wedding/WeddingStory";
import WeddingMenu from "@/components/wedding/WeddingMenu";
import WeddingAccommodations from "@/components/wedding/WeddingAccommodations";
import WeddingGuestbook from "@/components/wedding/WeddingGuestbook";
import WeddingShare from "@/components/wedding/WeddingShare";
import {
  Heart, MapPin, Gift, Music, Camera, Mail, BookHeart, UtensilsCrossed, Hotel, BookOpen, Share2,
} from "lucide-react";

interface WeddingData {
  id: string;
  slug: string;
  partner1_name: string;
  partner2_name: string;
  wedding_date: string | null;
  ceremony_venue: string;
  ceremony_address: string;
  ceremony_time: string;
  reception_venue: string;
  reception_address: string;
  reception_time: string;
  bank_account: string;
  gift_message: string;
  dress_code: string;
  hero_image_url: string;
  menu_starters: string;
  menu_mains: string;
  menu_desserts: string;
  theme_preset: string;
}

const themeStyles: Record<string, Record<string, string>> = {
  elegant: {
    "--theme-primary": "33 30% 40%",
    "--theme-accent": "30 25% 33%",
  },
  romantic: {
    "--theme-primary": "340 40% 55%",
    "--theme-accent": "340 35% 45%",
  },
  rustic: {
    "--theme-primary": "30 40% 35%",
    "--theme-accent": "25 35% 28%",
  },
  modern: {
    "--theme-primary": "220 20% 20%",
    "--theme-accent": "220 15% 35%",
  },
};

const tabs = [
  { id: "inicio", label: "Inicio", icon: Heart },
  { id: "historia", label: "Historia", icon: BookHeart },
  { id: "lugar", label: "Lugar", icon: MapPin },
  { id: "menu", label: "Menú", icon: UtensilsCrossed },
  { id: "alojamiento", label: "Alojamiento", icon: Hotel },
  { id: "regalo", label: "Regalo", icon: Gift },
  { id: "playlist", label: "Playlist", icon: Music },
  { id: "fotos", label: "Fotos", icon: Camera },
  { id: "firmas", label: "Firmas", icon: BookOpen },
  { id: "rsvp", label: "RSVP", icon: Mail },
  { id: "compartir", label: "Compartir", icon: Share2 },
];

const WeddingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [wedding, setWedding] = useState<WeddingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("inicio");

  useEffect(() => {
    if (!slug) return;
    const fetchWedding = async () => {
      const { data } = await supabase
        .from("weddings")
        .select("*")
        .eq("slug", slug)
        .single();
      setWedding(data as WeddingData | null);
      setLoading(false);
    };
    fetchWedding();
  }, [slug]);

  const themeVars = useMemo(() => {
    if (!wedding) return {};
    return themeStyles[wedding.theme_preset] || themeStyles.elegant;
  }, [wedding]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Heart className="w-8 h-8 text-sand-accent animate-pulse" />
      </div>
    );
  }

  if (!wedding) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl text-foreground mb-2">Boda no encontrada</h1>
          <p className="text-muted-foreground">El enlace no es válido.</p>
        </div>
      </div>
    );
  }

  const weddingDate = wedding.wedding_date ? new Date(wedding.wedding_date) : null;
  const formattedDate = weddingDate
    ? weddingDate.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
    : "";

  const renderContent = () => {
    switch (activeTab) {
      case "inicio":
        return <TabInicio wedding={wedding} weddingDate={weddingDate} formattedDate={formattedDate} />;
      case "historia":
        return <WeddingStory weddingId={wedding.id} />;
      case "lugar":
        return <WeddingVenue wedding={wedding} />;
      case "menu":
        return <WeddingMenu starters={wedding.menu_starters} mains={wedding.menu_mains} desserts={wedding.menu_desserts} />;
      case "alojamiento":
        return <WeddingAccommodations weddingId={wedding.id} />;
      case "regalo":
        return <WeddingGift bankAccount={wedding.bank_account} message={wedding.gift_message} />;
      case "playlist":
        return <WeddingPlaylist weddingId={wedding.id} />;
      case "fotos":
        return <WeddingPhotos weddingId={wedding.id} />;
      case "firmas":
        return <WeddingGuestbook weddingId={wedding.id} />;
      case "rsvp":
        return <WeddingRsvp weddingId={wedding.id} />;
      case "compartir":
        return <WeddingShare slug={wedding.slug} partner1={wedding.partner1_name} partner2={wedding.partner2_name} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" style={themeVars as React.CSSProperties}>
      {/* Fixed top nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-2">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Tab content */}
      <main className="flex-1 animate-fade-in" key={activeTab}>
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="py-8 bg-card border-t border-border text-center">
        <Heart className="w-5 h-5 text-sand-dark mx-auto mb-3" />
        <p className="font-heading text-xl text-foreground">
          {wedding.partner1_name} & {wedding.partner2_name}
        </p>
        {formattedDate && (
          <p className="text-muted-foreground text-sm font-light mt-1">{formattedDate}</p>
        )}
      </footer>
    </div>
  );
};

/* ---------- Tab: Inicio ---------- */
const TabInicio = ({
  wedding,
  weddingDate,
  formattedDate,
}: {
  wedding: WeddingData;
  weddingDate: Date | null;
  formattedDate: string;
}) => (
  <div>
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={wedding.hero_image_url || heroImage}
          alt="Boda"
          className="w-full h-full object-cover"
          style={{ animation: "slowZoom 20s ease-in-out infinite alternate" }}
        />
        <div className="absolute inset-0 bg-foreground/40" />
      </div>
      <div className="relative z-10 text-center px-6">
        <p className="font-body text-primary-foreground/70 tracking-[0.4em] uppercase text-xs mb-6">
          ¡Nos casamos!
        </p>
        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-primary-foreground mb-4 leading-[0.9]">
          {wedding.partner1_name || "Nombre"}
          <span className="block text-2xl md:text-3xl font-body font-light tracking-widest my-3 text-primary-foreground/60">
            &
          </span>
          {wedding.partner2_name || "Nombre"}
        </h1>
        {formattedDate && (
          <p className="text-primary-foreground/80 text-lg font-light tracking-wide mt-4">
            {formattedDate}
          </p>
        )}
      </div>
    </section>

    {weddingDate && (
      <div className="bg-secondary py-16">
        <WeddingCountdown targetDate={weddingDate} />
      </div>
    )}

    {wedding.dress_code && (
      <div className="py-12 bg-background text-center">
        <p className="text-muted-foreground text-sm uppercase tracking-widest mb-1">Código de vestimenta</p>
        <p className="font-heading text-xl text-foreground">{wedding.dress_code}</p>
      </div>
    )}

    <style>{`
      @keyframes slowZoom {
        from { transform: scale(1); }
        to { transform: scale(1.08); }
      }
    `}</style>
  </div>
);

export default WeddingPage;
