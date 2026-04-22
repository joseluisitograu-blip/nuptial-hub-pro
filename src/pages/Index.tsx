import { Link } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { Heart, Sparkles, Users, Music, Camera, MapPin, Clock, HelpCircle, BookHeart, Gift, Share2, Star, ArrowRight, CheckCircle, Play, Menu, X } from "lucide-react";
import heroImage from "@/assets/hero-wedding.jpg";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import ContactModal from "@/components/ContactModal";

const features = [
  { icon: Heart, title: "Página inmersiva", desc: "Experiencia a pantalla completa con animaciones, temas visuales y navegación por secciones." },
  { icon: Users, title: "RSVP online", desc: "Tus invitados confirman asistencia, número de acompañantes y notas de dieta." },
  { icon: Music, title: "Playlist colaborativa", desc: "Que tus invitados sugieran y voten las canciones de la fiesta." },
  { icon: Camera, title: "Muro de fotos", desc: "Todos comparten sus mejores fotos del gran día en un muro en vivo." },
  { icon: MapPin, title: "Mapas integrados", desc: "Google Maps embebido con ubicación exacta de ceremonia y recepción." },
  { icon: Clock, title: "Agenda del día", desc: "Timeline visual del evento: ceremonia → cóctel → banquete → fiesta." },
  { icon: BookHeart, title: "Vuestra historia", desc: "Línea de tiempo con los hitos de amor de la pareja." },
  { icon: Gift, title: "Lista de regalos", desc: "Cuenta bancaria con sistema de revelado elegante para los invitados." },
  { icon: HelpCircle, title: "FAQ inteligente", desc: "Preguntas frecuentes: parking, niños, código de vestimenta, alojamiento..." },
  { icon: Share2, title: "QR & WhatsApp", desc: "Comparte con un QR imprimible o directamente por WhatsApp." },
  { icon: Sparkles, title: "7 temas visuales", desc: "Elegante, Romántico, Rústico, Moderno, Jardín, Bohemio y Minimal." },
  { icon: Users, title: "Plan de mesas", desc: "Asigna invitados a mesas. Visible solo un día antes de la boda." },
];

const demos = [
  { slug: "demo-elegant", theme: "Elegante", couple: "Sofía & Daniel", color: "hsl(33, 30%, 40%)", gradient: "from-amber-800/20 to-amber-600/10" },
  { slug: "demo-romantic", theme: "Romántico", couple: "Isabella & Marco", color: "hsl(340, 45%, 55%)", gradient: "from-pink-600/20 to-rose-400/10" },
  { slug: "demo-rustic", theme: "Rústico", couple: "Elena & Pablo", color: "hsl(25, 50%, 32%)", gradient: "from-orange-900/20 to-orange-700/10" },
  { slug: "demo-modern", theme: "Moderno", couple: "Martina & Álex", color: "hsl(220, 25%, 18%)", gradient: "from-slate-800/20 to-slate-600/10" },
];

const testimonials = [
  { name: "Ana & Luis", text: "Nuestros invitados no paraban de decir lo bonita que era la página. ¡Y la playlist fue un éxito total!" },
  { name: "Marta, Wedding Planner", text: "Lo uso con todas mis parejas. Es rapidísimo de configurar y el resultado es espectacular." },
  { name: "Carlos & Elena", text: "El QR en las invitaciones de papel fue el toque perfecto. Moderno pero con encanto." },
];

/* ---- Animated counter hook ---- */
const useCounter = (target: number, duration = 1500) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, count };
};

/* ---- Scroll reveal hook ---- */
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
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Index = () => {
  const { openCheckout, loading } = usePaddleCheckout();
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBuy = (priceId: string) => {
    openCheckout({
      priceId,
      successUrl: `${window.location.origin}/dashboard?checkout=success`,
    });
  };

  // Stats counters
  const stat1 = useCounter(4);
  const stat2 = useCounter(15);
  const stat3 = useCounter(100);

  const navLinks = [
    { href: "#features", label: "Funcionalidades" },
    { href: "#demos", label: "Demos" },
    { href: "#pricing", label: "Precios" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PaymentTestModeBanner />

      {/* Sticky Navbar */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border" : "bg-transparent"}`}>
        <div className="container max-w-5xl flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <Heart className={`w-5 h-5 transition-colors ${scrolled ? "text-primary" : "text-primary-foreground"}`} />
            <span className={`font-heading text-lg sm:text-xl transition-colors ${scrolled ? "text-foreground" : "text-primary-foreground"}`}>Click Tu Boda</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className={`text-sm font-light transition-colors ${scrolled ? "text-muted-foreground hover:text-foreground" : "text-primary-foreground/70 hover:text-primary-foreground"}`}>
                {l.label}
              </a>
            ))}
            <Link to="/auth" className={`text-sm font-medium px-5 py-2 rounded-lg transition-all ${scrolled ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-primary-foreground/20 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/30"}`}>
              Crear mi boda
            </Link>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
            {mobileMenuOpen
              ? <X className={`w-5 h-5 ${scrolled ? "text-foreground" : "text-primary-foreground"}`} />
              : <Menu className={`w-5 h-5 ${scrolled ? "text-foreground" : "text-primary-foreground"}`} />
            }
          </button>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border px-6 pb-4 space-y-3">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
                {l.label}
              </a>
            ))}
            <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="block text-center text-sm font-medium px-5 py-2.5 rounded-lg bg-primary text-primary-foreground">
              Crear mi boda
            </Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Boda elegante"
            className={`w-full h-full object-cover transition-all duration-[1.5s] ${heroLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
            onLoad={() => setHeroLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/50 to-foreground/70" />
        </div>
        <div className={`relative z-10 text-center px-5 sm:px-6 max-w-3xl transition-all duration-1000 delay-500 ${heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-6 sm:mb-8">
            <Sparkles className="w-3.5 h-3.5 text-primary-foreground/80" />
            <span className="text-primary-foreground/80 text-[11px] sm:text-xs tracking-wider uppercase font-light">La web de bodas más bonita</span>
          </div>
          <h1 className="font-heading text-[2.75rem] sm:text-6xl md:text-7xl lg:text-8xl text-primary-foreground mb-4 sm:mb-6 leading-[0.95]">
            Tu boda merece<br />algo único
          </h1>
          <p className="text-primary-foreground/80 text-base sm:text-lg md:text-xl font-light mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed">
            Crea una experiencia digital inmersiva para tus invitados. Playlist, fotos, RSVP, mapa, agenda y mucho más.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/auth"
              className="group px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-primary-foreground text-foreground font-medium text-base sm:text-lg hover:shadow-xl hover:shadow-primary-foreground/20 hover:-translate-y-0.5 transition-all duration-300"
            >
              Crear mi boda
              <ArrowRight className="w-4 h-4 inline ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#demos"
              className="group px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl border-2 border-primary-foreground/30 text-primary-foreground font-light text-base sm:text-lg hover:bg-primary-foreground/10 hover:border-primary-foreground/50 transition-all duration-300"
            >
              <Play className="w-4 h-4 inline mr-2" />
              Ver demos en vivo
            </a>
          </div>
        </div>

        {/* Scroll indicator - hidden on very small screens */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-1.5">
            <div className="w-1 h-2.5 rounded-full bg-primary-foreground/60 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="py-6 sm:py-8 bg-card border-b border-border">
        <div className="container max-w-4xl grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-16 text-center px-6">
          <div ref={stat1.ref}>
            <p className="font-heading text-2xl sm:text-3xl text-foreground">{stat1.count}</p>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">Temas visuales</p>
          </div>
          <div ref={stat2.ref}>
            <p className="font-heading text-2xl sm:text-3xl text-foreground">{stat2.count}+</p>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">Secciones</p>
          </div>
          <div>
            <p className="font-heading text-2xl sm:text-3xl text-foreground">QR</p>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">Incluido</p>
          </div>
          <div ref={stat3.ref}>
            <p className="font-heading text-2xl sm:text-3xl text-foreground">{stat3.count}%</p>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">Personalizable</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-24 bg-secondary">
        <div className="container max-w-5xl px-5 sm:px-8">
          <RevealSection>
            <div className="text-center mb-10 sm:mb-16">
              <span className="inline-block text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3 sm:mb-4 font-light">Funcionalidades</span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-2 sm:mb-3">
                Todo lo que necesitas
              </h2>
              <p className="text-muted-foreground font-light text-base sm:text-lg max-w-lg mx-auto">
                12 funcionalidades para que tu boda sea inolvidable
              </p>
            </div>
          </RevealSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map((f, i) => (
              <RevealSection key={f.title} delay={i % 3 * 100}>
                <div className="bg-card border border-border rounded-xl p-5 sm:p-6 group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 h-full">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                    <f.icon className="w-4.5 h-4.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="font-heading text-lg mb-1 sm:mb-1.5">{f.title}</h3>
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
              <span className="inline-block text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3 sm:mb-4 font-light">Inspírate</span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-2 sm:mb-3">
                Demos en vivo
              </h2>
              <p className="text-muted-foreground font-light text-base sm:text-lg">
                Prueba cada estilo con datos reales
              </p>
            </div>
          </RevealSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {demos.map((d, i) => (
              <RevealSection key={d.slug} delay={i % 2 * 150}>
                <Link
                  to={`/w/${d.slug}`}
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
                      <p className="text-xs sm:text-sm text-muted-foreground">{d.theme}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-primary text-sm font-medium group-hover:gap-3 gap-1 transition-all duration-300">
                    Ver demo <ArrowRight className="w-4 h-4" />
                  </div>
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
              <span className="inline-block text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3 sm:mb-4 font-light">Cómo funciona</span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-2 sm:mb-3">
                Así de fácil
              </h2>
              <p className="text-muted-foreground font-light text-base sm:text-lg">
                En 3 pasos tienes tu web de boda lista
              </p>
            </div>
          </RevealSection>
          <div className="space-y-4 sm:space-y-6">
            {[
              { step: "1", title: "Regístrate", desc: "Crea tu cuenta en segundos y accede al panel de control." },
              { step: "2", title: "Personaliza tu boda", desc: "Elige un tema, añade los datos, sube fotos y configura cada sección." },
              { step: "3", title: "Comparte con un QR", desc: "Genera un código QR o envía el enlace por WhatsApp. ¡Listo!" },
            ].map((s, i) => (
              <RevealSection key={s.step} delay={i * 150}>
                <div className="flex gap-4 sm:gap-5 items-start bg-card border border-border rounded-xl p-5 sm:p-6 hover:shadow-md transition-all duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-heading text-lg sm:text-xl shadow-md">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="font-heading text-base sm:text-lg text-foreground mb-0.5 sm:mb-1">{s.title}</h3>
                    <p className="text-muted-foreground font-light text-sm">{s.desc}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container max-w-4xl px-5 sm:px-8">
          <RevealSection>
            <div className="text-center mb-10 sm:mb-16">
              <span className="inline-block text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3 sm:mb-4 font-light">Testimonios</span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-2 sm:mb-3">
                Lo que dicen las parejas
              </h2>
            </div>
          </RevealSection>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {testimonials.map((t, i) => (
              <RevealSection key={t.name} delay={i * 120}>
                <div className="bg-card border border-border rounded-xl p-5 sm:p-6 hover:shadow-md transition-all duration-300 h-full flex flex-col">
                  <div className="flex gap-1 mb-3 sm:mb-4">
                    {[1,2,3,4,5].map((s) => <Star key={s} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary fill-primary" />)}
                  </div>
                  <p className="text-foreground/80 text-sm font-light leading-relaxed mb-3 sm:mb-4 flex-1">"{t.text}"</p>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-24 bg-secondary">
        <div className="container max-w-5xl px-5 sm:px-8">
          <RevealSection>
            <div className="text-center mb-10 sm:mb-16">
              <span className="inline-block text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3 sm:mb-4 font-light">Precios</span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-2 sm:mb-3">
                Nuestros planes
              </h2>
              <p className="text-muted-foreground font-light text-base sm:text-lg">
                Elige el que mejor se adapte a tu día especial
              </p>
            </div>
          </RevealSection>

          {/* Mobile: stack with Completo first */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {/* Plan Completo - on mobile appears first via order */}
            <RevealSection delay={0} className="sm:order-2 order-first">
              <div className="bg-card border-2 border-primary rounded-xl p-6 sm:p-7 flex flex-col relative shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-4 py-1 rounded-full shadow-md">
                  Más popular
                </div>
                <h3 className="font-heading text-2xl text-foreground mb-1">Completo</h3>
                <div className="mb-3 sm:mb-4">
                  <span className="font-heading text-3xl sm:text-4xl text-foreground">65€</span>
                  <span className="text-muted-foreground text-sm ml-1">/ boda</span>
                </div>
                <p className="text-muted-foreground text-sm font-light mb-5 sm:mb-6">Todo incluido para una experiencia inolvidable.</p>
                <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 flex-1">
                  {[
                    "Todo lo del plan Básico",
                    "7 temas visuales disponibles",
                    "Playlist colaborativa con votos",
                    "Muro de fotos en vivo",
                    "Plan de mesas inteligente",
                    "Agenda del día completa",
                    "FAQ + Mapa interactivo",
                    "Lista de regalos / cuenta bancaria",
                    "Vuestra historia de amor",
                    "Compartir por WhatsApp",
                    "📊 Gestor de presupuesto completo",
                    "🎁 Control de regalos y agradecimientos",
                    "✅ Checklist de tareas de boda",
                    "Soporte 24 horas",
                    "Borrador de la web en 24h",
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
                  className="block w-full text-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? "Cargando..." : "Elegir Completo"}
                </button>
              </div>
            </RevealSection>

            {/* Plan Básico */}
            <RevealSection delay={100} className="sm:order-1">
              <div className="bg-card border border-border rounded-xl p-6 sm:p-7 flex flex-col h-full hover:shadow-lg transition-all duration-300">
                <h3 className="font-heading text-2xl text-foreground mb-1">Básico</h3>
                <div className="mb-3 sm:mb-4">
                  <span className="font-heading text-3xl sm:text-4xl text-foreground">35€</span>
                  <span className="text-muted-foreground text-sm ml-1">/ boda</span>
                </div>
                <p className="text-muted-foreground text-sm font-light mb-5 sm:mb-6">Ideal para parejas que quieren algo sencillo y bonito.</p>
                <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 flex-1">
                  {[
                    "Página web personalizada",
                    "1 tema visual a elegir",
                    "RSVP online",
                    "Código QR para invitaciones",
                    "Información de ceremonia y recepción",
                    "Cuenta atrás del gran día",
                    "Borrador de la web en 24h",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 sm:gap-2.5 text-sm text-foreground">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleBuy("basico_one_time")}
                  disabled={loading}
                  className="block w-full text-center px-6 py-3 rounded-xl border-2 border-primary text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? "Cargando..." : "Empezar"}
                </button>
              </div>
            </RevealSection>

            {/* Plan Wedding Planner */}
            <RevealSection delay={200} className="sm:order-3">
              <div className="bg-card border border-border rounded-xl p-6 sm:p-7 flex flex-col h-full hover:shadow-lg transition-all duration-300">
                <h3 className="font-heading text-2xl text-foreground mb-1">Organizador</h3>
                <div className="mb-3 sm:mb-4">
                  <span className="font-heading text-2xl sm:text-3xl text-foreground">A medida</span>
                </div>
                <p className="text-muted-foreground text-sm font-light mb-5 sm:mb-6">Para profesionales que gestionan múltiples bodas.</p>
                <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 flex-1">
                  {[
                    "Todo lo del plan Completo",
                    "Dashboard multi-boda",
                    "Bodas ilimitadas",
                    "QR individual por boda",
                    "Personalización avanzada",
                    "Sin marca de agua",
                    "Soporte prioritario 24h",
                    "Mantenimiento y ajustes incluidos",
                    "Borrador de cada web en 24h",
                    "Precios especiales por volumen",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 sm:gap-2.5 text-sm text-foreground">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => { setContactSubject("Plan Wedding Planner"); setContactOpen(true); }}
                  className="block w-full text-center px-6 py-3 rounded-xl border-2 border-primary text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  Contáctanos
                </button>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28 bg-background text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-accent blur-3xl" />
        </div>
        <RevealSection>
          <div className="container max-w-2xl relative z-10 px-5 sm:px-8">
            <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-primary mx-auto mb-5 sm:mb-6 opacity-60" />
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 sm:mb-4">
              ¿Listos para el gran día?
            </h2>
            <p className="text-muted-foreground font-light text-base sm:text-lg mb-8 sm:mb-10">
              Cread vuestra página de boda en minutos. Desde 35€.
            </p>
            <Link
              to="/auth"
              className="group inline-flex items-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl bg-primary text-primary-foreground font-medium text-base sm:text-lg hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300"
            >
              Crear mi boda
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </RevealSection>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 border-t border-border">
        <div className="container max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-5 sm:px-8">
          <p className="text-muted-foreground text-xs sm:text-sm font-light">
            © {new Date().getFullYear()} Click Tu Boda. Hecho con <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline text-primary" /> en España.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link to="/privacidad" className="hover:text-foreground transition-colors">Privacidad</Link>
            <Link to="/terminos" className="hover:text-foreground transition-colors">Términos</Link>
            <Link to="/reembolso" className="hover:text-foreground transition-colors">Reembolso</Link>
          </div>
        </div>
      </footer>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} subject={contactSubject} />
    </div>
  );
};

export default Index;
