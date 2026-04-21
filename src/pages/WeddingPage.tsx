import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-wedding.jpg";
import WeddingCountdown from "@/components/wedding/WeddingCountdown";
import WeddingVenue from "@/components/wedding/WeddingVenue";
import WeddingGift from "@/components/wedding/WeddingGift";
import WeddingPlaylist from "@/components/wedding/WeddingPlaylist";
import WeddingPhotos from "@/components/wedding/WeddingPhotos";
import WeddingRsvp from "@/components/wedding/WeddingRsvp";
import WeddingMap from "@/components/wedding/WeddingMap";
import { Heart } from "lucide-react";

interface WeddingData {
  id: string;
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
  location_lat: number | null;
  location_lng: number | null;
}

const WeddingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [wedding, setWedding] = useState<WeddingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (!slug) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("weddings")
        .select("*")
        .eq("slug", slug)
        .single();
      setWedding(data as WeddingData | null);
      setLoading(false);
    };
    fetch();
  }, [slug]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionsRef.current.indexOf(entry.target as HTMLElement);
            if (index !== -1) setActiveSection(index);
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-8");
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
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

  const navItems = ["Inicio", "Lugar", "Regalo", "Playlist", "Fotos", "RSVP"];

  return (
    <div className="relative">
      {/* Floating nav dots */}
      <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {navItems.map((label, i) => (
          <button
            key={label}
            onClick={() => sectionsRef.current[i]?.scrollIntoView({ behavior: "smooth" })}
            className="group flex items-center gap-2"
          >
            <span
              className={`hidden group-hover:block text-xs px-2 py-1 rounded bg-foreground text-background transition-all ${
                activeSection === i ? "!block" : ""
              }`}
            >
              {label}
            </span>
            <span
              className={`w-2.5 h-2.5 rounded-full border-2 transition-all ${
                activeSection === i
                  ? "bg-sand-accent border-sand-accent scale-125"
                  : "border-sand-dark bg-transparent"
              }`}
            />
          </button>
        ))}
      </nav>

      {/* Hero - fullscreen immersive */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        className="relative min-h-screen flex items-center justify-center overflow-hidden transition-all duration-1000 opacity-100"
      >
        <div className="absolute inset-0">
          <img
            src={wedding.hero_image_url || heroImage}
            alt="Boda"
            className="w-full h-full object-cover scale-105"
            style={{ animation: "slowZoom 20s ease-in-out infinite alternate" }}
          />
          <div className="absolute inset-0 bg-foreground/40" />
        </div>
        <div className="relative z-10 text-center px-6">
          <p className="font-body text-primary-foreground/70 tracking-[0.4em] uppercase text-xs mb-6">
            ¡Nos casamos!
          </p>
          <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl text-primary-foreground mb-4 leading-[0.9]">
            {wedding.partner1_name || "Nombre"}
            <span className="block text-3xl md:text-4xl font-body font-light tracking-widest my-4 text-primary-foreground/60">
              &
            </span>
            {wedding.partner2_name || "Nombre"}
          </h1>
          {formattedDate && (
            <p className="text-primary-foreground/80 text-lg font-light tracking-wide mt-6">
              {formattedDate}
            </p>
          )}
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-primary-foreground/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-primary-foreground/60 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Countdown */}
      {weddingDate && (
        <div className="bg-secondary py-16">
          <WeddingCountdown targetDate={weddingDate} />
        </div>
      )}

      {/* Venue */}
      <section
        ref={(el) => (sectionsRef.current[1] = el)}
        className="opacity-0 translate-y-8 transition-all duration-1000"
      >
        <WeddingVenue wedding={wedding} />
      </section>

      {/* Map */}
      {wedding.location_lat && wedding.location_lng && (
        <WeddingMap lat={wedding.location_lat} lng={wedding.location_lng} />
      )}

      {/* Gift */}
      <section
        ref={(el) => (sectionsRef.current[2] = el)}
        className="opacity-0 translate-y-8 transition-all duration-1000"
      >
        <WeddingGift bankAccount={wedding.bank_account} message={wedding.gift_message} />
      </section>

      {/* Playlist */}
      <section
        ref={(el) => (sectionsRef.current[3] = el)}
        className="opacity-0 translate-y-8 transition-all duration-1000"
      >
        <WeddingPlaylist weddingId={wedding.id} />
      </section>

      {/* Photos */}
      <section
        ref={(el) => (sectionsRef.current[4] = el)}
        className="opacity-0 translate-y-8 transition-all duration-1000"
      >
        <WeddingPhotos weddingId={wedding.id} />
      </section>

      {/* RSVP */}
      <section
        ref={(el) => (sectionsRef.current[5] = el)}
        className="opacity-0 translate-y-8 transition-all duration-1000"
      >
        <WeddingRsvp weddingId={wedding.id} />
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t border-border text-center">
        <Heart className="w-5 h-5 text-sand-dark mx-auto mb-4" />
        <p className="font-heading text-2xl text-foreground">
          {wedding.partner1_name} & {wedding.partner2_name}
        </p>
        {formattedDate && (
          <p className="text-muted-foreground text-sm font-light mt-1">{formattedDate}</p>
        )}
      </footer>

      <style>{`
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
};

export default WeddingPage;
