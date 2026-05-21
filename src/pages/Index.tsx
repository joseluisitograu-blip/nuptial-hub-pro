import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Heart, Sparkles, Users, Music, Camera, MapPin, Clock, HelpCircle, BookHeart, Gift, Share2, ArrowRight, CheckCircle, Play, Menu, X, Wallet, ListChecks, Shield, Zap, RefreshCcw, Star } from "lucide-react";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import ContactModal from "@/components/ContactModal";
import { track, trackBeginCheckout } from "@/lib/analytics";

const features = [
  { icon: Users, title: "RSVP sin WhatsApp", desc: "Tus invitados confirman asistencia, acompañantes y restricciones de dieta en un clic. Tú lo ves todo en tiempo real.", badge: null },
  { icon: Music, title: "Playlist colaborativa", desc: "Cada invitado sugiere y vota canciones para la fiesta. La pista no se vaciará en toda la noche.", badge: null },
  { icon: Camera, title: "Muro de fotos en vivo", desc: "Todos comparten sus mejores fotos del gran día. Un recuerdo colectivo que se construye solo.", badge: null },
  { icon: Users, title: "Plan de mesas inteligente", desc: "Arrastra y suelta a tus invitados entre mesas. Visible solo un día antes — crea expectación.", badge: null },
  { icon: Sparkles, title: "Historia de amor con IA", desc: "La primera plataforma en España que usa IA para escribir vuestra historia romántica personalizada en 10 segundos.", badge: "Solo en BodasFácil ✦" },
  { icon: Heart, title: "18 temas visuales únicos", desc: "Elegante, Vintage, Costero, Celestial, Primavera, Bosque, Atardecer y más. Personaliza cada detalle del diseño.", badge: null },
];

const demos = [
  { slug: "demo-elegant", theme: "Elegante", couple: "Sofía & Daniel", color: "hsl(33, 30%, 40%)", gradient: "from-amber-800/20 to-amber-600/10" },
  { slug: "demo-romantic", theme: "Romántico", couple: "Isabella & Marco", color: "hsl(340, 45%, 55%)", gradient: "from-pink-600/20 to-rose-400/10" },
  { slug: "demo-rustic", theme: "Rústico", couple: "Elena & Pablo", color: "hsl(25, 50%, 32%)", gradient: "from-orange-900/20 to-orange-700/10" },
  { slug: "demo-modern", theme: "Moderno", couple: "Martina & Álex", color: "hsl(220, 25%, 18%)", gradient: "from-slate-800/20 to-slate-600/10" },
  { slug: "demo-autumn", theme: "Otoñal", couple: "Carmen & Javier", color: "hsl(15, 60%, 40%)", gradient: "from-orange-900/20 to-amber-700/10" },
  { slug: "demo-valencia", theme: "Valenciano", couple: "Lucia & Marcos", color: "hsl(33, 70%, 45%)", gradient: "from-orange-700/20 to-amber-500/10" },
  { slug: "demo-nocturnal", theme: "Nocturno", couple: "Valentina & Hugo", color: "hsl(45, 60%, 58%)", gradient: "from-slate-900/30 to-slate-700/15" },
  { slug: "demo-coastal", theme: "Costero", couple: "Marina & Nico", color: "hsl(210, 52%, 36%)", gradient: "from-blue-700/20 to-sky-500/10" },
];

const testimonials = [
  { name: "Laura & Sergio", location: "Valencia · Mayo 2026", initials: "LS", text: "La IA escribió nuestra historia de amor y lloré leyéndola. El día de la boda, los invitados no paraban de decir lo bonita que era. El plan de mesas: 18 mesas en 10 minutos." },
  { name: "Marta & Pau", location: "Barcelona · Abril 2026", initials: "MP", text: "La playlist colaborativa fue lo mejor del día. Cada invitado votó sus canciones y la pista no se vació en toda la noche. Cero llamadas de coordinación. Cero grupos de WhatsApp." },
  { name: "Ana & Roberto", location: "Madrid · Marzo 2026", initials: "AR", text: "En 20 minutos teníamos todo listo: RSVP, fotos, agenda. La IA nos escribió una historia que enmarcamos para el salón. La mejor inversión de toda la boda, sin duda." },
];

const useReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
};

const RevealSection = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-7 scale-[0.97]"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const wrapTextCanvas = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines = 10): void => {
  const words = text.split(" ");
  let line = "";
  let currentY = y;
  let lineCount = 0;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
      if (lineCount >= maxLines - 1) { ctx.fillText(line.trim() + "...", x, currentY); return; }
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
      lineCount++;
    } else { line = testLine; }
  }
  if (line.trim()) ctx.fillText(line.trim(), x, currentY);
};

const Index = () => {
  const { openCheckout, loading } = usePaddleCheckout();
  const [contactOpen, setContactOpen] = useState(false);
  const pricingRef = useRef<HTMLElement>(null);
  const [contactSubject, setContactSubject] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [socialProof, setSocialProof] = useState<{ name: string; city: string } | null>(null);

  const [aiName1, setAiName1] = useState("");
  const [aiName2, setAiName2] = useState("");
  const [aiHowMet, setAiHowMet] = useState("");
  const [aiProposal, setAiProposal] = useState("");
  const [aiStory, setAiStory] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const generateShareCard = () => {
    const size = 1080;
    const canvas = document.createElement("canvas");
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const bg = ctx.createLinearGradient(0, 0, 0, size);
    bg.addColorStop(0, "#faf9f7"); bg.addColorStop(1, "#e8ddd0");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = "#c4a882"; ctx.lineWidth = 4; ctx.strokeRect(52, 52, size - 104, size - 104);
    ctx.strokeStyle = "#e0cdb0"; ctx.lineWidth = 1; ctx.strokeRect(64, 64, size - 128, size - 128);
    ctx.font = "88px serif"; ctx.fillStyle = "#8a6d3b"; ctx.textAlign = "center"; ctx.fillText("♡", size / 2, 210);
    const namesText = `${aiName1} & ${aiName2}`;
    ctx.fillStyle = "#3d2c16"; ctx.font = "bold 74px Georgia, serif";
    if (ctx.measureText(namesText).width > size - 180) ctx.font = "bold 56px Georgia, serif";
    ctx.fillText(namesText, size / 2, 330);
    ctx.fillStyle = "#c4a882"; ctx.fillRect(size / 2 - 90, 358, 180, 2);
    ctx.font = "34px Georgia, serif"; ctx.fillStyle = "#5c4030";
    const firstPara = aiStory.split("\n\n")[0] || aiStory;
    wrapTextCanvas(ctx, firstPara, size / 2, 420, size - 200, 52, 9);
    ctx.font = "italic 26px Georgia, serif"; ctx.fillStyle = "#9a8060"; ctx.fillText("— bodasfacil.com", size / 2, size - 78);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `historia-${aiName1}-${aiName2}.png`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
      track("ia_compartir_instagram");
    }, "image/png");
  };

  const generateStory = async () => {
    if (!aiName1.trim() || !aiName2.trim() || !aiHowMet.trim()) return;
    setAiLoading(true); setAiError(""); setAiStory(""); track("ia_generar_historia");
    try {
      const res = await fetch("https://bcrymaflkapbfvytcjaq.supabase.co/functions/v1/generate-wedding-story", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partner1: aiName1.trim(), partner2: aiName2.trim(), howWeMet: aiHowMet.trim(), proposalStory: aiProposal.trim() }),
      });
      const data = await res.json();
      if (data.story) { setAiStory(data.story); track("ia_historia_generada"); }
      else setAiError("Ups, algo salió mal. Inténtalo de nuevo.");
    } catch { setAiError("Error de conexión. Inténtalo de nuevo."); }
    setAiLoading(false);
  };

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 60); setShowStickyCTA(window.scrollY > 500); };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const el = document.createElement("script"); el.id = "schema-howto"; el.type = "application/ld+json";
    el.text = JSON.stringify({ "@context": "https://schema.org", "@type": "HowTo", "name": "Cómo crear una web de boda online en BodasFácil", "description": "Crea tu página web de boda personalizada en 3 pasos.", "totalTime": "PT5M", "estimatedCost": { "@type": "MonetaryAmount", "currency": "EUR", "value": "15" }, "tool": [{ "@type": "WebApplication", "name": "BodasFácil", "url": "https://bodasfacil.com" }], "step": [{ "@type": "HowToStep", "position": "1", "name": "Regístrate gratis", "url": "https://bodasfacil.com/auth", "text": "Crea tu cuenta en segundos." }, { "@type": "HowToStep", "position": "2", "name": "Personaliza tu web de boda", "url": "https://bodasfacil.com/dashboard", "text": "Elige uno de los 18 temas y personaliza todo." }, { "@type": "HowToStep", "position": "3", "name": "Publica y comparte", "url": "https://bodasfacil.com/#pricing", "text": "Desde 15€ de pago único." }] });
    document.head.appendChild(el);
    return () => document.getElementById("schema-howto")?.remove();
  }, []);

  useEffect(() => {
    const milestones = new Set<number>();
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (!total) return;
      const pct = Math.round((window.scrollY / total) * 100);
      ([25, 50, 75, 90] as const).forEach((m) => { if (pct >= m && !milestones.has(m)) { milestones.add(m); track("scroll_depth", { depth: m, page: "home" }); } });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const el = pricingRef.current; if (!el) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { track("view_pricing", { page: "home" }); observer.disconnect(); } }, { threshold: 0.3 });
    observer.observe(el); return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let shown = false;
    const handleMouseLeave = (e: MouseEvent) => { if (e.clientY <= 5 && !shown) { shown = true; setShowExitIntent(true); track("exit_intent_shown"); } };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  useEffect(() => {
    const SOCIAL_PROOF = [
      { name: "Laura y Sergio", city: "Valencia" }, { name: "Marta y Pau", city: "Barcelona" },
      { name: "Ana y Roberto", city: "Madrid" }, { name: "Carmen y Javier", city: "Sevilla" },
      { name: "Sofía y Miguel", city: "Bilbao" }, { name: "Elena y Pablo", city: "Zaragoza" },
    ];
    let idx = Math.floor(Math.random() * SOCIAL_PROOF.length);
    const show = () => { setSocialProof(SOCIAL_PROOF[idx % SOCIAL_PROOF.length]); idx++; setTimeout(() => setSocialProof(null), 4500); };
    const t = setTimeout(show, 5000); const interval = setInterval(show, 22000);
    return () => { clearTimeout(t); clearInterval(interval); };
  }, []);

  const handleBuy = (priceId: string) => {
    const planKey = priceId.includes("basico") ? "basico" : "completo" as "basico" | "completo";
    trackBeginCheckout(planKey); track("clic_comprar", { plan: planKey });
    openCheckout({ priceId, successUrl: `${window.location.origin}/dashboard?checkout=success` });
  };

  const navLinks = [
    { href: "#features", label: "Funcionalidades" }, { href: "#demos", label: "Demos" },
    { href: "#pricing", label: "Precios" }, { href: "/blog", label: "Blog" },
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* Banner oferta 24h */}
      <div className="fixed top-0 inset-x-0 z-[60] bg-red-500 text-white text-center py-2 px-4 text-xs sm:text-sm font-medium">
        🔥 Oferta solo HOY · 50% de descuento · Básico <strong>15€</strong> · Completo <strong>30€</strong> — precio sube mañana
      </div>

      {/* Sticky Navbar */}
      <nav className={`fixed top-8 sm:top-8 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border" : "bg-transparent"}`}>
        <div className="container max-w-5xl flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <Heart className={`w-5 h-5 transition-all duration-300 group-hover:scale-110 ${scrolled ? "text-primary" : "text-primary-foreground"}`} />
            <span className={`font-heading text-lg sm:text-xl transition-colors duration-300 ${scrolled ? "text-foreground" : "text-primary-foreground"}`}>BodasFácil</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className={`text-sm font-light transition-colors duration-300 ${scrolled ? "text-muted-foreground hover:text-foreground" : "text-primary-foreground/70 hover:text-primary-foreground"}`}>{l.label}</a>
            ))}
            <Link to="/auth" onClick={() => track("clic_crear_boda", { location: "navbar" })}
              className={`text-sm font-medium px-5 py-2 rounded-lg transition-all duration-300 ${scrolled ? "bg-primary text-primary-foreground hover:opacity-90 shadow-sm" : "bg-primary-foreground/15 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/25 border border-primary-foreground/20"}`}>
              Crear mi boda
            </Link>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2" aria-label="Menú">
            {mobileMenuOpen ? <X className={`w-5 h-5 ${scrolled ? "text-foreground" : "text-primary-foreground"}`} /> : <Menu className={`w-5 h-5 ${scrolled ? "text-foreground" : "text-primary-foreground"}`} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border px-6 pb-4 space-y-3 animate-fade-in">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1">{l.label}</a>
            ))}
            <Link to="/auth" onClick={() => { setMobileMenuOpen(false); track("clic_crear_boda", { location: "navbar_mobile" }); }} className="block text-center text-sm font-medium px-5 py-2.5 rounded-lg bg-primary text-primary-foreground">Crear mi boda</Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-stone-800 pt-8">
        <div className="absolute inset-0">
          <img src="/decorar-banquete-boda_2c8fd058_1280x853.jpg" alt="Masía rústica para bodas en España" width={1280} height={853} className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-foreground/45 to-foreground/75" />
        </div>
        <div className="relative z-10 text-center px-5 sm:px-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-red-500/90 backdrop-blur-sm border border-red-400/50 mb-4">
            <span className="text-white text-[11px] sm:text-xs tracking-wider font-medium">🔥 OFERTA 24H · 50% descuento · Básico 15€ · Completo 30€</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-6 sm:mb-8">
            <Sparkles className="w-3.5 h-3.5 text-primary-foreground/80" />
            <span className="text-primary-foreground/80 text-[11px] sm:text-xs tracking-wider uppercase font-light">
              <span className="sm:hidden">IA · Desde 15€ pago único</span>
              <span className="hidden sm:inline">✦ Primera plataforma de bodas con IA en España · Pago único desde 15€</span>
            </span>
          </div>
          <h1 className="font-heading text-[2.75rem] sm:text-6xl md:text-7xl lg:text-8xl text-primary-foreground mb-4 sm:mb-6 leading-[0.95] text-balance">
            La web de boda<br />que cuenta vuestra historia
          </h1>
          <p className="text-primary-foreground/85 text-base sm:text-lg md:text-xl font-light mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed">
            La única plataforma en España con IA que escribe vuestra historia de amor. Más RSVP, playlist, plan de mesas y fotos en vivo. Lista en 5 minutos. <strong className="font-medium text-primary-foreground">Desde 15€, pago único para siempre.</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/auth" onClick={() => track("clic_crear_boda", { location: "hero" })}
              className="group px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-primary-foreground text-foreground font-medium text-base sm:text-lg hover:shadow-2xl hover:shadow-primary-foreground/25 hover:-translate-y-0.5 transition-all duration-300">
              Crear mi web de boda gratis
              <ArrowRight className="w-4 h-4 inline ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#demos" onClick={() => track("clic_ver_demos", { location: "hero" })}
              className="group px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl border-2 border-primary-foreground/30 text-primary-foreground font-light text-base sm:text-lg hover:bg-primary-foreground/10 hover:border-primary-foreground/50 transition-all duration-300">
              <Play className="w-4 h-4 inline mr-2" /> Ver demos en vivo
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 sm:mt-10">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
              <div className="flex -space-x-1.5">
                {["🤵", "👰", "💍"].map((e, i) => <span key={i} className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xs">{e}</span>)}
              </div>
              <span className="text-primary-foreground/80 text-xs font-light">+200 bodas en España</span>
              <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 text-primary-foreground/60 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Pago seguro con Paddle</span>
            <span className="flex items-center gap-1.5"><RefreshCcw className="w-3.5 h-3.5" /> 30 días de garantía</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Lista en 5 minutos</span>
          </div>
        </div>
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-1.5">
            <div className="w-1 h-2.5 rounded-full bg-primary-foreground/60 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Pain */}
      <section className="py-12 sm:py-16 bg-card">
        <div className="container max-w-4xl px-5 sm:px-8">
          <RevealSection>
            <p className="text-center font-heading text-xl sm:text-2xl text-foreground mb-7 sm:mb-8">¿Te suena esto?</p>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="bg-destructive/5 border border-destructive/15 rounded-xl p-5 sm:p-6 space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-destructive/60 mb-4">Sin web de boda</p>
                {['"¿Dónde era la boda? ¿A qué hora?"', "Grupo de WhatsApp con 80 personas saturado", "Excel de confirmaciones siempre desactualizado", '"¿Puedo llevar a mi pareja?" × 40 invitados', "Llamadas para saber quién viene y quién no"].map((pain) => (
                  <div key={pain} className="flex items-start gap-2.5">
                    <span className="text-destructive/50 flex-shrink-0 mt-0.5 font-bold text-sm">✕</span>
                    <p className="text-sm text-foreground/60 italic">{pain}</p>
                  </div>
                ))}
              </div>
              <div className="bg-primary/5 border border-primary/15 rounded-xl p-5 sm:p-6 space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary mb-4">Con BodasFácil</p>
                {["Todo en un enlace: lugar, hora y agenda", "RSVP online — sin mensajes, sin llamadas", "Confirmaciones en tiempo real en tu panel", "Playlist colaborativa que se llena sola", "Muro de fotos en vivo el día de la boda"].map((fix) => (
                  <div key={fix} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground/85">{fix}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center mt-7">
              <Link to="/auth" onClick={() => track("clic_crear_boda", { location: "pain_section" })}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
                Crear mi web gratis — sin tarjeta <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-xs text-muted-foreground mt-2">
                🔥 Hoy solo 15€ pago único · 30 días de garantía ·{" "}
                <Link to="/blog/invitaciones-digitales-vs-papel" className="underline underline-offset-2 hover:text-foreground transition-colors">¿Por qué digital?</Link>
              </p>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* IA */}
      <section className="py-16 sm:py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-primary/6 blur-3xl animate-float" />
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-primary/5 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        </div>
        <div className="container max-w-3xl px-5 sm:px-8 relative z-10">
          <RevealSection>
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium mb-5 shadow-md">
                <Sparkles className="w-3.5 h-3.5" /> Solo en BodasFácil · Exclusivo en España
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-4 text-balance">IA que escribe vuestra<br />historia de amor</h2>
              <p className="text-muted-foreground font-light text-base sm:text-lg max-w-lg mx-auto">Responde 3 preguntas. Nuestra IA genera en 10 segundos una historia romántica y personalizada.</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Vuestra pareja *</label>
                  <div className="flex items-center gap-2">
                    <input type="text" placeholder="Ana" value={aiName1} onChange={e => setAiName1(e.target.value)} className="flex-1 min-w-0 px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    <span className="text-muted-foreground text-sm shrink-0">&</span>
                    <input type="text" placeholder="Roberto" value={aiName2} onChange={e => setAiName2(e.target.value)} className="flex-1 min-w-0 px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">¿Cómo os conocisteis? *</label>
                  <input type="text" placeholder="en la universidad, en Tinder..." value={aiHowMet} onChange={e => setAiHowMet(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">¿Cómo fue la pedida? <span className="normal-case text-muted-foreground/50 font-normal">(opcional)</span></label>
                <input type="text" placeholder="en la playa de Valencia al atardecer..." value={aiProposal} onChange={e => setAiProposal(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <button onClick={generateStory} disabled={!aiName1.trim() || !aiName2.trim() || !aiHowMet.trim() || aiLoading}
                className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all disabled:opacity-40 flex items-center justify-center gap-2.5 text-base shadow-md hover:shadow-lg hover:-translate-y-0.5">
                {aiLoading ? (<><div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Escribiendo vuestra historia...</>) : (<><Sparkles className="w-4 h-4" /> Generar nuestra historia con IA →</>)}
              </button>
              {aiError && <p className="text-destructive text-sm text-center mt-3 bg-destructive/10 rounded-lg px-4 py-2">{aiError}</p>}
              {aiStory && (
                <div className="mt-6 animate-fade-in">
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 sm:p-6 mb-5">
                    <div className="flex items-center gap-2 mb-4"><Heart className="w-4 h-4 text-primary" /><p className="font-heading text-base text-foreground">La historia de {aiName1} & {aiName2}</p></div>
                    <div className="space-y-4">{aiStory.split("\n\n").filter(Boolean).map((para, i) => <p key={i} className="text-sm text-foreground/80 font-light leading-relaxed">{para}</p>)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-4 text-center">¿Os gusta? Guardadla en vuestra web — es gratis empezar 💍</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button onClick={generateShareCard} className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border-2 border-border text-foreground font-medium hover:border-primary hover:text-primary transition-all duration-300 text-sm">📸 Descargar para Instagram Stories</button>
                      <Link to="/auth" onClick={() => { track("clic_guardar_historia_ia"); localStorage.setItem("bf_pending_ai", JSON.stringify({ name1: aiName1, name2: aiName2, story: aiStory })); }} className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg text-sm">Guardar en mi web — gratis <ArrowRight className="w-4 h-4" /></Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-24 bg-secondary">
        <div className="container max-w-5xl px-5 sm:px-8">
          <RevealSection>
            <div className="text-center mb-10 sm:mb-16">
              <span className="inline-block text-xs uppercase tracking-[0.3em] text-primary mb-3 sm:mb-4 font-medium">Funcionalidades</span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 sm:mb-4 text-balance">Todo lo que necesitas para<br className="hidden sm:block" /> el día perfecto</h2>
              <p className="text-muted-foreground font-light text-base sm:text-lg max-w-lg mx-auto">18 temas y todas las funcionalidades para que tu boda sea inolvidable</p>
            </div>
          </RevealSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map((f, i) => (
              <RevealSection key={f.title} delay={i % 3 * 80}>
                <div className={`bg-card border rounded-xl p-5 sm:p-6 group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full relative cursor-default ${f.badge ? "border-primary/40 shadow-md hover:border-primary/60 hover:shadow-primary/10" : "border-border hover:border-primary/20 hover:shadow-primary/5"}`}>
                  {f.badge && <span className="absolute -top-2.5 left-4 text-[10px] font-medium bg-primary text-primary-foreground px-2.5 py-0.5 rounded-full shadow-sm">{f.badge}</span>}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${f.badge ? "bg-primary/10 group-hover:bg-primary/15" : "bg-secondary group-hover:bg-primary/10"}`}>
                    <f.icon className={`w-[18px] h-[18px] transition-colors duration-300 ${f.badge ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
                  </div>
                  <h3 className="font-heading text-lg mb-1.5">{f.title}</h3>
                  <p className="text-muted-foreground font-light text-sm leading-relaxed">{f.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Demos */}
      <section id="demos" className="py-16 sm:py-24 bg-background">
        <div className="container max-w-4xl px-5 sm:px-8">
          <RevealSection>
            <div className="text-center mb-10 sm:mb-16">
              <span className="inline-block text-xs uppercase tracking-[0.3em] text-primary mb-3 sm:mb-4 font-medium">Inspírate</span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 sm:mb-4">Demos en vivo</h2>
              <p className="text-muted-foreground font-light text-base sm:text-lg">Explora cada estilo con datos reales — toca, navega, siente</p>
            </div>
          </RevealSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {demos.map((d, i) => (
              <RevealSection key={d.slug} delay={i % 2 * 120}>
                <Link to={`/w/${d.slug}`} onClick={() => track("clic_demo", { demo: d.slug })}
                  className={`group bg-gradient-to-br ${d.gradient} bg-card border border-border rounded-xl p-5 sm:p-6 hover:shadow-2xl hover:border-primary/25 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.01] block`}>
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: d.color }}>
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg sm:text-xl text-foreground">{d.couple}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Tema {d.theme}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-primary text-sm font-medium group-hover:gap-3 gap-1.5 transition-all duration-300">Ver demo en vivo <ArrowRight className="w-4 h-4" /></div>
                </Link>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-24 bg-secondary">
        <div className="container max-w-3xl px-5 sm:px-8">
          <RevealSection>
            <div className="text-center mb-10 sm:mb-16">
              <span className="inline-block text-xs uppercase tracking-[0.3em] text-primary mb-3 sm:mb-4 font-medium">Cómo funciona</span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 sm:mb-4">Así de fácil</h2>
              <p className="text-muted-foreground font-light text-base sm:text-lg">En 3 pasos tienes tu web de boda lista para compartir</p>
            </div>
          </RevealSection>
          <div className="space-y-4 sm:space-y-6">
            {[
              { step: "1", title: "Regístrate gratis en 30 segundos", desc: "Sin tarjeta de crédito. Crea tu cuenta, explora las demos y empieza a personalizar." },
              { step: "2", title: "Personaliza vuestra web de boda", desc: "Elige uno de los 18 temas, añade vuestros datos, sube fotos y configura el RSVP, la agenda y el menú." },
              { step: "3", title: "Publica y comparte con tus invitados", desc: "Desde 15€ de pago único hoy. Genera un QR para las invitaciones o envía el enlace por WhatsApp." },
            ].map((s, i) => (
              <RevealSection key={s.step} delay={i * 120}>
                <div className="flex gap-4 sm:gap-5 items-start bg-card border border-border rounded-xl p-5 sm:p-6 hover:shadow-md transition-all duration-300 group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-heading text-lg sm:text-xl shadow-md group-hover:scale-105 transition-transform duration-300">{s.step}</div>
                  <div>
                    <h3 className="font-heading text-base sm:text-lg text-foreground mb-0.5 sm:mb-1">{s.title}</h3>
                    <p className="text-muted-foreground font-light text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container max-w-5xl px-5 sm:px-8">
          <RevealSection>
            <div className="text-center mb-10 sm:mb-16">
              <span className="inline-block text-xs uppercase tracking-[0.3em] text-primary mb-3 sm:mb-4 font-medium">Opiniones</span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 sm:mb-4">Lo que dicen las parejas</h2>
            </div>
          </RevealSection>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <RevealSection key={t.name} delay={i * 100}>
                <div className="bg-card border border-border rounded-xl p-6 h-full flex flex-col">
                  <div className="flex gap-0.5 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                  <p className="text-foreground/80 font-light text-sm leading-relaxed mb-5 flex-1">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0"><span className="text-primary font-heading text-xs font-semibold">{t.initials}</span></div>
                    <div><p className="font-heading text-sm text-foreground">{t.name}</p><p className="text-xs text-muted-foreground">{t.location}</p></div>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" ref={pricingRef} className="py-16 sm:py-24 bg-secondary">
        <div className="container max-w-5xl px-5 sm:px-8">
          <RevealSection>
            <div className="text-center mb-10 sm:mb-16">
              <span className="inline-block text-xs uppercase tracking-[0.3em] text-primary mb-3 sm:mb-4 font-medium">Precios</span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 sm:mb-4">Pago único. Sin suscripciones.</h2>
              <p className="text-muted-foreground font-light text-base sm:text-lg">Pagas una vez y tu web de boda es tuya para siempre</p>
            </div>
          </RevealSection>
          <RevealSection>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8 sm:mb-10">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-sm text-red-600 font-medium">
                <span>🔥</span><span>Oferta 24h — 50% descuento · precio sube mañana</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" /><span>30 días de garantía de devolución</span>
              </div>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 max-w-2xl mx-auto">
            {/* Plan Básico */}
            <RevealSection delay={0}>
              <div className="bg-card border border-border rounded-xl p-6 sm:p-7 flex flex-col h-full hover:shadow-lg transition-all duration-300">
                <h3 className="font-heading text-2xl text-foreground mb-1">Básico</h3>
                <div className="mb-1">
                  <span className="font-heading text-3xl sm:text-4xl text-foreground">15€</span>
                  <span className="text-muted-foreground text-sm ml-1">pago único</span>
                </div>
                <p className="text-red-500 text-xs font-medium mb-3 line-through">Precio normal: 30€</p>
                <p className="text-muted-foreground text-sm font-light mb-5 sm:mb-6">Para parejas que quieren algo sencillo y bonito.</p>
                <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 flex-1">
                  {["Página web personalizada", "1 tema visual a elegir", "RSVP online + ver confirmaciones", "Playlist colaborativa de los invitados", "Muro de fotos en vivo", "Código QR para invitaciones", "Información de ceremonia y recepción", "Cuenta atrás del gran día"].map((item) => (
                    <li key={item} className="flex items-start gap-2 sm:gap-2.5 text-sm text-foreground">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />{item}
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleBuy("basico_one_time")} disabled={loading}
                  className="block w-full text-center px-6 py-3.5 rounded-xl border-2 border-primary text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-50">
                  {loading ? "Cargando..." : "Publicar con Plan Básico · 15€ →"}
                </button>
              </div>
            </RevealSection>

            {/* Plan Completo */}
            <RevealSection delay={100}>
              <div className="bg-card border-2 border-primary rounded-xl p-6 sm:p-7 flex flex-col relative shadow-lg hover:shadow-xl transition-all duration-300 h-full animate-pulse-glow">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-4 py-1 rounded-full shadow-md">⭐ Más popular</div>
                <h3 className="font-heading text-2xl text-foreground mb-1">Completo</h3>
                <div className="mb-1">
                  <span className="font-heading text-3xl sm:text-4xl text-foreground">30€</span>
                  <span className="text-muted-foreground text-sm ml-1">pago único</span>
                </div>
                <p className="text-red-500 text-xs font-medium mb-3 line-through">Precio normal: 60€</p>
                <p className="text-muted-foreground text-sm font-light mb-5 sm:mb-6">Todo incluido para una experiencia inolvidable.</p>
                <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 flex-1">
                  {["Todo lo del plan Básico", "18 temas visuales disponibles", "Plan de mesas inteligente", "Agenda del día completa", "FAQ + Mapa interactivo", "Lista de regalos / cuenta bancaria", "Vuestra historia de amor", "Compartir por WhatsApp", "📊 Gestor de presupuesto (14 categorías)", "🎁 Control de regalos y agradecimientos", "✅ Checklist de boda profesional (18 tareas)", "Soporte 24 horas"].map((item) => (
                    <li key={item} className="flex items-start gap-2 sm:gap-2.5 text-sm text-foreground">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />{item}
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleBuy("completo_one_time")} disabled={loading}
                  className="w-full text-center px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50">
                  {loading ? "Cargando..." : "Comprar Plan Completo · 30€ →"}
                </button>
                <p className="text-center text-xs text-muted-foreground mt-2">
                  o{" "}
                  <Link to="/auth" onClick={() => track("clic_crear_boda", { location: "pricing_completo_fallback" })} className="underline underline-offset-4 hover:text-foreground transition-colors">crea tu boda gratis primero</Link>
                </p>
              </div>
            </RevealSection>
          </div>

          <RevealSection delay={200}>
            <div className="mt-5 bg-card border border-border rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-3 sm:gap-5 max-w-2xl mx-auto">
              <div className="flex-1 text-center sm:text-left">
                <span className="text-xs uppercase tracking-widest font-medium text-muted-foreground">Para profesionales</span>
                <h3 className="font-heading text-lg text-foreground mt-0.5">Plan Organizador — Múltiples bodas</h3>
                <p className="text-muted-foreground text-xs font-light mt-0.5">Wedding planners y fotógrafos. Dashboard multi-boda, precios por volumen y soporte prioritario.</p>
              </div>
              <button onClick={() => { setContactSubject("Plan Wedding Planner"); setContactOpen(true); }}
                className="shrink-0 px-5 py-2.5 rounded-xl border-2 border-border text-foreground text-sm font-medium hover:border-primary hover:text-primary transition-all duration-300">
                Pedir info →
              </button>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container max-w-3xl px-5 sm:px-8">
          <RevealSection>
            <div className="text-center mb-10 sm:mb-14">
              <span className="inline-block text-xs uppercase tracking-[0.3em] text-primary mb-3 sm:mb-4 font-medium">Preguntas frecuentes</span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 sm:mb-4">¿Tienes dudas?</h2>
            </div>
          </RevealSection>
          <div className="space-y-3 sm:space-y-4">
            {([
              { q: "¿Es un pago único o una suscripción?", a: "Pago único. Pagas una sola vez y tu web de boda es tuya para siempre. Sin renovaciones ni cargos ocultos. Nunca." },
              { q: "¿Puedo crear y editar mi boda antes de pagar?", a: "Sí, totalmente gratis. Regístrate, personaliza tu boda y mírala en preview. Solo pagas cuando quieras publicarla." },
              { q: "¿Mis invitados necesitan registrarse o instalar algo?", a: "No. Tus invitados acceden directamente con el enlace o código QR. Sin cuenta, sin app, sin descarga." },
              { q: "¿Cuánto tarda en estar lista mi web de boda?", a: "Puedes tener tu página lista en 5 minutos." },
              { q: "¿Y si no me convence?", a: "Tienes 30 días de garantía de devolución sin preguntas. Envíanos un email y te devolvemos el 100% del importe." },
              { q: "¿Cuánto tiempo dura la oferta del 50%?", a: "Solo hoy. Mañana el precio vuelve a 30€ (Básico) y 60€ (Completo). No habrá otra oferta igual." },
            ] as { q: string; a: string }[]).map((faq, i) => (
              <RevealSection key={i} delay={i * 60}>
                <details className="group bg-card border border-border rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between p-5 sm:p-6 cursor-pointer text-sm sm:text-base text-foreground font-medium hover:bg-secondary/50 transition-colors list-none">
                    {faq.q}
                    <span className="ml-4 flex-shrink-0 text-muted-foreground group-open:rotate-45 transition-transform duration-200 text-xl leading-none">+</span>
                  </summary>
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-muted-foreground font-light leading-relaxed">{faq.a}</div>
                </details>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28 bg-secondary text-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-primary/8 blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-primary/6 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>
        <RevealSection>
          <div className="container max-w-2xl relative z-10 px-5 sm:px-8">
            <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-primary mx-auto mb-5 sm:mb-6 opacity-60 animate-float" />
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 sm:mb-4 text-balance">Vuestra historia merece<br />una web perfecta</h2>
            <p className="text-muted-foreground font-light text-base sm:text-lg mb-2">Cread vuestra web de boda en minutos. Publicad cuando estéis listos.</p>
            <p className="text-red-500 font-semibold text-sm mb-1">🔥 Solo hoy: Básico 15€ · Completo 30€ — 50% de descuento</p>
            <p className="text-primary font-medium text-sm mb-2">Pago único para siempre. Sin suscripciones.</p>
            <p className="text-muted-foreground/60 text-xs mb-8 sm:mb-10">30 días de garantía · Pago seguro con Paddle · +200 bodas en España</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/auth" onClick={() => track("clic_crear_boda", { location: "final_cta" })}
                className="group inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl bg-primary text-primary-foreground font-medium text-base sm:text-lg hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300">
                Crear mi web de boda gratis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#pricing" className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl border-2 border-border text-foreground font-light text-base sm:text-lg hover:bg-card transition-all duration-300">Ver precios</a>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* Footer */}
      <footer className="pt-8 sm:pt-12 pb-24 md:py-12 border-t border-border bg-background">
        <div className="container max-w-4xl px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2"><Heart className="w-4 h-4 text-primary" /><span className="font-heading text-foreground">BodasFácil</span></div>
              <p className="text-muted-foreground text-xs font-light max-w-xs">La web de boda más completa de España. RSVP, playlist, plan de mesas y más. Desde 15€.</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
                <Link to="/privacidad" className="hover:text-foreground transition-colors">Privacidad</Link>
                <Link to="/terminos" className="hover:text-foreground transition-colors">Términos</Link>
                <Link to="/reembolso" className="hover:text-foreground transition-colors">Reembolso</Link>
                <Link to="/cookies" className="hover:text-foreground transition-colors">Cookies</Link>
                <button onClick={() => { setContactSubject(""); setContactOpen(true); }} className="hover:text-foreground transition-colors">Contacto</button>
              </div>
              <div className="flex gap-3 text-xs text-muted-foreground">
                <a href="https://instagram.com/bodasfacil" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1"><span>📸</span> Instagram</a>
                <a href="https://tiktok.com/@bodasfacil" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1"><span>🎵</span> TikTok</a>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-muted-foreground text-xs font-light">© {new Date().getFullYear()} BodasFácil. Hecho con <Heart className="w-3 h-3 inline text-primary" /> en España.</p>
          </div>
        </div>
      </footer>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} subject={contactSubject} />

      {/* Exit intent */}
      {showExitIntent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 backdrop-blur-sm px-4" onClick={() => setShowExitIntent(false)}>
          <div className="bg-background rounded-2xl p-8 max-w-xs w-full shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
            <Heart className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-heading text-2xl text-foreground mb-2">¿Te vas sin tu boda?</h2>
            <p className="text-red-500 font-semibold text-sm mb-2">🔥 Oferta solo hoy: Básico 15€ · Completo 30€</p>
            <p className="text-muted-foreground text-sm font-light mb-6 leading-relaxed">Es gratis empezar. Publica cuando estéis listos desde 15€.</p>
            <Link to="/auth" onClick={() => { track("clic_crear_boda", { location: "exit_intent" }); setShowExitIntent(false); }}
              className="block w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-medium mb-3 hover:opacity-90 transition-opacity">
              Crear mi boda gratis →
            </Link>
            <button onClick={() => setShowExitIntent(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">No, gracias</button>
          </div>
        </div>
      )}

      {/* Social proof */}
      {socialProof && (
        <div className="hidden md:flex fixed bottom-6 left-5 z-50 bg-card border border-border rounded-xl px-4 py-3 shadow-lg items-center gap-3 max-w-[250px] animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><Heart className="w-4 h-4 text-primary" /></div>
          <div>
            <p className="text-xs font-medium text-foreground">{socialProof.name}</p>
            <p className="text-[10px] text-muted-foreground">de {socialProof.city} acaba de crear su boda</p>
          </div>
        </div>
      )}

      {/* Sticky CTA móvil */}
      {showStickyCTA && (
        <div className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t border-border px-4 pt-3" style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}>
          <Link to="/auth" onClick={() => track("clic_crear_boda", { location: "sticky_mobile" })}
            className="block w-full text-center py-3.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm">
            🔥 Oferta hoy: Básico 15€ · Completo 30€ →
          </Link>
        </div>
      )}
    </div>
  );
};

export default Index;
