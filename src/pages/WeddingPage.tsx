import { useEffect, useState, useMemo, useRef, useCallback } from "react";
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
import WeddingSeating from "@/components/wedding/WeddingSeating";
import WeddingAgenda from "@/components/wedding/WeddingAgenda";
import WeddingFaq from "@/components/wedding/WeddingFaq";
import WeddingMap from "@/components/wedding/WeddingMap";
import WeddingCalendar from "@/components/wedding/WeddingCalendar";
import AnimatedSection from "@/components/wedding/AnimatedSection";
import { LangProvider, LangToggle, useLang } from "@/contexts/LangContext";
import {
  Heart, MapPin, Gift, Music, Camera, Mail, BookHeart, UtensilsCrossed, Hotel, BookOpen, Share2, Users, Clock, HelpCircle, Navigation, ChevronUp,
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
  whatsapp_number: string;
}

const themeStyles: Record<string, Record<string, string>> = {
  elegant: {
    "--background": "36 33% 97%",
    "--foreground": "30 25% 15%",
    "--card": "36 30% 95%",
    "--card-foreground": "30 25% 15%",
    "--primary": "33 30% 40%",
    "--primary-foreground": "36 33% 97%",
    "--secondary": "34 25% 90%",
    "--secondary-foreground": "30 25% 20%",
    "--muted": "34 20% 92%",
    "--muted-foreground": "30 10% 50%",
    "--border": "34 20% 85%",
    "--accent": "36 40% 55%",
  },
  romantic: {
    "--background": "340 30% 97%",
    "--foreground": "340 20% 15%",
    "--card": "340 25% 95%",
    "--card-foreground": "340 20% 15%",
    "--primary": "340 45% 55%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "340 20% 90%",
    "--secondary-foreground": "340 20% 20%",
    "--muted": "340 15% 92%",
    "--muted-foreground": "340 10% 50%",
    "--border": "340 15% 85%",
    "--accent": "340 35% 65%",
  },
  rustic: {
    "--background": "25 30% 94%",
    "--foreground": "25 35% 12%",
    "--card": "25 25% 90%",
    "--card-foreground": "25 35% 12%",
    "--primary": "25 50% 32%",
    "--primary-foreground": "36 33% 97%",
    "--secondary": "25 20% 85%",
    "--secondary-foreground": "25 35% 15%",
    "--muted": "25 15% 88%",
    "--muted-foreground": "25 15% 45%",
    "--border": "25 15% 78%",
    "--accent": "140 20% 40%",
  },
  modern: {
    "--background": "220 15% 96%",
    "--foreground": "220 20% 10%",
    "--card": "220 10% 93%",
    "--card-foreground": "220 20% 10%",
    "--primary": "220 25% 18%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "220 10% 88%",
    "--secondary-foreground": "220 20% 15%",
    "--muted": "220 8% 90%",
    "--muted-foreground": "220 10% 45%",
    "--border": "220 10% 82%",
    "--accent": "220 40% 50%",
  },
};

const sections = [
  { id: "inicio", label: "Inicio", icon: Heart },
  { id: "historia", label: "Historia", icon: BookHeart },
  { id: "agenda", label: "Agenda", icon: Clock },
  { id: "lugar", label: "Lugar", icon: MapPin },
  { id: "mapa", label: "Mapa", icon: Navigation },
  { id: "menu", label: "Menú", icon: UtensilsCrossed },
  { id: "alojamiento", label: "Alojamiento", icon: Hotel },
  { id: "mesas", label: "Mesas", icon: Users },
  { id: "regalo", label: "Regalo", icon: Gift },
  { id: "playlist", label: "Playlist", icon: Music },
  { id: "fotos", label: "Fotos", icon: Camera },
  { id: "firmas", label: "Firmas", icon: BookOpen },
  { id: "faq", label: "FAQ", icon: HelpCircle },
  { id: "rsvp", label: "RSVP", icon: Mail },
  { id: "compartir", label: "Compartir", icon: Share2 },
];

const WeddingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [wedding, setWedding] = useState<WeddingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("inicio");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isScrollingRef = useRef(false);

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

  // Intersection observer for active section tracking
  useEffect(() => {
    if (!wedding) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [wedding]);

  // Show/hide scroll-to-top + navbar background
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setShowScrollTop(y > 600);
      setNavVisible(y > 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = sectionRefs.current[id];
    if (!el) return;
    isScrollingRef.current = true;
    setActiveSection(id);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => { isScrollingRef.current = false; }, 800);
  }, []);

  const themeVars = useMemo(() => {
    if (!wedding) return {};
    return themeStyles[wedding.theme_preset] || themeStyles.elegant;
  }, [wedding]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Heart className="w-8 h-8 text-primary animate-pulse" />
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

  const setRef = (id: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <div className="min-h-screen bg-background" style={themeVars as React.CSSProperties}>
      {/* Sticky nav with transition */}
      <nav className={`sticky top-0 z-50 border-b border-border transition-all duration-500 ${navVisible ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-background/60 backdrop-blur-sm"}`}>
        <div className="max-w-5xl mx-auto px-2">
          <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide py-2">
            {sections.map((s) => {
              const Icon = s.icon;
              const isActive = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs sm:text-sm whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-primary-foreground font-medium shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
              );
            })}
            <div className="ml-auto pl-2 flex-shrink-0">
              <LangToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* All sections rendered continuously */}
      <main>
        {/* Inicio — Parallax hero */}
        <section id="inicio" ref={setRef("inicio")}>
          <div className="relative h-[75vh] sm:h-[85vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
              <img
                src={wedding.hero_image_url || heroImage}
                alt="Boda"
                className={`w-full h-full object-cover transition-all duration-[1.5s] will-change-transform ${heroLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
                onLoad={() => setHeroLoaded(true)}
                style={{ animation: "slowZoom 25s ease-in-out infinite alternate" }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-foreground/40 to-foreground/60" />
            </div>
            <div className={`relative z-10 text-center px-6 transition-all duration-1000 delay-300 ${heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <p className="font-body text-primary-foreground/70 tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[10px] sm:text-xs mb-4 sm:mb-6">
                ¡Nos casamos!
              </p>
              <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-primary-foreground mb-4 leading-[0.9]">
                {wedding.partner1_name || "Nombre"}
                <span className="block text-xl sm:text-2xl md:text-3xl font-body font-light tracking-widest my-2 sm:my-3 text-primary-foreground/50">
                  &
                </span>
                {wedding.partner2_name || "Nombre"}
              </h1>
              {formattedDate && (
                <p className="text-primary-foreground/80 text-base sm:text-lg font-light tracking-wide mt-4">
                  {formattedDate}
                </p>
              )}
            </div>

            {/* Scroll hint */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
              <div className="w-5 h-9 rounded-full border-2 border-primary-foreground/25 flex items-start justify-center p-1.5">
                <div className="w-0.5 h-2 rounded-full bg-primary-foreground/50 animate-bounce" />
              </div>
            </div>
          </div>

          {weddingDate && (
            <div className="bg-secondary py-12 sm:py-16">
              <WeddingCountdown targetDate={weddingDate} />
            </div>
          )}

          {wedding.dress_code && (
            <div className="py-10 sm:py-12 bg-background text-center">
              <p className="text-muted-foreground text-xs sm:text-sm uppercase tracking-widest mb-1">Código de vestimenta</p>
              <p className="font-heading text-lg sm:text-xl text-foreground">{wedding.dress_code}</p>
            </div>
          )}
        </section>

        {/* Historia */}
        <section id="historia" ref={setRef("historia")} className="scroll-mt-14">
          <AnimatedSection>
            <WeddingStory weddingId={wedding.id} />
          </AnimatedSection>
        </section>

        {/* Agenda */}
        <section id="agenda" ref={setRef("agenda")} className="scroll-mt-14">
          <AnimatedSection>
            <WeddingAgenda weddingId={wedding.id} />
          </AnimatedSection>
        </section>

        {/* Lugar */}
        <section id="lugar" ref={setRef("lugar")} className="scroll-mt-14">
          <AnimatedSection>
            <WeddingVenue wedding={wedding} />
          </AnimatedSection>
        </section>

        {/* Mapa */}
        <section id="mapa" ref={setRef("mapa")} className="scroll-mt-14">
          <AnimatedSection>
            <WeddingMap
              ceremonyVenue={wedding.ceremony_venue}
              ceremonyAddress={wedding.ceremony_address}
              receptionVenue={wedding.reception_venue}
              receptionAddress={wedding.reception_address}
            />
          </AnimatedSection>
        </section>

        {/* Menú */}
        <section id="menu" ref={setRef("menu")} className="scroll-mt-14">
          <AnimatedSection>
            <WeddingMenu starters={wedding.menu_starters} mains={wedding.menu_mains} desserts={wedding.menu_desserts} />
          </AnimatedSection>
        </section>

        {/* Alojamiento */}
        <section id="alojamiento" ref={setRef("alojamiento")} className="scroll-mt-14">
          <AnimatedSection>
            <WeddingAccommodations weddingId={wedding.id} />
          </AnimatedSection>
        </section>

        {/* Mesas */}
        <section id="mesas" ref={setRef("mesas")} className="scroll-mt-14">
          <AnimatedSection>
            <WeddingSeating weddingId={wedding.id} weddingDate={wedding.wedding_date} />
          </AnimatedSection>
        </section>

        {/* Regalo */}
        <section id="regalo" ref={setRef("regalo")} className="scroll-mt-14">
          <AnimatedSection>
            <WeddingGift bankAccount={wedding.bank_account} message={wedding.gift_message} />
          </AnimatedSection>
        </section>

        {/* Playlist */}
        <section id="playlist" ref={setRef("playlist")} className="scroll-mt-14">
          <AnimatedSection>
            <WeddingPlaylist weddingId={wedding.id} />
          </AnimatedSection>
        </section>

        {/* Fotos */}
        <section id="fotos" ref={setRef("fotos")} className="scroll-mt-14">
          <AnimatedSection>
            <WeddingPhotos weddingId={wedding.id} />
          </AnimatedSection>
        </section>

        {/* Firmas */}
        <section id="firmas" ref={setRef("firmas")} className="scroll-mt-14">
          <AnimatedSection>
            <WeddingGuestbook weddingId={wedding.id} />
          </AnimatedSection>
        </section>

        {/* FAQ */}
        <section id="faq" ref={setRef("faq")} className="scroll-mt-14">
          <AnimatedSection>
            <WeddingFaq weddingId={wedding.id} />
          </AnimatedSection>
        </section>

        {/* RSVP */}
        <section id="rsvp" ref={setRef("rsvp")} className="scroll-mt-14">
          <AnimatedSection>
            <WeddingRsvp weddingId={wedding.id} whatsappNumber={wedding.whatsapp_number} partner1={wedding.partner1_name} partner2={wedding.partner2_name} />
          </AnimatedSection>
        </section>

        {/* Compartir */}
        <section id="compartir" ref={setRef("compartir")} className="scroll-mt-14">
          <AnimatedSection>
            <WeddingShare slug={wedding.slug} partner1={wedding.partner1_name} partner2={wedding.partner2_name} />
          </AnimatedSection>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-10 bg-card border-t border-border text-center">
        <Heart className="w-5 h-5 text-primary mx-auto mb-3 opacity-60" />
        <p className="font-heading text-xl text-foreground">
          {wedding.partner1_name} & {wedding.partner2_name}
        </p>
        {formattedDate && (
          <p className="text-muted-foreground text-sm font-light mt-1">{formattedDate}</p>
        )}
      </footer>

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:opacity-90 transition-all duration-300 ${showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>

      <style>{`
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

const WeddingPageWrapper = () => (
  <LangProvider>
    <WeddingPage />
  </LangProvider>
);

export default WeddingPageWrapper;
