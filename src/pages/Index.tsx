import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Heart, Sparkles, Users, Music, Camera, MapPin, Clock, HelpCircle, BookHeart, Gift, Share2, ArrowRight, CheckCircle, Play, Menu, X, Wallet, ListChecks, Shield, Zap, RefreshCcw, Star } from "lucide-react";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import ContactModal from "@/components/ContactModal";
import { track, trackBeginCheckout } from "@/lib/analytics";

const features = [
  { icon: Heart, title: "Página inmersiva", desc: "Experiencia a pantalla completa con animaciones fluidas, temas visuales y navegación por secciones." },
  { icon: Users, title: "RSVP online", desc: "Tus invitados confirman asistencia, acompañantes y notas de dieta en un solo clic." },
  { icon: Music, title: "Playlist colaborativa", desc: "Que tus invitados sugieran y voten las canciones de la fiesta." },
  { icon: Camera, title: "Muro de fotos", desc: "Todos comparten sus mejores fotos del gran día en un muro en vivo." },
  { icon: MapPin, title: "Mapas integrados", desc: "Google Maps embebido con ubicación exacta de ceremonia y recepción." },
  { icon: Clock, title: "Agenda del día", desc: "Timeline visual del evento: ceremonia → cóctel → banquete → fiesta." },
  { icon: BookHeart, title: "Vuestra historia", desc: "Línea de tiempo con los hitos de amor de vuestra relación." },
  { icon: Gift, title: "Lista de regalos", desc: "Cuenta bancaria con revelado elegante para los invitados." },
  { icon: HelpCircle, title: "FAQ inteligente", desc: "Parking, niños, código de vestimenta, alojamiento... todo resuelto." },
  { icon: Share2, title: "QR & WhatsApp", desc: "Comparte con un QR imprimible o directamente por WhatsApp." },
  { icon: Sparkles, title: "12 temas visuales", desc: "Elegante, Romántico, Rústico, Moderno, Jardín, Bohemio, Minimal y más." },
  { icon: Users, title: "Plan de mesas", desc: "Asigna invitados a mesas. Visible solo un día antes de la boda." },
];

const demos = [
  { slug: "demo-elegant", theme: "Elegante", couple: "Sofía & Daniel", color: "hsl(33, 30%, 40%)", gradient: "from-amber-800/20 to-amber-600/10" },
  { slug: "demo-romantic", theme: "Romántico", couple: "Isabella & Marco", color: "hsl(340, 45%, 55%)", gradient: "from-pink-600/20 to-rose-400/10" },
  { slug: "demo-rustic", theme: "Rústico", couple: "Elena & Pablo", color: "hsl(25, 50%, 32%)", gradient: "from-orange-900/20 to-orange-700/10" },
  { slug: "demo-modern", theme: "Moderno", couple: "Martina & Álex", color: "hsl(220, 25%, 18%)", gradient: "from-slate-800/20 to-slate-600/10" },
  { slug: "demo-autumn", theme: "Otoñal", couple: "Carmen & Javier", color: "hsl(15, 60%, 40%)", gradient: "from-orange-900/20 to-amber-700/10" },
  { slug: "demo-valencia", theme: "Valenciano", couple: "Lucia & Marcos", color: "hsl(33, 70%, 45%)", gradient: "from-orange-700/20 to-amber-500/10" },
];

const testimonials = [
  { name: "Laura & Sergio", location: "Valencia · Mayo 2026", initials: "LS", text: "Nuestros invitados no paraban de decir lo bonita que era la web. El plan de mesas nos salvó: 18 mesas organizadas en 10 minutos." },
  { name: "Marta & Pau", location: "Barcelona · Abril 2026", initials: "MP", text: "La playlist colaborativa fue lo mejor del día. Cada invitado puso su canción favorita y la pista no se vació en toda la noche. ¡Increíble!" },
  { name: "Ana & Roberto", location: "Madrid · Marzo 2026", initials: "AR", text: "En 20 minutos teníamos todo listo. Cero mensajes de WhatsApp preguntando dónde era la boda. La mejor inversión de toda la boda." },
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
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
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
      "description": "Crea tu página web de boda personalizada en 3 pasos: regístrate gratis, personaliza y comparte con tus invitados.",
      "totalTime": "PT5M",
      "estimatedCost": { "@type": "MonetaryAmount", "currency": "EUR", "value": "30" },
      "tool": [{ "@type": "WebApplication", "name": "BodasFácil", "url": "https://bodasfacil.com" }],
      "step": [
        { "@type": "HowToStep", "position": "1", "name": "Regístrate gratis", "url": "https://bodasfacil.com/auth", "text": "Crea tu cuenta en segundos. Sin compromiso, sin tarjeta de crédito. Accede gratis a todas las demos." },
        { "@type": "HowToStep", "position": "2", "name": "Personaliza tu web de boda", "url": "https://bodasfacil.com/dashboard", "text": "Elige uno de los 12 temas visuales, añade vuestros datos, sube fotos y configura RSVP, agenda, menú, plan de mesas y mucho más." },
        { "@type": "HowToStep", "position": "3", "name": "Publica y comparte", "url": "https://bodasfacil.com/#pricing", "text": "Desde 30€ de pago único. Genera un código QR para las invitaciones o comparte el enlace por WhatsApp. Tus invitados acceden al instante sin necesidad de app." }
      ]
    });
    document.head.appendChild(el);
    return () => document.getElementById("schema-howto")?.remove();
  }, []);

  // Scroll depth — saber hasta dónde leen la landing (25%, 50%, 75%, 90%)
  useEffect(() => {
    const milestones = new Set<number>();
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (!total) return;
      const pct = Math.round((window.scrollY / total) * 100);
      ([25, 50, 75, 90] as const).forEach((m) => {
        if (pct >= m && !milestones.has(m)) {
          milestones.add(m);
          track("scroll_depth", { depth: m, page: "home" });
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // View pricing — saber cuántos usuarios llegan a ver la sección de precios
  useEffect(() => {
    const el = pricingRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          track("view_pricing", { page: "home" });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Exit intent (desktop): se dispara cuando el ratón sale por arriba
  useEffect(() => {
    let shown = false;
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !shown) {
        shown = true;
        setShowExitIntent(true);
        track("exit_intent_shown");
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  // Social proof notifications: muestra bodas recientes ficticias para generar confianza
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
    openCheckout({
      priceId,
      successUrl: `${window.location.origin}/dashboard?checkout=success`,
    });
  };

  const navLinks = [
    { href: "#features", label: "Funcionalidades" },
    { href: "#demos", label: "Demos" },
    { href: "#pricing", label: "Precios" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* Sticky Navbar */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border" : "bg-transparent"}`}>
        <div className="container max-w-5xl flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <Heart className={`w-5 h-5 transition-all duration-300 group-hover:scale-110 ${scrolled ? "text-primary" : "text-primary-foreground"}`} />
            <span className={`font-heading text-lg sm:text-xl transition-colors duration-300 ${scrolled ? "text-foreground" : "text-primary-foreground"}`}>BodasFácil</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className={`text-sm font-light transition-colors duration-300 ${scrolled ? "text-muted-foreground hover:text-foreground" : "text-primary-foreground/70 hover:text-primary-foreground"}`}>
                {l.label}
              </a>
            ))}
            <Link
              to="/auth"
              onClick={() => track("clic_crear_boda", { location: "navbar" })}
              className={`text-sm font-medium px-5 py-2 rounded-lg transition-all duration-300 ${scrolled ? "bg-primary text-primary-foreground hover:opacity-90 shadow-sm" : "bg-primary-foreground/15 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/25 border border-primary-foreground/20"}`}>
              Crear mi boda
            </Link>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2" aria-label="Menú">
            {mobileMenuOpen
              ? <X className={`w-5 h-5 ${scrolled ? "text-foreground" : "text-primary-foreground"}`} />
              : <Menu className={`w-5 h-5 ${scrolled ? "text-foreground" : "text-primary-foreground"}`} />
            }
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border px-6 pb-4 space-y-3 animate-fade-in">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
                {l.label}
              </a>
            ))}
            <Link
              to="/auth"
              onClick={() => { setMobileMenuOpen(false); track("clic_crear_boda", { location: "navbar_mobile" }); }}
              className="block text-center text-sm font-medium px-5 py-2.5 rounded-lg bg-primary text-primary-foreground"
            >
              Crear mi boda
            </Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-stone-800">
      <div className="absolute inset-0">
  <img
    src="/decorar-banquete-boda_2c8fd058_1280x853.jpg"
    alt="Masía rústica para bodas en España"
    width={1280}
    height={853}
    className="w-full h-full object-cover"
    loading="eager"
    fetchPriority="high"
  />
  <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-foreground/45 to-foreground/75" />
</div>
        <div className="relative z-10 text-center px-5 sm:px-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-6 sm:mb-8">
            <Sparkles className="w-3.5 h-3.5 text-primary-foreground/80" />
            <span className="text-primary-foreground/80 text-[11px] sm:text-xs tracking-wider uppercase font-light">
              <span className="sm:hidden">Pago único · Desde 30€</span>
              <span className="hidden sm:inline">12 funcionalidades · Pago único desde 30€ · Sin suscripciones</span>
            </span>
          </div>
          <h1 className="font-heading text-[2.75rem] sm:text-6xl md:text-7xl lg:text-8xl text-primary-foreground mb-4 sm:mb-6 leading-[0.95] text-balance">
            La web de boda<br />que merece el día
          </h1>
          <p className="text-primary-foreground/85 text-base sm:text-lg md:text-xl font-light mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed">
            Sin grupos de WhatsApp, sin llamadas de confirmación. RSVP, playlist colaborativa, plan de mesas y fotos en vivo. Lista en 5 minutos. <strong className="font-medium text-primary-foreground">Desde 30€, pago único para siempre.</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/auth"
              onClick={() => track("clic_crear_boda", { location: "hero" })}
              className="group px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-primary-foreground text-foreground font-medium text-base sm:text-lg hover:shadow-2xl hover:shadow-primary-foreground/25 hover:-translate-y-0.5 transition-all duration-300"
            >
              Crear mi web de boda gratis
              <ArrowRight className="w-4 h-4 inline ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#demos"
              onClick={() => track("clic_ver_demos", { location: "hero" })}
              className="group px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl border-2 border-primary-foreground/30 text-primary-foreground font-light text-base sm:text-lg hover:bg-primary-foreground/10 hover:border-primary-foreground/50 transition-all duration-300"
            >
              <Play className="w-4 h-4 inline mr-2" />
              Ver demos en vivo
            </a>
          </div>

          {/* Prueba social */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 sm:mt-10">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
              <div className="flex -space-x-1.5">
                {["🤵", "👰", "💍"].map((e, i) => (
                  <span key={i} className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xs">{e}</span>
                ))}
              </div>
              <span className="text-primary-foreground/80 text-xs font-light">+200 bodas en España</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
              </div>
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

      {/* Pain — ¿Te suena esto? */}
      <section className="py-12 sm:py-16 bg-card">
        <div className="container max-w-4xl px-5 sm:px-8">
          <RevealSection>
            <p className="text-center font-heading text-xl sm:text-2xl text-foreground mb-7 sm:mb-8">¿Te suena esto?</p>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="bg-destructive/5 border border-destructive/15 rounded-xl p-5 sm:p-6 space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-destructive/60 mb-4">Sin web de boda</p>
                {[
                  '"¿Dónde era la boda? ¿A qué hora?"',
                  "Grupo de WhatsApp con 80 personas saturado",
                  "Excel de confirmaciones siempre desactualizado",
                  '"¿Puedo llevar a mi pareja?" × 40 invitados',
                  "Llamadas para saber quién viene y quién no",
                ].map((pain) => (
                  <div key={pain} className="flex items-start gap-2.5">
                    <span className="text-destructive/50 flex-shrink-0 mt-0.5 font-bold text-sm">✕</span>
                    <p className="text-sm text-foreground/60 italic">{pain}</p>
                  </div>
                ))}
              </div>
              <div className="bg-primary/5 border border-primary/15 rounded-xl p-5 sm:p-6 space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary mb-4">Con BodasFácil</p>
                {[
                  "Todo en un enlace: lugar, hora y agenda",
                  "RSVP online — sin mensajes, sin llamadas",
                  "Confirmaciones en tiempo real en tu panel",
                  "Playlist colaborativa que se llena sola",
                  "Muro de fotos en vivo el día de la boda",
                ].map((fix) => (
                  <div key={fix} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground/85">{fix}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center mt-7">
              <Link
                to="/auth"
                onClick={() => track("clic_crear_boda", { location: "pain_section" })}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                Crear mi web gratis — sin tarjeta <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-xs text-muted-foreground mt-2">Desde 30€ pago único · Sin suscripciones · 30 días de garantía</p>
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
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 sm:mb-4 text-balance">
                Todo lo que necesitas para<br className="hidden sm:block" /> el día perfecto
              </h2>
              <p className="text-muted-foreground font-light text-base sm:text-lg max-w-lg mx-auto">
                12 funcionalidades diseñadas para que tu boda sea inolvidable
              </p>
            </div>
          </RevealSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map((f, i) => (
              <RevealSection key={f.title} delay={i % 3 * 80}>
                <div className="bg-card border border-border rounded-xl p-5 sm:p-6 group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 h-full">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                    <f.icon className="w-[18px] h-[18px] text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <h3 className="font-heading text-lg mb-1.5">{f.title}</h3>
                  <p className="text-muted-foreground font-light text-sm leading-relaxed">{f.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demos */}
      <section id="demos" className="py-16 sm:py-24 bg-background">
        <div className="container max-w-4xl px-5 sm:px-8">
          <RevealSection>
            <div className="text-center mb-10 sm:mb-16">
              <span className="inline-block text-xs uppercase tracking-[0.3em] text-primary mb-3 sm:mb-4 font-medium">Inspírate</span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 sm:mb-4">
                Demos en vivo
              </h2>
              <p className="text-muted-foreground font-light text-base sm:text-lg">
                Explora cada estilo con datos reales — toca, navega, siente
              </p>
            </div>
          </RevealSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {demos.map((d, i) => (
              <RevealSection key={d.slug} delay={i % 2 * 120}>
                <Link
                  to={`/w/${d.slug}`}
                  onClick={() => track("clic_demo", { demo: d.slug })}
                  className={`group bg-gradient-to-br ${d.gradient} bg-card border border-border rounded-xl p-5 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: d.color }}
                    >
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg sm:text-xl text-foreground">{d.couple}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Tema {d.theme}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-primary text-sm font-medium group-hover:gap-3 gap-1.5 transition-all duration-300">
                    Ver demo en vivo <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Digital vs Papel — trust strip */}
      <section className="py-10 sm:py-14 bg-primary/5 border-y border-primary/10">
        <div className="container max-w-4xl px-5 sm:px-8">
          <RevealSection>
            <p className="text-center text-sm font-medium text-foreground mb-6">¿Por qué una web de boda en lugar de invitaciones en papel?</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
              {[
                { label: "de envío postal", value: "0€", sub: "vs 3-5€ por invitado en papel", emoji: "✉️" },
                { label: "siempre actualizable", value: "∞", sub: "vs fijo al imprimirse", emoji: "✏️" },
                { label: "lista en minutos", value: "5 min", sub: "vs 2-4 semanas de imprenta", emoji: "⚡" },
                { label: "RSVP automático", value: "100%", sub: "vs llamadas y WhatsApps", emoji: "📊" },
              ].map((item) => (
                <div key={item.label} className="bg-card rounded-xl p-4 border border-border">
                  <span className="text-2xl block mb-1">{item.emoji}</span>
                  <p className="font-heading text-xl sm:text-2xl text-primary">{item.value}</p>
                  <p className="text-foreground text-xs font-medium mt-0.5">{item.label}</p>
                  <p className="text-muted-foreground/70 text-[10px] line-through mt-1">{item.sub}</p>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-24 bg-secondary">
        <div className="container max-w-3xl px-5 sm:px-8">
          <RevealSection>
            <div className="text-center mb-10 sm:mb-16">
              <span className="inline-block text-xs uppercase tracking-[0.3em] text-primary mb-3 sm:mb-4 font-medium">Cómo funciona</span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 sm:mb-4">
                Así de fácil
              </h2>
              <p className="text-muted-foreground font-light text-base sm:text-lg">
                En 3 pasos tienes tu web de boda lista para compartir
              </p>
            </div>
          </RevealSection>
          <div className="space-y-4 sm:space-y-6">
            {[
              { step: "1", title: "Regístrate gratis en 30 segundos", desc: "Sin tarjeta de crédito. Crea tu cuenta, explora las demos y empieza a personalizar." },
              { step: "2", title: "Personaliza vuestra web de boda", desc: "Elige uno de los 12 temas, añade vuestros datos, sube fotos y configura el RSVP, la agenda y el menú." },
              { step: "3", title: "Publica y comparte con tus invitados", desc: "Desde 30€ de pago único. Genera un QR para las invitaciones o envía el enlace por WhatsApp. Tus invitados acceden al instante." },
            ].map((s, i) => (
              <RevealSection key={s.step} delay={i * 120}>
                <div className="flex gap-4 sm:gap-5 items-start bg-card border border-border rounded-xl p-5 sm:p-6 hover:shadow-md transition-all duration-300 group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-heading text-lg sm:text-xl shadow-md group-hover:scale-105 transition-transform duration-300">
                    {s.step}
                  </div>
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

      {/* Management Features */}
      <section className="py-16 sm:py-24 bg-card">
        <div className="container max-w-5xl px-5 sm:px-8">
          <RevealSection>
            <div className="text-center mb-10 sm:mb-14">
              <span className="inline-block text-xs uppercase tracking-[0.3em] text-primary mb-3 sm:mb-4 font-medium">Exclusivo Plan Completo</span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 sm:mb-4">
                Tu wedding planner digital
              </h2>
              <p className="text-muted-foreground font-light text-base sm:text-lg max-w-2xl mx-auto">
                Gestiona cada detalle desde un solo lugar: presupuesto, checklist y regalos.
              </p>
            </div>
          </RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            <RevealSection delay={0}>
              <div className="bg-background border border-border rounded-xl p-6 h-full hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors duration-300">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-xl text-foreground mb-2">Control de presupuesto</h3>
                <p className="text-muted-foreground text-sm font-light mb-4">Lleva al céntimo cada gasto: finca, catering, fotógrafo, flores, DJ y más.</p>
                <div className="space-y-2">
                  {[
                    { name: "Catering", amount: "6.800€", pct: 85 },
                    { name: "Fotografía", amount: "2.200€", pct: 55 },
                    { name: "Flores", amount: "1.200€", pct: 30 },
                  ].map((item) => (
                    <div key={item.name}>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="font-medium text-foreground">{item.amount}</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>
            <RevealSection delay={120}>
              <div className="bg-background border border-border rounded-xl p-6 h-full hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors duration-300">
                  <ListChecks className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-xl text-foreground mb-2">Checklist de boda</h3>
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
            <RevealSection delay={240}>
              <div className="bg-background border border-border rounded-xl p-6 h-full hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors duration-300">
                  <Gift className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-xl text-foreground mb-2">Control de regalos</h3>
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
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Agradecidos: 67%</span>
                    <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "67%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container max-w-5xl px-5 sm:px-8">
          <RevealSection>
            <div className="text-center mb-10 sm:mb-16">
              <span className="inline-block text-xs uppercase tracking-[0.3em] text-primary mb-3 sm:mb-4 font-medium">Opiniones</span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 sm:mb-4">
                Lo que dicen las parejas
              </h2>
            </div>
          </RevealSection>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <RevealSection key={t.name} delay={i * 100}>
                <div className="bg-card border border-border rounded-xl p-6 h-full flex flex-col">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-foreground/80 font-light text-sm leading-relaxed mb-5 flex-1">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-heading text-xs font-semibold">{t.initials}</span>
                    </div>
                    <div>
                      <p className="font-heading text-sm text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.location}</p>
                    </div>
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
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 sm:mb-4">
                Pago único. Sin suscripciones.
              </h2>
              <p className="text-muted-foreground font-light text-base sm:text-lg">
                Pagas una vez y tu web de boda es tuya para siempre
              </p>
            </div>
          </RevealSection>
          <RevealSection>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8 sm:mb-10">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Precio de lanzamiento — sube pronto</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>30 días de garantía de devolución</span>
              </div>
            </div>
          </RevealSection>

          {/* Anchoring strip */}
          <RevealSection>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg">
                <span className="font-medium">Agencia tradicional</span>
                <span className="font-heading text-sm line-through text-muted-foreground/50">~500€</span>
              </div>
              <span className="text-muted-foreground/40 font-medium">vs</span>
              <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg">
                <span className="font-medium">WedSites / Withjoy</span>
                <span className="font-heading text-sm line-through text-muted-foreground/50">15€/mes</span>
              </div>
              <span className="text-muted-foreground/40 font-medium">vs</span>
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border-2 border-primary/30 rounded-lg text-primary">
                <span className="font-medium">BodasFácil</span>
                <span className="font-heading text-sm font-bold">Desde 30€</span>
                <span className="text-[10px] opacity-80">pago único ✓</span>
              </div>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 max-w-2xl mx-auto">
            {/* Plan Básico */}
            <RevealSection delay={0}>
              <div className="bg-card border border-border rounded-xl p-6 sm:p-7 flex flex-col h-full hover:shadow-lg transition-all duration-300">
                <h3 className="font-heading text-2xl text-foreground mb-1">Básico</h3>
                <div className="mb-3 sm:mb-4">
                  <span className="font-heading text-3xl sm:text-4xl text-foreground">30€</span>
                  <span className="text-muted-foreground text-sm ml-1">pago único</span>
                </div>
                <p className="text-muted-foreground text-sm font-light mb-5 sm:mb-6">Para parejas que quieren algo sencillo y bonito.</p>
                <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 flex-1">
                  {[
                    "Página web personalizada",
                    "1 tema visual a elegir",
                    "RSVP online + ver confirmaciones",
                    "Playlist colaborativa de los invitados",
                    "Muro de fotos en vivo",
                    "Código QR para invitaciones",
                    "Información de ceremonia y recepción",
                    "Cuenta atrás del gran día",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 sm:gap-2.5 text-sm text-foreground">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/auth"
                  onClick={() => track("clic_crear_boda", { location: "pricing_basico" })}
                  className="block w-full text-center px-6 py-3.5 rounded-xl border-2 border-primary text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  Empezar con Plan Básico →
                </Link>
              </div>
            </RevealSection>

            {/* Plan Completo */}
            <RevealSection delay={100}>
              <div className="bg-card border-2 border-primary rounded-xl p-6 sm:p-7 flex flex-col relative shadow-lg hover:shadow-xl transition-all duration-300 h-full animate-pulse-glow">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-4 py-1 rounded-full shadow-md">
                  ⭐ Más popular
                </div>
                <h3 className="font-heading text-2xl text-foreground mb-1">Completo</h3>
                <div className="mb-3 sm:mb-4">
                  <span className="font-heading text-3xl sm:text-4xl text-foreground">60€</span>
                  <span className="text-muted-foreground text-sm ml-1">pago único</span>
                </div>
                <p className="text-muted-foreground text-sm font-light mb-5 sm:mb-6">Todo incluido para una experiencia inolvidable.</p>
                <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 flex-1">
                  {[
                    "Todo lo del plan Básico",
                    "12 temas visuales disponibles",
                    "Plan de mesas inteligente",
                    "Agenda del día completa",
                    "FAQ + Mapa interactivo",
                    "Lista de regalos / cuenta bancaria",
                    "Vuestra historia de amor",
                    "Compartir por WhatsApp",
                    "📊 Gestor de presupuesto (14 categorías)",
                    "🎁 Control de regalos y agradecimientos",
                    "✅ Checklist de boda profesional (18 tareas)",
                    "Soporte 24 horas",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 sm:gap-2.5 text-sm text-foreground">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleBuy("completo_one_time")}
                  disabled={loading}
                  className="w-full text-center px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? "Cargando..." : "Comprar Plan Completo →"}
                </button>
                <p className="text-center text-xs text-muted-foreground mt-2">
                  o{" "}
                  <Link to="/auth" onClick={() => track("clic_crear_boda", { location: "pricing_completo_fallback" })} className="underline underline-offset-4 hover:text-foreground transition-colors">
                    crea tu boda gratis primero
                  </Link>
                </p>
              </div>
            </RevealSection>
          </div>

          {/* Plan Organizador — slim banner */}
          <RevealSection delay={200}>
            <div className="mt-5 bg-card border border-border rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-3 sm:gap-5 max-w-2xl mx-auto">
              <div className="flex-1 text-center sm:text-left">
                <span className="text-xs uppercase tracking-widest font-medium text-muted-foreground">Para profesionales</span>
                <h3 className="font-heading text-lg text-foreground mt-0.5">Plan Organizador — Múltiples bodas</h3>
                <p className="text-muted-foreground text-xs font-light mt-0.5">Wedding planners y fotógrafos. Dashboard multi-boda, precios por volumen y soporte prioritario.</p>
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

      {/* FAQ */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container max-w-3xl px-5 sm:px-8">
          <RevealSection>
            <div className="text-center mb-10 sm:mb-14">
              <span className="inline-block text-xs uppercase tracking-[0.3em] text-primary mb-3 sm:mb-4 font-medium">Preguntas frecuentes</span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 sm:mb-4">
                ¿Tienes dudas?
              </h2>
            </div>
          </RevealSection>
          <div className="space-y-3 sm:space-y-4">
            {[
              { q: "¿Es un pago único o una suscripción?", a: "Pago único. Pagas una sola vez y tu web de boda es tuya para siempre. Sin renovaciones ni cargos ocultos. Nunca." },
              { q: "¿Puedo crear y editar mi boda antes de pagar?", a: "Sí, totalmente gratis. Regístrate, personaliza tu boda y mírala en preview. Solo pagas cuando quieras publicarla para que tus invitados puedan verla." },
              { q: "¿Mis invitados necesitan registrarse o instalar algo?", a: "No. Tus invitados acceden directamente con el enlace o código QR. Sin cuenta, sin app, sin descarga. Funciona en cualquier móvil." },
              { q: "¿Cuánto tarda en estar lista mi web de boda?", a: "Puedes tener tu página lista en 5 minutos. Si prefieres que te hagamos un borrador personalizado, lo tienes en menos de 24 horas." },
              { q: "¿Y si no me convence?", a: "Tienes 30 días de garantía de devolución sin preguntas. Envíanos un email y te devolvemos el 100% del importe." },
              { q: "¿Puedo cambiar el diseño o la información después?", a: "Sí, cuantas veces quieras. Puedes cambiar el tema visual, subir nuevas fotos, actualizar los datos de la ceremonia y editar todo el contenido en cualquier momento." },
              { q: "¿Qué diferencia hay entre el plan Básico y el Completo?", a: "El Básico (30€) incluye página web, RSVP online, playlist colaborativa, muro de fotos en vivo y código QR. El Completo (60€) añade 12 temas visuales, plan de mesas, agenda del día, mapa interactivo, FAQ, historia de amor, gestor de presupuesto, checklist de boda y control de regalos." },
              { q: "¿La web de boda tiene publicidad?", a: "No. Tu web de boda es tuya. Sin anuncios, sin marca de agua de BodasFácil, sin nada que distraiga a tus invitados de lo que importa." },
            ].map((faq, i) => (
              <RevealSection key={i} delay={i * 60}>
                <details className="group bg-card border border-border rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between p-5 sm:p-6 cursor-pointer text-sm sm:text-base text-foreground font-medium hover:bg-secondary/50 transition-colors list-none">
                    {faq.q}
                    <span className="ml-4 flex-shrink-0 text-muted-foreground group-open:rotate-45 transition-transform duration-200 text-xl leading-none">+</span>
                  </summary>
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-muted-foreground font-light leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Para proveedores */}
      <section className="py-14 sm:py-20 bg-card border-y border-border">
        <div className="container max-w-5xl px-5 sm:px-8">
          <RevealSection>
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="flex-1 text-center md:text-left">
                <span className="inline-block text-xs uppercase tracking-[0.3em] text-primary mb-3 font-medium">Para profesionales</span>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-foreground mb-3">
                  ¿Eres fotógrafo, wedding planner<br className="hidden sm:block" /> o proveedor de bodas?
                </h2>
                <p className="text-muted-foreground font-light text-sm sm:text-base max-w-md mx-auto md:mx-0 leading-relaxed">
                  Llega a cientos de parejas que organizan su boda ahora mismo en BodasFácil.
                  Anúnciate y conecta con tu cliente ideal directamente.
                </p>
              </div>
              <div className="flex flex-col items-center md:items-end gap-4 shrink-0 w-full md:w-auto">
                <div className="flex flex-wrap gap-2 justify-center md:justify-end max-w-xs">
                  {["📸 Fotografía", "💐 Floristería", "🎵 DJ · Música", "🍽️ Catering", "🏰 Fincas", "✨ Wedding Planner"].map((s) => (
                    <span key={s} className="px-3 py-1.5 rounded-full bg-secondary border border-border text-xs text-foreground font-light">
                      {s}
                    </span>
                  ))}
                </div>
                <a
                  href="mailto:soporte@bodasfacil.com?subject=Quiero%20anunciarme%20en%20BodasF%C3%A1cil"
                  onClick={() => track("clic_anunciarse")}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity w-full sm:w-auto justify-center"
                >
                  Contactar con nosotros →
                </a>
                <p className="text-xs text-muted-foreground">soporte@bodasfacil.com · Respondemos en menos de 24h</p>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28 bg-secondary text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-gold blur-3xl" />
        </div>
        <RevealSection>
          <div className="container max-w-2xl relative z-10 px-5 sm:px-8">
            <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-primary mx-auto mb-5 sm:mb-6 opacity-60 animate-float" />
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 sm:mb-4 text-balance">
              Vuestra historia merece<br />una web perfecta
            </h2>
            <p className="text-muted-foreground font-light text-base sm:text-lg mb-2">
              Cread vuestra web de boda en minutos. Publicad cuando estéis listos.
            </p>
            <p className="text-primary font-medium text-sm mb-2">
              Desde 30€, pago único para siempre. Sin suscripciones.
            </p>
            <p className="text-muted-foreground/60 text-xs mb-8 sm:mb-10">
              30 días de garantía · Pago seguro con Paddle · +200 bodas en España
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/auth"
                onClick={() => track("clic_crear_boda", { location: "final_cta" })}
                className="group inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl bg-primary text-primary-foreground font-medium text-base sm:text-lg hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300"
              >
                Crear mi web de boda gratis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl border-2 border-border text-foreground font-light text-base sm:text-lg hover:bg-card transition-all duration-300"
              >
                Ver precios
              </a>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* Footer */}
      {/* pb-24 en móvil deja espacio al sticky CTA bar; md:py-12 lo anula en desktop */}
      <footer className="pt-8 sm:pt-12 pb-24 md:py-12 border-t border-border bg-background">
        <div className="container max-w-4xl px-5 sm:px-8">
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
                <button onClick={() => { setContactSubject(""); setContactOpen(true); }} className="hover:text-foreground transition-colors">
                  Contacto
                </button>
              </div>
              <div className="flex gap-3 text-xs text-muted-foreground">
                <a href="https://instagram.com/bodasfacil" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
                  <span>📸</span> Instagram
                </a>
                <a href="https://tiktok.com/@bodasfacil" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
                  <span>🎵</span> TikTok
                </a>
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

      {/* Exit intent modal (desktop) */}
      {showExitIntent && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 backdrop-blur-sm px-4"
          onClick={() => setShowExitIntent(false)}
        >
          <div
            className="bg-background rounded-2xl p-8 max-w-xs w-full shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Heart className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-heading text-2xl text-foreground mb-2">
              ¿Te vas sin tu boda?
            </h2>
            <p className="text-muted-foreground text-sm font-light mb-6 leading-relaxed">
              Es gratis empezar. Crea y personaliza tu web, y la publicas cuando estéis listos desde 30€.
            </p>
            <Link
              to="/auth"
              onClick={() => { track("clic_crear_boda", { location: "exit_intent" }); setShowExitIntent(false); }}
              className="block w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-medium mb-3 hover:opacity-90 transition-opacity"
            >
              Crear mi boda gratis →
            </Link>
            <button
              onClick={() => setShowExitIntent(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              No, gracias
            </button>
          </div>
        </div>
      )}

      {/* Social proof notification (solo desktop) */}
      {socialProof && (
        <div className="hidden md:flex fixed bottom-6 left-5 z-50 bg-card border border-border rounded-xl px-4 py-3 shadow-lg items-center gap-3 max-w-[250px] animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Heart className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium text-foreground">{socialProof.name}</p>
            <p className="text-[10px] text-muted-foreground">de {socialProof.city} acaba de crear su boda</p>
          </div>
        </div>
      )}

      {/* Sticky CTA bar (solo móvil, aparece al scrollar) */}
      {showStickyCTA && (
        <div
          className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t border-border px-4 pt-3"
          style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
        >
          <Link
            to="/auth"
            onClick={() => track("clic_crear_boda", { location: "sticky_mobile" })}
            className="block w-full text-center py-3.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm"
          >
            Crear mi boda gratis →
          </Link>
        </div>
      )}
    </div>
  );
};

export default Index;
