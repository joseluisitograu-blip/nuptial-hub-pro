import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Heart, Sparkles, Users, Music, Camera, ArrowRight, CheckCircle, Play, Menu, X, Wallet, ListChecks, Gift, Shield, Zap, RefreshCcw, Star } from "lucide-react";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import ContactModal from "@/components/ContactModal";
import { track, trackBeginCheckout } from "@/lib/analytics";

const features = [
  { icon: Users, title: "RSVP sin WhatsApp", desc: "Tus invitados confirman asistencia, acompañantes y restricciones en un clic. Tú lo ves todo en tiempo real.", badge: null },
  { icon: Music, title: "Playlist colaborativa", desc: "Cada invitado sugiere y vota canciones para la fiesta. La pista no se vaciará en toda la noche.", badge: null },
  { icon: Camera, title: "Muro de fotos en vivo", desc: "Todos comparten sus mejores fotos del gran día. Un recuerdo colectivo que se construye solo.", badge: null },
  { icon: Users, title: "Plan de mesas inteligente", desc: "Arrastra y suelta a tus invitados entre mesas. Visible solo un día antes — crea expectación.", badge: null },
  { icon: Sparkles, title: "Historia de amor con IA", desc: "La primera plataforma en España que usa IA para escribir vuestra historia romántica personalizada en 10 segundos.", badge: "Solo en BodasFácil ✦" },
  { icon: Heart, title: "12 temas visuales únicos", desc: "Elegante, Romántico, Rústico, Moderno, Otoñal, Valenciano y más. Personaliza cada detalle del diseño.", badge: null },
];

const demos = [
  { slug: "demo-elegant", theme: "Elegante", couple: "Sofía & Daniel", color: "#7a5c3a", dot: "bg-amber-700" },
  { slug: "demo-romantic", theme: "Romántico", couple: "Isabella & Marco", color: "#b85c7a", dot: "bg-pink-500" },
  { slug: "demo-rustic", theme: "Rústico", couple: "Elena & Pablo", color: "#6b3c1e", dot: "bg-orange-800" },
  { slug: "demo-modern", theme: "Moderno", couple: "Martina & Álex", color: "#2d3748", dot: "bg-slate-700" },
  { slug: "demo-autumn", theme: "Otoñal", couple: "Carmen & Javier", color: "#8b4513", dot: "bg-orange-700" },
  { slug: "demo-valencia", theme: "Valenciano", couple: "Lucia & Marcos", color: "#c47d20", dot: "bg-amber-600" },
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
      { threshold: 0.06, rootMargin: "0px 0px -30px 0px" }
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
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const wrapTextCanvas = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 10
): void => {
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
    } else {
      line = testLine;
    }
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
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const bg = ctx.createLinearGradient(0, 0, 0, size);
    bg.addColorStop(0, "#faf9f7");
    bg.addColorStop(1, "#e8ddd0");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = "#c4a882";
    ctx.lineWidth = 4;
    ctx.strokeRect(52, 52, size - 104, size - 104);
    ctx.strokeStyle = "#e0cdb0";
    ctx.lineWidth = 1;
    ctx.strokeRect(64, 64, size - 128, size - 128);
    ctx.font = "88px serif";
    ctx.fillStyle = "#8a6d3b";
    ctx.textAlign = "center";
    ctx.fillText("♡", size / 2, 210);
    const namesText = `${aiName1} & ${aiName2}`;
    ctx.fillStyle = "#3d2c16";
    ctx.font = "bold 74px Georgia, serif";
    if (ctx.measureText(namesText).width > size - 180) ctx.font = "bold 56px Georgia, serif";
    ctx.fillText(namesText, size / 2, 330);
    ctx.fillStyle = "#c4a882";
    ctx.fillRect(size / 2 - 90, 358, 180, 2);
    ctx.font = "34px Georgia, serif";
    ctx.fillStyle = "#5c4030";
    const firstPara = aiStory.split("\n\n")[0] || aiStory;
    wrapTextCanvas(ctx, firstPara, size / 2, 420, size - 200, 52, 9);
    ctx.font = "italic 26px Georgia, serif";
    ctx.fillStyle = "#9a8060";
    ctx.fillText("— bodasfacil.com", size / 2, size - 78);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `historia-${aiName1}-${aiName2}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      track("ia_compartir_instagram");
    }, "image/png");
  };

  const generateStory = async () => {
    if (!aiName1.trim() || !aiName2.trim() || !aiHowMet.trim()) return;
    setAiLoading(true);
    setAiError("");
    setAiStory("");
    track("ia_generar_historia");
    try {
      const res = await fetch("https://bcrymaflkapbfvytcjaq.supabase.co/functions/v1/generate-wedding-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partner1: aiName1.trim(), partner2: aiName2.trim(), howWeMet: aiHowMet.trim(), proposalStory: aiProposal.trim() }),
      });
      const data = await res.json();
      if (data.story) { setAiStory(data.story); track("ia_historia_generada"); }
      else setAiError("Ups, algo salió mal. Inténtalo de nuevo.");
    } catch {
      setAiError("Error de conexión. Inténtalo de nuevo.");
    }
    setAiLoading(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
      setShowStickyCTA(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const el = document.createElement("script");
    el.id = "schema-howto";
    el.type = "application/ld+json";
    el.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "Cómo crear una web de boda online en BodasFácil",
      "description": "Crea tu página web de boda personalizada en 3 pasos.",
      "totalTime": "PT5M",
      "estimatedCost": { "@type": "MonetaryAmount", "currency": "EUR", "value": "30" },
      "tool": [{ "@type": "WebApplication", "name": "BodasFácil", "url": "https://bodasfacil.com" }],
      "step": [
        { "@type": "HowToStep", "position": "1", "name": "Regístrate gratis", "url": "https://bodasfacil.com/auth" },
        { "@type": "HowToStep", "position": "2", "name": "Personaliza tu web de boda", "url": "https://bodasfacil.com/dashboard" },
        { "@type": "HowToStep", "position": "3", "name": "Publica y comparte", "url": "https://bodasfacil.com/#pricing" }
      ]
    });
    document.head.appendChild(el);
    return () => document.getElementById("schema-howto")?.remove();
  }, []);

  useEffect(() => {
    const milestones = new Set<number>();
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (!total) return;
      const pct = Math.round((window.scrollY / total) * 100);
      ([25, 50, 75, 90] as const).forEach((m) => {
        if (pct >= m && !milestones.has(m)) { milestones.add(m); track("scroll_depth", { depth: m, page: "home" }); }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const el = pricingRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { track("view_pricing", { page: "home" }); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let shown = false;
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !shown) { shown = true; setShowExitIntent(true); track("exit_intent_shown"); }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  useEffect(() => {
    const SOCIAL_PROOF = [
      { name: "Laura y Sergio", city: "Valencia" },
      { name: "Marta y Pau", city: "Barcelona" },
      { name: "Ana y Roberto", city: "Madrid" },
      { name: "Carmen y Javier", city: "Sevilla" },
      { name: "Sofía y Miguel", city: "Bilbao" },
      { name: "Elena y Pablo", city: "Zaragoza" },
    ];
    let idx = Math.floor(Math.random() * SOCIAL_PROOF.length);
    const show = () => {
      setSocialProof(SOCIAL_PROOF[idx % SOCIAL_PROOF.length]);
      idx++;
      setTimeout(() => setSocialProof(null), 4500);
    };
    const t = setTimeout(show, 5000);
    const interval = setInterval(show, 22000);
    return () => { clearTimeout(t); clearInterval(interval); };
  }, []);

  const handleBuy = (priceId: string) => {
    const planKey = priceId.includes("basico") ? "basico" : "completo" as "basico" | "completo";
    trackBeginCheckout(planKey);
    track("clic_comprar", { plan: planKey });
    openCheckout({ priceId, successUrl: `${window.location.origin}/dashboard?checkout=success` });
  };

  const navLinks = [
    { href: "#features", label: "Funcionalidades" },
    { href: "#demos", label: "Demos" },
    { href: "#pricing", label: "Precios" },
    { href: "/blog", label: "Blog" },
  ];

  const tickerItems = ["RSVP sin WhatsApp", "Historia con IA ✦", "Playlist colaborativa", "Plan de mesas", "Muro de fotos en vivo", "12 temas visuales", "Pago único desde 30€", "Lista en 5 minutos", "30 días de garantía"];

  return (
    <div className="min-h-screen bg-background">
      <style>{`
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes ticker-slow { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>

      {/* ── NAV ── */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 sm:h-16 px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2 group">
            <Heart className={`w-4 h-4 transition-all duration-300 group-hover:scale-110 ${scrolled ? "text-primary" : "text-white"}`} />
            <span className={`font-heading text-lg transition-colors duration-300 ${scrolled ? "text-foreground" : "text-white"}`}>BodasFácil</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className={`text-sm font-light transition-colors duration-300 ${scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}>
                {l.label}
              </a>
            ))}
            <Link
              to="/auth"
              onClick={() => track("clic_crear_boda", { location: "navbar" })}
              className={`text-sm font-medium px-5 py-2 rounded-lg transition-all duration-300 ${scrolled ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 border border-white/20"}`}>
              Crear mi boda
            </Link>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2" aria-label="Menú">
            {mobileMenuOpen
              ? <X className={`w-5 h-5 ${scrolled ? "text-foreground" : "text-white"}`} />
              : <Menu className={`w-5 h-5 ${scrolled ? "text-foreground" : "text-white"}`} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-background/97 backdrop-blur-md border-b border-border px-6 pb-4 space-y-3 animate-fade-in">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground py-1">
                {l.label}
              </a>
            ))}
            <Link to="/auth" onClick={() => { setMobileMenuOpen(false); track("clic_crear_boda", { location: "navbar_mobile" }); }}
              className="block text-center text-sm font-medium px-5 py-3 rounded-xl bg-primary text-primary-foreground">
              Crear mi boda
            </Link>
          </div>
        )}
      </nav>

      {/* ── HERO ── dark, editorial, two-column */}
      <section className="relative min-h-[100svh] bg-stone-950 flex flex-col overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[60%] h-[70%] bg-gradient-to-bl from-amber-900/20 via-stone-900 to-transparent" />
          <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-gradient-to-tr from-primary/10 to-transparent" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-between pt-20 sm:pt-24 pb-8 px-5 sm:px-8 max-w-6xl mx-auto w-full">
          {/* Main content */}
          <div className="flex-1 flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16 mt-4 sm:mt-8 lg:mt-12">

            {/* Left: headline */}
            <div className="flex-1 lg:max-w-[600px]">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/8 border border-white/12 mb-6 sm:mb-8">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-white/65 text-[11px] sm:text-xs tracking-widest uppercase font-light">Primera plataforma de bodas con IA · España</span>
              </div>

              <h1 className="font-heading text-[3.4rem] sm:text-[4.5rem] lg:text-[5.8rem] text-white leading-[0.88] mb-6 sm:mb-8 tracking-tight">
                La web<br />de boda<br />que os<br />merecéis
              </h1>

              <p className="text-white/55 text-base sm:text-lg font-light mb-8 sm:mb-10 max-w-md leading-relaxed">
                IA que escribe vuestra historia de amor. RSVP sin WhatsApp. Plan de mesas. Playlist colaborativa. Desde 30€, pago único.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link
                  to="/auth"
                  onClick={() => track("clic_crear_boda", { location: "hero" })}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white text-stone-900 font-semibold text-base hover:bg-white/95 hover:-translate-y-0.5 transition-all duration-300 shadow-2xl shadow-white/10"
                >
                  Crear mi boda gratis <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#demos"
                  onClick={() => track("clic_ver_demos", { location: "hero" })}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-white/20 text-white font-light text-base hover:bg-white/8 hover:border-white/30 transition-all duration-300"
                >
                  <Play className="w-4 h-4" /> Ver demos en vivo
                </a>
              </div>

              <div className="flex flex-wrap gap-5 text-white/30 text-xs">
                <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Pago seguro</span>
                <span className="flex items-center gap-1.5"><RefreshCcw className="w-3.5 h-3.5" /> 30 días garantía</span>
                <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Lista en 5 minutos</span>
              </div>
            </div>

            {/* Right: floating preview */}
            <div className="lg:w-[360px] w-full max-w-[360px] mx-auto lg:mx-0 space-y-3">
              {/* AI story preview card */}
              <div className="bg-white/7 backdrop-blur-sm border border-white/12 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-7 h-7 rounded-full bg-primary/30 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <span className="text-white/70 text-xs font-medium">Historia generada con IA</span>
                </div>
                <p className="text-white/80 font-heading text-sm mb-1">Laura &amp; Sergio</p>
                <p className="text-white/40 text-xs font-light leading-relaxed">
                  "Se conocieron en la universidad de Valencia, en una biblioteca donde él se atrevió a pedirle un apunte que nunca existió. Fue el pretexto más bonito del mundo..."
                </p>
                <div className="mt-3 pt-3 border-t border-white/8 flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <span className="text-white/30 text-[10px]">Generada en 8 segundos</span>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "+200", label: "bodas" },
                  { value: "4.9★", label: "valoración" },
                  { value: "30€", label: "pago único" },
                ].map((s) => (
                  <div key={s.label} className="bg-white/5 border border-white/8 rounded-xl py-3 px-2 text-center">
                    <p className="font-heading text-base sm:text-lg text-white leading-none mb-0.5">{s.value}</p>
                    <p className="text-white/35 text-[9px] sm:text-[10px]">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Trust badge */}
              <div className="bg-white/5 border border-white/8 rounded-xl px-4 py-3 flex items-center gap-3">
                <Heart className="w-4 h-4 text-primary shrink-0" />
                <p className="text-white/50 text-xs font-light">Sin tarjeta de crédito · Empieza gratis · Publica cuando estéis listos</p>
              </div>
            </div>
          </div>

          {/* Bottom divider */}
          <div className="border-t border-white/8 pt-5 mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {["🤵", "👰", "💍"].map((e, i) => (
                  <span key={i} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">{e}</span>
                ))}
              </div>
              <span className="text-white/40 text-xs">+200 parejas en España</span>
            </div>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="bg-primary py-3.5 overflow-hidden select-none">
        <div
          className="flex whitespace-nowrap"
          style={{ animation: "ticker 28s linear infinite" }}
        >
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="text-primary-foreground text-sm font-medium px-5 shrink-0">
              {item} <span className="opacity-40 mx-1">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── PAIN ── */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <RevealSection>
            <p className="text-center font-heading text-2xl sm:text-3xl text-foreground mb-2">¿Te suena esto?</p>
            <p className="text-center text-muted-foreground text-sm font-light mb-10">Organizar una boda sin web es un caos. Con BodasFácil, desaparece.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-destructive/4 border border-destructive/12 rounded-2xl p-6 sm:p-7 space-y-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-destructive/50 mb-5">Sin web de boda</p>
                {[
                  '"¿Dónde era la boda? ¿A qué hora?"',
                  "Grupo de WhatsApp con 80 personas saturado",
                  "Excel de confirmaciones siempre desactualizado",
                  '"¿Puedo llevar a mi pareja?" × 40 invitados',
                  "Llamadas eternas para saber quién viene",
                ].map((pain) => (
                  <div key={pain} className="flex items-start gap-3">
                    <span className="text-destructive/40 flex-shrink-0 mt-0.5 font-bold text-sm leading-5">✕</span>
                    <p className="text-sm text-foreground/55 italic leading-snug">{pain}</p>
                  </div>
                ))}
              </div>
              <div className="bg-primary/4 border border-primary/12 rounded-2xl p-6 sm:p-7 space-y-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary mb-5">Con BodasFácil</p>
                {[
                  "Todo en un enlace: lugar, hora y agenda",
                  "RSVP online — sin mensajes, sin llamadas",
                  "Confirmaciones en tiempo real en tu panel",
                  "Playlist colaborativa que se llena sola",
                  "Muro de fotos en vivo el día de la boda",
                ].map((fix) => (
                  <div key={fix} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground/85 leading-snug">{fix}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center mt-8">
              <Link
                to="/auth"
                onClick={() => track("clic_crear_boda", { location: "pain_section" })}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                Crear mi web gratis <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-xs text-muted-foreground mt-2">Desde 30€ pago único · Sin suscripciones · 30 días de garantía</p>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── AI GENERATOR ── split layout */}
      <section className="py-16 sm:py-24 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-primary blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
          <RevealSection>
            {/* Header */}
            <div className="text-center mb-10 sm:mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold mb-4 shadow-md">
                <Sparkles className="w-3.5 h-3.5" /> Solo en BodasFácil · Exclusivo en España
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 text-balance">
                IA que escribe vuestra<br className="hidden sm:block" /> historia de amor
              </h2>
              <p className="text-muted-foreground font-light text-sm sm:text-base max-w-md mx-auto">
                Responde 3 preguntas. Nuestra IA genera en 10 segundos una historia romántica y personalizada lista para vuestra web.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
              {/* Form */}
              <div className="p-6 sm:p-8">
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-widest">Vuestra pareja *</label>
                    <div className="flex items-center gap-2">
                      <input type="text" placeholder="Ana" value={aiName1} onChange={e => setAiName1(e.target.value)}
                        className="flex-1 min-w-0 px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      <span className="text-muted-foreground text-sm shrink-0">&amp;</span>
                      <input type="text" placeholder="Roberto" value={aiName2} onChange={e => setAiName2(e.target.value)}
                        className="flex-1 min-w-0 px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-widest">¿Cómo os conocisteis? *</label>
                    <input type="text" placeholder="en la universidad, en Tinder..." value={aiHowMet} onChange={e => setAiHowMet(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-widest">
                    ¿Cómo fue la pedida? <span className="normal-case text-muted-foreground/40 font-normal">(opcional)</span>
                  </label>
                  <input type="text" placeholder="en la playa de Valencia al atardecer con todos los amigos..." value={aiProposal} onChange={e => setAiProposal(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>

                <button
                  onClick={generateStory}
                  disabled={!aiName1.trim() || !aiName2.trim() || !aiHowMet.trim() || aiLoading}
                  className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all disabled:opacity-40 flex items-center justify-center gap-2.5 text-base shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  {aiLoading ? (
                    <><div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Escribiendo vuestra historia...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Generar nuestra historia con IA →</>
                  )}
                </button>

                {aiError && (
                  <p className="text-destructive text-sm text-center mt-3 bg-destructive/10 rounded-lg px-4 py-2">{aiError}</p>
                )}
              </div>

              {/* Story output */}
              {aiStory && (
                <div className="border-t border-border bg-primary/3 p-6 sm:p-8 animate-fade-in">
                  <div className="flex items-center gap-2 mb-4">
                    <Heart className="w-4 h-4 text-primary" />
                    <p className="font-heading text-base text-foreground">La historia de {aiName1} &amp; {aiName2}</p>
                  </div>
                  <div className="space-y-4 mb-6">
                    {aiStory.split("\n\n").filter(Boolean).map((para, i) => (
                      <p key={i} className="text-sm text-foreground/80 font-light leading-relaxed">{para}</p>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 text-center">¿Os gusta? Guardadla en vuestra web — es gratis empezar 💍</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={generateShareCard}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border-2 border-border text-foreground font-medium hover:border-primary hover:text-primary transition-all duration-300 text-sm"
                    >
                      📸 Descargar para Instagram Stories
                    </button>
                    <Link
                      to="/auth"
                      onClick={() => {
                        track("clic_guardar_historia_ia");
                        localStorage.setItem("bf_pending_ai", JSON.stringify({ name1: aiName1, name2: aiName2, story: aiStory }));
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all hover:-translate-y-0.5 shadow-md text-sm"
                    >
                      Guardar en mi web — gratis <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-2">💡 La imagen incluye vuestra historia — perfecta para Instagram Stories</p>
                </div>
              )}
            </div>

            <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-5 flex-wrap">
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> No guardamos datos hasta que te registres</span>
              <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Totalmente gratis probarlo</span>
            </p>
          </RevealSection>
        </div>
      </section>

      {/* ── BENTO FEATURES ── */}
      <section id="features" className="py-16 sm:py-24 bg-background">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <RevealSection>
            <div className="text-center mb-10 sm:mb-14">
              <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.35em] text-primary mb-3">Funcionalidades</span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 text-balance">
                Todo lo que necesitáis<br className="hidden sm:block" /> para el día perfecto
              </h2>
              <p className="text-muted-foreground font-light text-sm sm:text-base max-w-md mx-auto">
                Una plataforma. Todo incluido. Sin sorpresas.
              </p>
            </div>
          </RevealSection>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* AI card — hero, 2 cols */}
            <RevealSection className="md:col-span-2" delay={0}>
              <div className="bg-primary rounded-2xl p-7 sm:p-8 h-full text-primary-foreground relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="relative z-10">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/15 px-3 py-1 rounded-full mb-4">
                    <Sparkles className="w-3 h-3" /> Solo en BodasFácil · Exclusivo en España
                  </span>
                  <h3 className="font-heading text-2xl sm:text-3xl mb-2 leading-tight">Historia de amor con IA</h3>
                  <p className="text-primary-foreground/70 font-light text-sm leading-relaxed max-w-sm">
                    La primera plataforma en España que usa inteligencia artificial para escribir vuestra historia romántica y personalizada en 10 segundos. Lista para que la lean vuestros invitados.
                  </p>
                  <div className="mt-5 bg-white/10 rounded-xl p-4 text-sm font-light text-primary-foreground/80 italic leading-relaxed">
                    "Se conocieron en una biblioteca donde él inventó un apunte que nunca existió..."
                  </div>
                </div>
              </div>
            </RevealSection>

            {/* RSVP */}
            <RevealSection delay={80}>
              <div className="bg-card border border-border rounded-2xl p-6 h-full group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors duration-300">
                  <CheckCircle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                </div>
                <h3 className="font-heading text-lg mb-1.5">RSVP sin WhatsApp</h3>
                <p className="text-muted-foreground font-light text-sm leading-relaxed">Confirmaciones en tiempo real. Sin grupos, sin llamadas.</p>
              </div>
            </RevealSection>

            {/* Playlist */}
            <RevealSection delay={100}>
              <div className="bg-card border border-border rounded-2xl p-6 h-full group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors duration-300">
                  <Music className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                </div>
                <h3 className="font-heading text-lg mb-1.5">Playlist colaborativa</h3>
                <p className="text-muted-foreground font-light text-sm leading-relaxed">Cada invitado vota las canciones. La pista no se para.</p>
              </div>
            </RevealSection>

            {/* Plan mesas */}
            <RevealSection delay={140}>
              <div className="bg-card border border-border rounded-2xl p-6 h-full group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors duration-300">
                  <Users className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                </div>
                <h3 className="font-heading text-lg mb-1.5">Plan de mesas</h3>
                <p className="text-muted-foreground font-light text-sm leading-relaxed">Arrastra y suelta invitados. Visible un día antes — crea expectación.</p>
              </div>
            </RevealSection>

            {/* Fotos */}
            <RevealSection delay={180}>
              <div className="bg-card border border-border rounded-2xl p-6 h-full group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors duration-300">
                  <Camera className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                </div>
                <h3 className="font-heading text-lg mb-1.5">Muro de fotos en vivo</h3>
                <p className="text-muted-foreground font-light text-sm leading-relaxed">Todos comparten sus fotos del gran día en tiempo real.</p>
              </div>
            </RevealSection>

            {/* Temas — full width */}
            <RevealSection className="md:col-span-3" delay={220}>
              <div className="bg-secondary border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="flex-1">
                  <h3 className="font-heading text-lg mb-1.5">12 temas visuales únicos</h3>
                  <p className="text-muted-foreground font-light text-sm leading-relaxed max-w-md">Elegante, Romántico, Rústico, Moderno, Otoñal, Valenciano y más. Personaliza colores, fuentes y cada detalle del diseño sin saber programar.</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {demos.map((d) => (
                    <Link key={d.slug} to={`/w/${d.slug}`} onClick={() => track("clic_demo", { demo: d.slug })}>
                      <div
                        className="w-8 h-8 rounded-full border-2 border-background shadow-sm hover:scale-110 transition-transform duration-200"
                        style={{ backgroundColor: d.color }}
                        title={d.theme}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ── DEMOS ── */}
      <section id="demos" className="py-16 sm:py-24 bg-secondary">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <RevealSection>
            <div className="text-center mb-10 sm:mb-14">
              <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.35em] text-primary mb-3">Inspírate</span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-3">Demos en vivo</h2>
              <p className="text-muted-foreground font-light text-sm sm:text-base">Explora cada estilo con datos reales — toca, navega, siente</p>
            </div>
          </RevealSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {demos.map((d, i) => (
              <RevealSection key={d.slug} delay={i % 3 * 80}>
                <Link
                  to={`/w/${d.slug}`}
                  onClick={() => track("clic_demo", { demo: d.slug })}
                  className="group flex items-center gap-4 bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 block"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0"
                    style={{ backgroundColor: d.color }}
                  >
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-base text-foreground truncate">{d.couple}</p>
                    <p className="text-xs text-muted-foreground">Tema {d.theme}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 shrink-0" />
                </Link>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── horizontal on desktop */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <RevealSection>
            <div className="text-center mb-10 sm:mb-14">
              <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.35em] text-primary mb-3">Cómo funciona</span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-3">Así de fácil</h2>
              <p className="text-muted-foreground font-light text-sm sm:text-base">En 3 pasos tienes tu web de boda lista para compartir</p>
            </div>
          </RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {[
              { step: "01", title: "Regístrate gratis", desc: "Sin tarjeta de crédito. Crea tu cuenta y empieza a explorar y personalizar." },
              { step: "02", title: "Personaliza tu boda", desc: "Elige tema, añade vuestros datos, configura RSVP, playlist, agenda y plan de mesas." },
              { step: "03", title: "Publica y comparte", desc: "Desde 30€, pago único. Genera un QR para las invitaciones o envía el enlace." },
            ].map((s, i) => (
              <RevealSection key={s.step} delay={i * 120}>
                <div className="group">
                  <p className="font-heading text-5xl sm:text-6xl text-border group-hover:text-primary/20 transition-colors duration-500 mb-4 leading-none">{s.step}</p>
                  <h3 className="font-heading text-lg sm:text-xl text-foreground mb-2">{s.title}</h3>
                  <p className="text-muted-foreground font-light text-sm leading-relaxed">{s.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
          <RevealSection delay={400}>
            <div className="text-center mt-10">
              <Link
                to="/auth"
                onClick={() => track("clic_crear_boda", { location: "how_it_works" })}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                Empezar ahora — es gratis <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── MANAGEMENT FEATURES ── */}
      <section className="py-16 sm:py-24 bg-secondary">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <RevealSection>
            <div className="text-center mb-10 sm:mb-14">
              <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.35em] text-primary mb-3">Exclusivo Plan Completo</span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-3">Tu wedding planner digital</h2>
              <p className="text-muted-foreground font-light text-sm sm:text-base max-w-lg mx-auto">Gestiona cada detalle desde un solo lugar: presupuesto, checklist y regalos.</p>
            </div>
          </RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <RevealSection delay={0}>
              <div className="bg-card border border-border rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 group">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading text-xl mb-2">Control de presupuesto</h3>
                <p className="text-muted-foreground text-sm font-light mb-4">Lleva al céntimo cada gasto: finca, catering, fotógrafo, flores, DJ y más.</p>
                <div className="space-y-2.5">
                  {[
                    { name: "Catering", amount: "6.800€", pct: 85 },
                    { name: "Fotografía", amount: "2.200€", pct: 55 },
                    { name: "Flores", amount: "1.200€", pct: 30 },
                  ].map((item) => (
                    <div key={item.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="font-medium text-foreground">{item.amount}</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>
            <RevealSection delay={100}>
              <div className="bg-card border border-border rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 group">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <ListChecks className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading text-xl mb-2">Checklist de boda</h3>
                <p className="text-muted-foreground text-sm font-light mb-4">18 tareas de una wedding planner profesional. Añade las tuyas.</p>
                <div className="space-y-2">
                  {["Reservar la finca", "Contratar catering", "Elegir fotógrafo", "Comprar alianzas", "Prueba de peluquería"].map((t, i) => (
                    <div key={t} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${i < 3 ? "bg-primary border-primary" : "border-border"}`}>
                        {i < 3 && <CheckCircle className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <span className={`text-xs ${i < 3 ? "line-through text-muted-foreground" : "text-foreground"}`}>{t}</span>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground mt-1">+13 tareas más...</p>
                </div>
              </div>
            </RevealSection>
            <RevealSection delay={200}>
              <div className="bg-card border border-border rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 group">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <Gift className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading text-xl mb-2">Control de regalos</h3>
                <p className="text-muted-foreground text-sm font-light mb-4">Registra cada regalo, su valor y marca cuando hayas agradecido.</p>
                <div className="space-y-2.5">
                  {[
                    { emoji: "🎁", name: "Familia García", amount: "300€", done: true },
                    { emoji: "💰", name: "Ana y Pedro", amount: "900€", done: true },
                    { emoji: "🏦", name: "Carlos y Marta", amount: "500€", done: false },
                  ].map((g) => (
                    <div key={g.name} className="flex items-center gap-2 text-xs">
                      <span>{g.emoji}</span>
                      <span className="text-foreground font-medium">{g.name}</span>
                      <span className="text-muted-foreground ml-auto">{g.amount}</span>
                      {g.done ? <CheckCircle className="w-3.5 h-3.5 text-primary" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-border" />}
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── dark magazine style */}
      <section className="py-16 sm:py-24 bg-stone-950">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <RevealSection>
            <div className="text-center mb-10 sm:mb-14">
              <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.35em] text-white/30 mb-3">Opiniones</span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-white mb-3">Lo que dicen las parejas</h2>
            </div>
          </RevealSection>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <RevealSection key={t.name} delay={i * 100}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full flex flex-col">
                  <span className="font-heading text-5xl text-white/10 leading-none mb-2">"</span>
                  <p className="text-white/60 font-light text-sm leading-relaxed flex-1 -mt-4">{t.text}</p>
                  <div className="flex gap-0.5 my-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-primary font-heading text-xs font-semibold">{t.initials}</span>
                    </div>
                    <div>
                      <p className="font-heading text-sm text-white/80">{t.name}</p>
                      <p className="text-xs text-white/30">{t.location}</p>
                    </div>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <RevealSection>
            <div className="text-center mb-10">
              <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.35em] text-primary mb-3">Comparativa</span>
              <h2 className="font-heading text-3xl sm:text-4xl text-foreground mb-2">¿Por qué BodasFácil?</h2>
              <p className="text-muted-foreground text-sm font-light">Frente a las alternativas del mercado</p>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-5 text-muted-foreground font-normal text-xs uppercase tracking-wider w-2/5"></th>
                    <th className="py-4 px-4 text-center text-muted-foreground font-normal text-sm">Agencia</th>
                    <th className="py-4 px-4 text-center text-muted-foreground font-normal text-sm">WedSites</th>
                    <th className="py-4 px-4 text-center bg-primary/5 font-semibold text-primary text-sm">BodasFácil</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Precio", "~500€+", "15€/mes", "Desde 30€ — único"],
                    ["IA que escribe tu historia ✦", "❌", "❌", "✅"],
                    ["En español nativo", "Depende", "❌", "✅"],
                    ["Sin suscripción", "✅", "❌", "✅"],
                    ["RSVP en tiempo real", "❌", "✅", "✅"],
                    ["Plan de mesas", "❌", "Básico", "✅"],
                    ["Playlist colaborativa", "❌", "❌", "✅"],
                    ["Lista en 5 minutos", "❌", "Parcial", "✅"],
                    ["30 días de garantía", "❌", "❌", "✅"],
                  ].map(([feat, agency, wedSites, bf], i) => (
                    <tr key={feat} className={`border-b border-border/50 last:border-0 ${i % 2 === 0 ? "" : "bg-secondary/30"}`}>
                      <td className="py-3 px-5 text-foreground font-medium text-sm">{feat}</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">{agency}</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">{wedSites}</td>
                      <td className="py-3 px-4 text-center bg-primary/4 font-semibold text-primary">{bf}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-center mt-7">
              <Link
                to="/auth"
                onClick={() => track("clic_crear_boda", { location: "comparison_table" })}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                Crear mi boda gratis — sin tarjeta <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" ref={pricingRef} className="py-16 sm:py-24 bg-secondary">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <RevealSection>
            <div className="text-center mb-8 sm:mb-12">
              <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.35em] text-primary mb-3">Precios</span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-3">Pago único. Sin suscripciones.</h2>
              <p className="text-muted-foreground font-light text-sm sm:text-base">Pagas una vez y tu web de boda es tuya para siempre</p>
            </div>
          </RevealSection>

          {/* Anchoring strip */}
          <RevealSection>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 text-xs">
              <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-xl">
                <span className="text-muted-foreground font-medium">Agencia tradicional</span>
                <span className="font-heading text-sm line-through text-muted-foreground/40">~500€</span>
              </div>
              <span className="text-muted-foreground/30 font-bold">vs</span>
              <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-xl">
                <span className="text-muted-foreground font-medium">WedSites</span>
                <span className="font-heading text-sm line-through text-muted-foreground/40">15€/mes</span>
              </div>
              <span className="text-muted-foreground/30 font-bold">vs</span>
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border-2 border-primary/30 rounded-xl text-primary">
                <span className="font-semibold">BodasFácil</span>
                <span className="font-heading text-sm font-bold">Desde 30€</span>
                <span className="text-[10px] opacity-70">pago único ✓</span>
              </div>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {/* Básico */}
            <RevealSection delay={0}>
              <div className="bg-card border border-border rounded-2xl p-7 flex flex-col h-full hover:shadow-lg transition-all duration-300">
                <h3 className="font-heading text-2xl text-foreground mb-1">Básico</h3>
                <div className="mb-4">
                  <span className="font-heading text-4xl text-foreground">30€</span>
                  <span className="text-muted-foreground text-sm ml-1.5">pago único</span>
                </div>
                <p className="text-muted-foreground text-sm font-light mb-6">Para parejas que quieren algo sencillo y bonito.</p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {["Página web personalizada", "1 tema visual a elegir", "RSVP online + confirmaciones", "Playlist colaborativa", "Muro de fotos en vivo", "Código QR para invitaciones", "Información de ceremonia", "Cuenta atrás del gran día"].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/auth"
                  onClick={() => track("clic_crear_boda", { location: "pricing_basico" })}
                  className="block w-full text-center px-6 py-3.5 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  Empezar con Plan Básico →
                </Link>
              </div>
            </RevealSection>

            {/* Completo */}
            <RevealSection delay={100}>
              <div className="bg-card border-2 border-primary rounded-2xl p-7 flex flex-col relative shadow-xl hover:shadow-2xl transition-all duration-300 h-full animate-pulse-glow">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full shadow-md">
                  ⭐ Más popular
                </div>
                <h3 className="font-heading text-2xl text-foreground mb-1">Completo</h3>
                <div className="mb-4">
                  <span className="font-heading text-4xl text-foreground">60€</span>
                  <span className="text-muted-foreground text-sm ml-1.5">pago único</span>
                </div>
                <p className="text-muted-foreground text-sm font-light mb-6">Todo incluido para una experiencia inolvidable.</p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {["Todo lo del plan Básico", "12 temas visuales disponibles", "Plan de mesas inteligente", "Agenda del día completa", "FAQ + Mapa interactivo", "Lista de regalos / cuenta bancaria", "Vuestra historia de amor con IA", "📊 Gestor de presupuesto (14 cat.)", "🎁 Control de regalos", "✅ Checklist (18 tareas)", "Soporte 24 horas"].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleBuy("completo_one_time")}
                  disabled={loading}
                  className="w-full text-center px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? "Cargando..." : "Comprar Plan Completo →"}
                </button>
                <p className="text-center text-xs text-muted-foreground mt-2">
                  o{" "}
                  <Link to="/auth" onClick={() => track("clic_crear_boda", { location: "pricing_completo_fallback" })} className="underline underline-offset-4 hover:text-foreground">
                    crea tu boda gratis primero
                  </Link>
                </p>
              </div>
            </RevealSection>
          </div>

          {/* Plan Organizador */}
          <RevealSection delay={200}>
            <div className="mt-5 bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 max-w-2xl mx-auto">
              <div className="flex-1 text-center sm:text-left">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">Para profesionales</span>
                <h3 className="font-heading text-lg text-foreground mt-0.5">Plan Organizador — Múltiples bodas</h3>
                <p className="text-muted-foreground text-xs font-light mt-0.5">Wedding planners y fotógrafos. Dashboard multi-boda y precios por volumen.</p>
              </div>
              <button
                onClick={() => { setContactSubject("Plan Wedding Planner"); setContactOpen(true); }}
                className="shrink-0 px-5 py-2.5 rounded-xl border-2 border-border text-foreground text-sm font-medium hover:border-primary hover:text-primary transition-all duration-300"
              >
                Pedir info →
              </button>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <RevealSection>
            <div className="text-center mb-10 sm:mb-14">
              <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.35em] text-primary mb-3">FAQ</span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-3">¿Tienes dudas?</h2>
            </div>
          </RevealSection>
          <div className="space-y-2.5">
            {[
              { q: "¿Es un pago único o una suscripción?", a: "Pago único. Pagas una sola vez y tu web de boda es tuya para siempre. Sin renovaciones ni cargos ocultos. Nunca." },
              { q: "¿Puedo crear y editar mi boda antes de pagar?", a: "Sí, totalmente gratis. Regístrate, personaliza tu boda y mírala en preview. Solo pagas cuando quieras publicarla para que tus invitados puedan verla." },
              { q: "¿Mis invitados necesitan registrarse o instalar algo?", a: "No. Tus invitados acceden directamente con el enlace o código QR. Sin cuenta, sin app, sin descarga. Funciona en cualquier móvil." },
              { q: "¿Cuánto tarda en estar lista mi web de boda?", a: "Puedes tener tu página lista en 5 minutos. Si prefieres que te hagamos un borrador personalizado, lo tienes en menos de 24 horas." },
              { q: "¿Y si no me convence?", a: "Tienes 30 días de garantía de devolución sin preguntas. Envíanos un email y te devolvemos el 100% del importe." },
              { q: "¿Puedo cambiar el diseño después?", a: "Sí, cuantas veces quieras. Puedes cambiar el tema visual, subir nuevas fotos, actualizar los datos y editar todo el contenido en cualquier momento." },
              { q: "¿La web de boda tiene publicidad?", a: "No. Tu web de boda es tuya. Sin anuncios, sin marca de agua de BodasFácil, sin nada que distraiga a tus invitados." },
            ].map((faq, i) => (
              <RevealSection key={i} delay={i * 50}>
                <details className="group bg-card border border-border rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between p-5 cursor-pointer text-sm sm:text-base text-foreground font-medium hover:bg-secondary/50 transition-colors list-none">
                    {faq.q}
                    <span className="ml-4 shrink-0 text-muted-foreground group-open:rotate-45 transition-transform duration-200 text-xl leading-none">+</span>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-muted-foreground font-light leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── VENDORS ── */}
      <section className="py-14 sm:py-20 bg-secondary border-y border-border">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <RevealSection>
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="flex-1 text-center md:text-left">
                <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.35em] text-primary mb-3">Para profesionales</span>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-foreground mb-3">
                  ¿Eres fotógrafo, wedding planner<br className="hidden sm:block" /> o proveedor de bodas?
                </h2>
                <p className="text-muted-foreground font-light text-sm sm:text-base max-w-md mx-auto md:mx-0 leading-relaxed">
                  Llega a cientos de parejas que organizan su boda ahora mismo en BodasFácil.
                </p>
              </div>
              <div className="flex flex-col items-center md:items-end gap-4 shrink-0 w-full md:w-auto">
                <div className="flex flex-wrap gap-2 justify-center md:justify-end max-w-xs">
                  {["📸 Fotografía", "💐 Floristería", "🎵 DJ · Música", "🍽️ Catering", "🏰 Fincas", "✨ Wedding Planner"].map((s) => (
                    <span key={s} className="px-3 py-1.5 rounded-full bg-card border border-border text-xs text-foreground font-light">{s}</span>
                  ))}
                </div>
                <a
                  href="mailto:soporte@bodasfacil.com?subject=Quiero%20anunciarme%20en%20BodasF%C3%A1cil"
                  onClick={() => track("clic_anunciarse")}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity w-full sm:w-auto justify-center"
                >
                  Contactar con nosotros →
                </a>
                <p className="text-xs text-muted-foreground">soporte@bodasfacil.com · Respondemos en 24h</p>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── FINAL CTA ── dark */}
      <section className="py-24 sm:py-32 bg-stone-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/8 blur-3xl rounded-full" />
        </div>
        <RevealSection>
          <div className="max-w-2xl mx-auto text-center relative z-10 px-5 sm:px-8">
            <Heart className="w-7 h-7 text-primary mx-auto mb-5 opacity-60 animate-float" />
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-white mb-4 text-balance leading-tight">
              Vuestra historia merece<br />una web perfecta
            </h2>
            <p className="text-white/50 font-light text-base sm:text-lg mb-2">
              Cread vuestra web de boda en minutos. Publicad cuando estéis listos.
            </p>
            <p className="text-primary font-medium text-sm mb-8 sm:mb-10">
              Desde 30€, pago único para siempre. Sin suscripciones.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/auth"
                onClick={() => track("clic_crear_boda", { location: "final_cta" })}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-stone-900 font-semibold text-base hover:bg-white/95 hover:-translate-y-0.5 transition-all duration-300 shadow-2xl shadow-white/10"
              >
                Crear mi web de boda gratis <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white font-light text-base hover:bg-white/8 transition-all duration-300"
              >
                Ver precios
              </a>
            </div>
            <p className="text-white/20 text-xs mt-6">30 días de garantía · Pago seguro con Paddle · +200 bodas en España</p>
          </div>
        </RevealSection>
      </section>

      {/* ── FOOTER ── */}
      <footer className="pt-8 sm:pt-12 pb-24 md:py-12 border-t border-border bg-background">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-primary" />
                <span className="font-heading text-foreground">BodasFácil</span>
              </div>
              <p className="text-muted-foreground text-xs font-light max-w-xs">La web de boda más completa de España. RSVP, playlist, plan de mesas y más. Desde 30€.</p>
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
            <p className="text-muted-foreground text-xs font-light">
              © {new Date().getFullYear()} BodasFácil. Hecho con <Heart className="w-3 h-3 inline text-primary" /> en España.
            </p>
          </div>
        </div>
      </footer>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} subject={contactSubject} />

      {/* Exit intent */}
      {showExitIntent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/70 backdrop-blur-sm px-4" onClick={() => setShowExitIntent(false)}>
          <div className="bg-background rounded-2xl p-8 max-w-xs w-full shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
            <Heart className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-heading text-2xl text-foreground mb-2">¿Te vas sin tu boda?</h2>
            <p className="text-muted-foreground text-sm font-light mb-6 leading-relaxed">Es gratis empezar. Crea y personaliza tu web, y la publicas desde 30€ cuando estéis listos.</p>
            <Link
              to="/auth"
              onClick={() => { track("clic_crear_boda", { location: "exit_intent" }); setShowExitIntent(false); }}
              className="block w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold mb-3 hover:opacity-90 transition-opacity"
            >
              Crear mi boda gratis →
            </Link>
            <button onClick={() => setShowExitIntent(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">No, gracias</button>
          </div>
        </div>
      )}

      {/* Social proof */}
      {socialProof && (
        <div className="hidden md:flex fixed bottom-6 left-5 z-50 bg-card border border-border rounded-xl px-4 py-3 shadow-lg items-center gap-3 max-w-[250px] animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Heart className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium text-foreground">{socialProof.name}</p>
            <p className="text-[10px] text-muted-foreground">de {socialProof.city} acaba de crear su boda</p>
          </div>
        </div>
      )}

      {/* Sticky CTA mobile */}
      {showStickyCTA && (
        <div
          className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t border-border px-4 pt-3"
          style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
        >
          <Link
            to="/auth"
            onClick={() => track("clic_crear_boda", { location: "sticky_mobile" })}
            className="block w-full text-center py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
          >
            Crear mi boda gratis →
          </Link>
        </div>
      )}
    </div>
  );
};

export default Index;
