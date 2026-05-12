import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import heroImage from "@/assets/hero-wedding.webp";
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
import WeddingEditToolbar from "@/components/wedding/WeddingEditToolbar";
import EditableText from "@/components/wedding/EditableText";
import WeddingIntro from "@/components/wedding/WeddingIntro";
import WeddingSaveTheDate from "@/components/wedding/WeddingSaveTheDate";
import WeddingDayMode from "@/components/wedding/WeddingDayMode";
import { LangProvider, LangToggle } from "@/contexts/LangContext";
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
  user_id?: string;
  is_published?: boolean;
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
  garden: {
    "--background": "140 20% 96%",
    "--foreground": "150 30% 12%",
    "--card": "140 18% 93%",
    "--card-foreground": "150 30% 12%",
    "--primary": "150 35% 35%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "140 15% 88%",
    "--secondary-foreground": "150 30% 15%",
    "--muted": "140 12% 90%",
    "--muted-foreground": "150 10% 45%",
    "--border": "140 12% 82%",
    "--accent": "45 50% 55%",
  },
  bohemian: {
    "--background": "15 25% 95%",
    "--foreground": "10 30% 14%",
    "--card": "15 20% 91%",
    "--card-foreground": "10 30% 14%",
    "--primary": "10 55% 45%",
    "--primary-foreground": "15 25% 97%",
    "--secondary": "30 20% 87%",
    "--secondary-foreground": "10 30% 18%",
    "--muted": "20 15% 89%",
    "--muted-foreground": "10 12% 48%",
    "--border": "20 15% 80%",
    "--accent": "45 45% 50%",
  },
  minimal: {
    "--background": "0 0% 98%",
    "--foreground": "0 0% 8%",
    "--card": "0 0% 96%",
    "--card-foreground": "0 0% 8%",
    "--primary": "0 0% 12%",
    "--primary-foreground": "0 0% 98%",
    "--secondary": "0 0% 92%",
    "--secondary-foreground": "0 0% 15%",
    "--muted": "0 0% 94%",
    "--muted-foreground": "0 0% 45%",
    "--border": "0 0% 88%",
    "--accent": "0 0% 30%",
  },
  tropical: {
    "--background": "45 50% 96%",
    "--foreground": "170 40% 10%",
    "--card": "45 40% 93%",
    "--card-foreground": "170 40% 10%",
    "--primary": "170 55% 35%",
    "--primary-foreground": "45 50% 97%",
    "--secondary": "45 30% 88%",
    "--secondary-foreground": "170 40% 15%",
    "--muted": "45 25% 90%",
    "--muted-foreground": "170 15% 45%",
    "--border": "45 25% 82%",
    "--accent": "35 70% 55%",
  },
  lavender: {
    "--background": "270 25% 97%",
    "--foreground": "270 20% 14%",
    "--card": "270 20% 94%",
    "--card-foreground": "270 20% 14%",
    "--primary": "270 35% 50%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "270 18% 90%",
    "--secondary-foreground": "270 20% 18%",
    "--muted": "270 12% 92%",
    "--muted-foreground": "270 10% 48%",
    "--border": "270 12% 84%",
    "--accent": "300 30% 60%",
  },
  mediterranean: {
    "--background": "200 30% 96%",
    "--foreground": "210 35% 12%",
    "--card": "200 25% 93%",
    "--card-foreground": "210 35% 12%",
    "--primary": "210 50% 40%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "40 30% 88%",
    "--secondary-foreground": "210 35% 15%",
    "--muted": "200 15% 90%",
    "--muted-foreground": "210 15% 45%",
    "--border": "200 15% 82%",
    "--accent": "40 55% 55%",
  },
  autumn: {
    "--background": "30 25% 95%",
    "--foreground": "15 35% 12%",
    "--card": "30 20% 91%",
    "--card-foreground": "15 35% 12%",
    "--primary": "15 60% 40%",
    "--primary-foreground": "30 25% 97%",
    "--secondary": "35 20% 86%",
    "--secondary-foreground": "15 35% 16%",
    "--muted": "30 15% 89%",
    "--muted-foreground": "15 12% 46%",
    "--border": "30 15% 80%",
    "--accent": "45 55% 48%",
  },
  nocturnal: {
    "--background": "230 25% 12%",
    "--foreground": "220 15% 90%",
    "--card": "230 22% 16%",
    "--card-foreground": "220 15% 90%",
    "--primary": "45 60% 60%",
    "--primary-foreground": "230 25% 10%",
    "--secondary": "230 18% 22%",
    "--secondary-foreground": "220 15% 85%",
    "--muted": "230 15% 20%",
    "--muted-foreground": "220 10% 55%",
    "--border": "230 15% 25%",
    "--accent": "45 50% 50%",
  },
  vintage: {
    "--background": "35 22% 94%",
    "--foreground": "25 28% 17%",
    "--card": "35 18% 90%",
    "--card-foreground": "25 28% 17%",
    "--primary": "345 28% 50%",
    "--primary-foreground": "35 22% 97%",
    "--secondary": "35 16% 85%",
    "--secondary-foreground": "25 28% 22%",
    "--muted": "35 12% 88%",
    "--muted-foreground": "25 10% 48%",
    "--border": "35 14% 78%",
    "--accent": "30 38% 52%",
  },
  coastal: {
    "--background": "200 18% 97%",
    "--foreground": "210 38% 13%",
    "--card": "200 14% 93%",
    "--card-foreground": "210 38% 13%",
    "--primary": "210 52% 36%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "40 28% 89%",
    "--secondary-foreground": "210 38% 16%",
    "--muted": "200 14% 91%",
    "--muted-foreground": "210 14% 45%",
    "--border": "200 14% 82%",
    "--accent": "38 58% 58%",
  },
  celestial: {
    "--background": "240 38% 8%",
    "--foreground": "220 18% 88%",
    "--card": "240 32% 12%",
    "--card-foreground": "220 18% 88%",
    "--primary": "45 72% 58%",
    "--primary-foreground": "240 38% 8%",
    "--secondary": "240 25% 18%",
    "--secondary-foreground": "220 18% 82%",
    "--muted": "240 20% 16%",
    "--muted-foreground": "220 12% 52%",
    "--border": "240 22% 22%",
    "--accent": "45 55% 42%",
  },
  spring: {
    "--background": "345 28% 97%",
    "--foreground": "330 22% 15%",
    "--card": "345 22% 94%",
    "--card-foreground": "330 22% 15%",
    "--primary": "345 52% 62%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "345 16% 90%",
    "--secondary-foreground": "330 22% 18%",
    "--muted": "345 12% 92%",
    "--muted-foreground": "330 10% 48%",
    "--border": "345 14% 84%",
    "--accent": "120 28% 52%",
  },
  forest: {
    "--background": "130 18% 92%",
    "--foreground": "140 38% 9%",
    "--card": "130 14% 88%",
    "--card-foreground": "140 38% 9%",
    "--primary": "140 42% 26%",
    "--primary-foreground": "130 18% 95%",
    "--secondary": "130 12% 83%",
    "--secondary-foreground": "140 38% 13%",
    "--muted": "130 10% 86%",
    "--muted-foreground": "140 10% 44%",
    "--border": "130 12% 76%",
    "--accent": "30 52% 44%",
  },
  sunset: {
    "--background": "28 38% 96%",
    "--foreground": "15 32% 13%",
    "--card": "28 30% 92%",
    "--card-foreground": "15 32% 13%",
    "--primary": "15 68% 50%",
    "--primary-foreground": "28 38% 97%",
    "--secondary": "30 24% 87%",
    "--secondary-foreground": "15 32% 18%",
    "--muted": "28 18% 90%",
    "--muted-foreground": "15 12% 46%",
    "--border": "28 18% 80%",
    "--accent": "45 68% 50%",
  },
};

const sections = [
  { id: "inicio", label: "Inicio", icon: Heart },
  { id: "historia", label: "Historia", icon: BookHeart },
  { id: "agenda", label: "Agenda", icon: Clock },
  { id: "lugar", label: "Lugar", icon: MapPin },
  { id: "mapa", label: "Mapa", icon: Navigation },
  { id: "rsvp", label: "RSVP", icon: Mail },
  { id: "menu", label: "Menú", icon: UtensilsCrossed },
  { id: "alojamiento", label: "Alojamiento", icon: Hotel },
  { id: "mesas", label: "Mesas", icon: Users },
  { id: "regalo", label: "Regalo", icon: Gift },
  { id: "playlist", label: "Playlist", icon: Music },
  { id: "fotos", label: "Fotos", icon: Camera },
  { id: "firmas", label: "Firmas", icon: BookOpen },
  { id: "faq", label: "FAQ", icon: HelpCircle },
  { id: "compartir", label: "Compartir", icon: Share2 },
];

const WeddingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { openCheckout } = usePaddleCheckout();
  const [wedding, setWedding] = useState<WeddingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("inicio");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isScrollingRef = useRef(false);

  const [editMode, setEditMode] = useState(false);
  const [edits, setEdits] = useState<Partial<WeddingData>>({});
  const isOwner = !!(user && wedding && wedding.user_id === user.id);
  const isDemo = slug?.startsWith("demo-") ?? false;
  const isPreview = isOwner && !wedding?.is_published && !isDemo;

  useEffect(() => {
    if (!slug) return;
    const fetchWedding = async () => {
      const { data } = await supabase.rpc("get_wedding_by_slug", { p_slug: slug });
      const row = Array.isArray(data) ? data[0] : data;
      setWedding(row as WeddingData | null);
      setLoading(false);
    };
    fetchWedding();
  }, [slug]);

  useEffect(() => {
    if (!wedding) return;
    const p1 = wedding.partner1_name || "Nombre";
    const p2 = wedding.partner2_name || "Nombre";
    document.title = `Boda de ${p1} & ${p2} — BodasFácil`;
    return () => { document.title = "BodasFácil"; };
  }, [wedding]);
useEffect(() => {
  if (!wedding) return;
  const p1 = wedding.partner1_name || "Nombre";
  const p2 = wedding.partner2_name || "Nombre";
  const url = `https://bodasfacil.com/w/${wedding.slug}`;
  const title = isDemo
    ? `Demo web de boda ${wedding.theme_preset} — BodasFácil`
    : `Boda de ${p1} & ${p2} — BodasFácil`;
  const description = isDemo
    ? `Explora esta demo de web de boda con tema ${wedding.theme_preset}. RSVP online, plan de mesas, playlist colaborativa y mucho más. Crea la tuya desde 30€.`
    : `Web de boda de ${p1} & ${p2}. Confirma tu asistencia, consulta el menú, el plan de mesas y mucho más.`;

  document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
  document.querySelector('meta[property="og:url"]')?.setAttribute("content", url);
  if (wedding.hero_image_url) {
    document.querySelector('meta[property="og:image"]')?.setAttribute("content", wedding.hero_image_url);
    document.querySelector('meta[name="twitter:image"]')?.setAttribute("content", wedding.hero_image_url);
  }

  if (isDemo) {
    const existingSchema = document.getElementById("schema-wedding");
    if (existingSchema) existingSchema.remove();
    const schema = document.createElement("script");
    schema.id = "schema-wedding";
    schema.type = "application/ld+json";
    schema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": title,
      "description": description,
      "url": url,
      "image": wedding.hero_image_url || "https://bodasfacil.com/og-image.jpg",
      "isPartOf": { "@type": "WebSite", "name": "BodasFácil", "url": "https://bodasfacil.com" }
    });
    document.head.appendChild(schema);
  }

  return () => {
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Crea la web de tu boda perfecta en minutos. RSVP online, playlist colaborativa, muro de fotos en vivo, plan de mesas, agenda del día, mapa y 18 temas visuales. Pago único desde 30€.");
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", "https://bodasfacil.com/");
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", "BodasFácil — Crea la web de tu boda perfecta desde 30€");
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", "RSVP online, playlist colaborativa, muro de fotos en vivo, plan de mesas, agenda y 18 temas visuales. Pago único, sin suscripciones.");
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", "https://bodasfacil.com/");
    document.querySelector('meta[property="og:image"]')?.setAttribute("content", "https://bodasfacil.com/og-image.jpg");
    document.getElementById("schema-wedding")?.remove();
  };
}, [wedding, isDemo]);
  useEffect(() => {
    if (!wedding) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) { setActiveSection(entry.target.id); break; }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [wedding]);

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

  const val = useCallback(
    <K extends keyof WeddingData>(key: K): WeddingData[K] => {
      if (key in edits) return edits[key] as WeddingData[K];
      return wedding![key];
    },
    [wedding, edits]
  );

  const setEdit = useCallback(<K extends keyof WeddingData>(key: K, value: WeddingData[K]) => {
    setEdits((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleThemeChange = useCallback((theme: string) => {
    setEdits((prev) => ({ ...prev, theme_preset: theme }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!wedding || Object.keys(edits).length === 0) return;
    const { error } = await supabase.from("weddings").update(edits).eq("id", wedding.id);
    if (error) throw error;
    setWedding((prev) => prev ? { ...prev, ...edits } : prev);
    setEdits({});
  }, [wedding, edits]);

  const themeVars = useMemo(() => {
    if (!wedding) return {};
    const preset = (edits.theme_preset as string) || wedding.theme_preset;
    return themeStyles[preset] || themeStyles.elegant;
  }, [wedding, edits.theme_preset]);



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

  const setRef = (id: string) => (el: HTMLDivElement | null) => { sectionRefs.current[id] = el; };

  const p1 = val("partner1_name") || "Nombre";
  const p2 = val("partner2_name") || "Nombre";
  const dressCode = val("dress_code");
  const giftMsg = val("gift_message");
  const bankAcc = val("bank_account");

  return (
    <div className="min-h-screen bg-background" style={themeVars as React.CSSProperties}>
      {showIntro && !isOwner && (
        <WeddingIntro partner1={p1} partner2={p2} weddingDate={wedding.wedding_date} onComplete={() => setShowIntro(false)} />
      )}

      {isOwner && !isDemo && (
        <WeddingEditToolbar
          editMode={editMode}
          setEditMode={setEditMode}
          weddingId={wedding.id}
          currentTheme={(edits.theme_preset as string) || wedding.theme_preset}
          edits={edits}
          onThemeChange={handleThemeChange}
          onSave={handleSave}
          hasChanges={Object.keys(edits).length > 0}
        />
      )}

      {/* Banner demo */}
      {isDemo && (
        <div className="sticky top-0 z-[60] bg-primary text-primary-foreground text-center py-2 px-4 text-sm font-medium">
          ✨ Esto es una demo · <a href="/auth" className="underline font-semibold hover:opacity-80">Crea la tuya desde 30€</a>
        </div>
      )}

      {/* Banner preview — solo propietario sin pago */}
      {isPreview && (
        <div className="sticky top-0 z-[60] bg-amber-500 text-white py-2.5 px-4 text-sm font-medium flex items-center justify-center gap-3 flex-wrap">
          <span>👁️ Modo preview — publica tu boda para activar todas las funciones</span>
          <button
            onClick={() => openCheckout({ priceId: "basico_one_time", customerEmail: user?.email || undefined, customData: { userId: user?.id || "" }, successUrl: `${window.location.origin}/dashboard?checkout=success&plan=basico` })}
            className="bg-white text-amber-600 text-xs font-semibold px-3 py-1 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Básico · 30€
          </button>
          <button
            onClick={() => openCheckout({ priceId: "completo_one_time", customerEmail: user?.email || undefined, customData: { userId: user?.id || "" }, successUrl: `${window.location.origin}/dashboard?checkout=success&plan=completo` })}
            className="bg-amber-700 text-white text-xs font-semibold px-3 py-1 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Completo · 60€ ⭐
          </button>
        </div>
      )}

      <nav className={`sticky ${editMode ? "top-[52px]" : isPreview || isDemo ? "top-[44px]" : "top-0"} z-50 border-b border-border transition-all duration-500 ${navVisible ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-background/60 backdrop-blur-sm"}`}>
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
                    isActive ? "bg-primary text-primary-foreground font-medium shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
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

      <main>
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
              <p className="font-body text-primary-foreground/70 tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[10px] sm:text-xs mb-4 sm:mb-6">¡Nos casamos!</p>
              <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-primary-foreground mb-4 leading-[0.9]">
                <EditableText value={p1} onChange={(v) => setEdit("partner1_name", v)} editMode={editMode} tag="span" className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-primary-foreground leading-[0.9]" placeholder="Nombre 1" />
                <span className="block text-xl sm:text-2xl md:text-3xl font-body font-light tracking-widest my-2 sm:my-3 text-primary-foreground/50">&</span>
                <EditableText value={p2} onChange={(v) => setEdit("partner2_name", v)} editMode={editMode} tag="span" className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-primary-foreground leading-[0.9]" placeholder="Nombre 2" />
              </h1>
              {formattedDate && <p className="text-primary-foreground/80 text-base sm:text-lg font-light tracking-wide mt-4">{formattedDate}</p>}
            </div>
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

          {(dressCode || editMode) && (
            <div className="py-10 sm:py-12 bg-background text-center">
              <p className="text-muted-foreground text-xs sm:text-sm uppercase tracking-widest mb-1">Código de vestimenta</p>
              <EditableText value={dressCode} onChange={(v) => setEdit("dress_code", v)} editMode={editMode} tag="p" className="font-heading text-lg sm:text-xl text-foreground" placeholder="Ej: Formal, Casual..." />
            </div>
          )}

          {weddingDate && (
            <WeddingCalendar weddingDate={wedding.wedding_date!} partner1={p1} partner2={p2} ceremonyVenue={wedding.ceremony_venue} ceremonyAddress={wedding.ceremony_address} />
          )}
        </section>

        <section id="historia" ref={setRef("historia")} className="scroll-mt-14">
          <AnimatedSection><WeddingStory weddingId={wedding.id} /></AnimatedSection>
        </section>

        <section id="agenda" ref={setRef("agenda")} className="scroll-mt-14">
          <AnimatedSection><WeddingAgenda weddingId={wedding.id} /></AnimatedSection>
        </section>

        <section id="lugar" ref={setRef("lugar")} className="scroll-mt-14">
          <AnimatedSection>
            <WeddingVenue wedding={{ ...wedding, ceremony_venue: val("ceremony_venue"), ceremony_address: val("ceremony_address"), ceremony_time: val("ceremony_time"), reception_venue: val("reception_venue"), reception_address: val("reception_address"), reception_time: val("reception_time"), dress_code: dressCode }} />
          </AnimatedSection>
        </section>

        <section id="mapa" ref={setRef("mapa")} className="scroll-mt-14">
          <AnimatedSection>
            <WeddingMap ceremonyVenue={val("ceremony_venue")} ceremonyAddress={val("ceremony_address")} receptionVenue={val("reception_venue")} receptionAddress={val("reception_address")} />
          </AnimatedSection>
        </section>

        <section id="rsvp" ref={setRef("rsvp")} className="scroll-mt-14">
          <AnimatedSection>
            <WeddingRsvp weddingId={wedding.id} whatsappNumber={wedding.whatsapp_number} partner1={p1} partner2={p2} />
          </AnimatedSection>
        </section>

        <section id="menu" ref={setRef("menu")} className="scroll-mt-14">
          <AnimatedSection>
            <WeddingMenu starters={val("menu_starters")} mains={val("menu_mains")} desserts={val("menu_desserts")} />
          </AnimatedSection>
        </section>

        <section id="alojamiento" ref={setRef("alojamiento")} className="scroll-mt-14">
          <AnimatedSection><WeddingAccommodations weddingId={wedding.id} /></AnimatedSection>
        </section>

        <section id="mesas" ref={setRef("mesas")} className="scroll-mt-14">
          <AnimatedSection><WeddingSeating weddingId={wedding.id} weddingDate={wedding.wedding_date} /></AnimatedSection>
        </section>

        <section id="regalo" ref={setRef("regalo")} className="scroll-mt-14">
          <AnimatedSection><WeddingGift bankAccount={bankAcc} message={giftMsg} /></AnimatedSection>
        </section>

        <section id="playlist" ref={setRef("playlist")} className="scroll-mt-14">
          <AnimatedSection><WeddingPlaylist weddingId={wedding.id} /></AnimatedSection>
        </section>

        <section id="fotos" ref={setRef("fotos")} className="scroll-mt-14">
          <AnimatedSection><WeddingPhotos weddingId={wedding.id} /></AnimatedSection>
        </section>

        <section id="firmas" ref={setRef("firmas")} className="scroll-mt-14">
          <AnimatedSection><WeddingGuestbook weddingId={wedding.id} /></AnimatedSection>
        </section>

        <section id="faq" ref={setRef("faq")} className="scroll-mt-14">
          <AnimatedSection><WeddingFaq weddingId={wedding.id} /></AnimatedSection>
        </section>

        <section id="compartir" ref={setRef("compartir")} className="scroll-mt-14">
          <AnimatedSection><WeddingShare slug={wedding.slug} partner1={p1} partner2={p2} /></AnimatedSection>
        </section>

        <section className="scroll-mt-14">
          <AnimatedSection>
            <WeddingSaveTheDate partner1={p1} partner2={p2} weddingDate={wedding.wedding_date} ceremonyVenue={wedding.ceremony_venue} heroImageUrl={wedding.hero_image_url} />
          </AnimatedSection>
        </section>

        {/* CTA final publicar en modo preview */}
        {isPreview && (
          <section className="py-16 bg-amber-50 border-t border-amber-200 text-center px-4">
            <div className="max-w-md mx-auto">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="font-heading text-2xl text-amber-900 mb-2">¡Tu boda está lista!</h3>
              <p className="text-amber-700 font-light text-sm mb-6">
                Publícala para que tus invitados puedan verla. Desde 30€, pago único, sin suscripciones y con 30 días de garantía.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => openCheckout({ priceId: "basico_one_time", customerEmail: user?.email || undefined, customData: { userId: user?.id || "" }, successUrl: `${window.location.origin}/dashboard?checkout=success` })}
                  className="px-6 py-3.5 rounded-xl border-2 border-amber-500 text-amber-700 font-medium hover:bg-amber-500 hover:text-white transition-all"
                >
                  Plan Básico · 30€
                </button>
                <button
                  onClick={() => openCheckout({ priceId: "completo_one_time", customerEmail: user?.email || undefined, customData: { userId: user?.id || "" }, successUrl: `${window.location.origin}/dashboard?checkout=success` })}
                  className="px-6 py-3.5 rounded-xl bg-amber-500 text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Plan Completo · 60€ ⭐
                </button>
              </div>
              <p className="text-xs text-amber-600 mt-3">30 días de garantía de devolución</p>
            </div>
          </section>
        )}
      </main>

      <footer className="py-10 bg-card border-t border-border text-center">
        <Heart className="w-5 h-5 text-primary mx-auto mb-3 opacity-60" />
        <p className="font-heading text-xl text-foreground">{p1} & {p2}</p>
        {formattedDate && <p className="text-muted-foreground text-sm font-light mt-1">{formattedDate}</p>}
        <p className="text-muted-foreground text-xs font-light mt-3">
          Creado con <a href="https://bodasfacil.com" className="text-primary hover:underline">BodasFácil</a>
        </p>
      </footer>

      {wedding.wedding_date && !isOwner && !isDemo && (
        <WeddingDayMode weddingId={wedding.id} weddingDate={wedding.wedding_date} ceremonyAddress={wedding.ceremony_address} receptionAddress={wedding.reception_address} />
      )}

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:opacity-90 transition-all duration-300 ${showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>

      <style>{`
        @keyframes slowZoom { from { transform: scale(1); } to { transform: scale(1.08); } }
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
