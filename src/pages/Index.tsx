import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Heart, Sparkles, Users, Music, Camera, MapPin, Clock, HelpCircle, BookHeart, Gift, Share2, ArrowRight, CheckCircle, Play, Menu, X, Wallet, ListChecks, Shield, Zap, RefreshCcw, Star } from "lucide-react";
import heroImage from "@/assets/hero-wedding.webp";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import ContactModal from "@/components/ContactModal";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

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
  { name: "Laura & Sergio", location: "Valencia", text: "Nuestros invitados no paraban de decir lo bonita que era la web. El plan de mesas fue un salvavidas." },
  { name: "Marta & Pau", location: "Barcelona", text: "La playlist colaborativa fue lo mejor. Cada invitado puso su canción y la pista no se vació en toda la noche." },
  { name: "Ana & Roberto", location: "Madrid", text: "En 20 minutos teníamos todo listo. Ni un solo mensaje de WhatsApp preguntando dónde era la boda." },
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
    window.gtag?.("event", "clic_comprar", { plan: priceId });
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
              onClick={() => window.gtag?.("event", "clic_crear_boda", { location: "navbar" })}
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
              onClick={() => { setMobileMenuOpen(false); window.gtag?.("event", "clic_crear_boda", { location: "navbar_mobile" }); }}
              className="block text-center text-sm font-medium px-5 py-2.5 rounded-lg bg-primary text-primary-foreground"
            >
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
            alt="Pareja celebrando su boda al aire libre con decoración elegante"
            className={`w-full h-full object-cover transition-all duration-[2s] ${heroLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
            onLoad={() => setHeroLoaded(true)}
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-foreground/45 to-foreground/75" />
        </div>
        <div className={`relative z-10 text-center px-5 sm:px-6 max-w-3xl transition-all duration-1000 delay-300 ${heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-6 sm:mb-8">
            <Sparkles className="w-3.5 h-3.5 text-primary-foreground/80" />
            <span className="text-primary-foreground/80 text-[11px] sm:text-xs tracking-wider uppercase font-light">Más de 12 funcionalidades · Desde 30€</span>
          </div>
          <h1 className="font-heading text-[2.75rem] sm:text-6xl md:text-7xl lg:text-8xl text-primary-foreground mb-4 sm:mb-6 leading-[0.95] text-balance">
            Crea la web de<br />tu boda perfecta
          </h1>
          <p className="text-primary-foreground/85 text-base sm:text-lg md:text-xl font-light mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed">
            RSVP, playlist colaborativa, plan de mesas, fotos en vivo y mucho más. Lista en minutos. Desde 30€, pago único.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/auth"
              onClick={() => window.gtag?.("event", "clic_crear_boda", { location: "hero" })}
              className="group px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-primary-foreground text-foreground font-medium text-base sm:text-lg hover:shadow-2xl hover:shadow-primary-foreground/25 hover:-translate-y-0.5 transition-all duration-300"
            >
              Empezar desde 30€
              <ArrowRight className="w-4 h-4 inline ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#demos"
              onClick={() => window.gtag?.("event", "clic_ver_demos", { location: "hero" })}
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
              <span className="text-primary-foreground/80 text-xs font-light">Más de 50 bodas creadas</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 text-primary-foreground/60 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Pago seguro</span>
            <span className="flex items-center gap-1.5"><RefreshCcw className="w-3.5 h-3.5" /> 30 días de garantía</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Lista en minutos</span>
          </div>
        </div>
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-1.5">
            <div className="w-1 h-2.5 rounded-full bg-primary-foreground/60 animate-bounce" />
          </div>
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
                  onClick={() => window.gtag?.("event", "clic_demo", { demo: d.slug })}
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
              { step: "1", title: "Regístrate gratis", desc: "Crea tu cuenta en segundos. Sin compromiso, sin tarjeta de crédito." },
              { step: "2", title: "Personaliza tu boda", desc: "Elige un tema, añade vuestros datos, sube fotos y configura cada sección a vuestro gusto." },
              { step: "3", title: "Comparte con un QR", desc: "Genera un código QR para imprimir en las invitaciones o envía el enlace por WhatsApp. ¡Listo!" },
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
                <div className="bg-card border border-border rounded-xl p-6 h-full">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-foreground/80 font-light text-sm leading-relaxed mb-4">"{t.text}"</p>
                  <div>
                    <p className="font-heading text-sm text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </div>
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
            <div className="flex items-center justify-center gap-3 mb-8 sm:mb-10">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>30 días de garantía de devolución</span>
              </div>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {/* Plan Completo */}
            <RevealSection delay={0} className="sm:order-2 order-first">
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
                  className="block w-full text-center px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg"
                >
                  {loading ? "Cargando..." : "Elegir Completo →"}
                </button>
              </div>
            </RevealSection>

            {/* Plan Básico */}
            <RevealSection delay={100} className="sm:order-1">
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
                  className="block w-full text-center px-6 py-3.5 rounded-xl border-2 border-primary text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? "Cargando..." : "Empezar →"}
                </button>
              </div>
            </RevealSection>

            {/* Plan Organizador */}
            <RevealSection delay={200} className="sm:order-3">
              <div className="bg-card border border-border rounded-xl p-6 sm:p-7 flex flex-col h-full hover:shadow-lg transition-all duration-300">
                <h3 className="font-heading text-2xl text-foreground mb-1">Organizador</h3>
                <div className="mb-3 sm:mb-4">
                  <span className="font-heading text-2xl sm:text-3xl text-foreground">A medida</span>
                </div>
                <p className="text-muted-foreground text-sm font-light mb-5 sm:mb-6">Para profesionales con múltiples bodas.</p>
                <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 flex-1">
                  {[
                    "Todo lo del plan Completo",
                    "Dashboard multi-boda",
                    "Bodas ilimitadas",
                    "QR individual por boda",
                    "Personalización avanzada",
                    "Sin marca de agua",
                    "Soporte prioritario 24h",
                    "Mantenimiento incluido",
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
                  className="block w-full text-center px-6 py-3.5 rounded-xl border-2 border-primary text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  Contáctanos →
                </button>
              </div>
            </RevealSection>
          </div>
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
              { q: "¿Es un pago único o una suscripción?", a: "Pago único. Pagas una sola vez y tu web de boda es tuya para siempre. Sin renovaciones ni cargos ocultos." },
              { q: "¿Puedo ver mi web antes de pagar?", a: "Sí. Puedes registrarte gratis y explorar todas las demos en vivo. Solo pagas cuando quieras crear tu propia boda." },
              { q: "¿Mis invitados necesitan registrarse?", a: "No. Tus invitados acceden directamente con el enlace o QR. No necesitan cuenta ni descargar nada." },
              { q: "¿Cuánto tarda en estar lista?", a: "Puedes tener tu página lista en minutos. Si eliges que te hagamos un borrador, lo tienes en 24 horas." },
              { q: "¿Y si no me convence?", a: "Tienes 30 días de garantía de devolución sin preguntas. Solicita tu reembolso y te devolvemos el 100%." },
              { q: "¿Puedo cambiar el diseño después?", a: "Sí. Puedes cambiar el tema, los colores, las fotos y todo el contenido cuantas veces quieras." },
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
              ¿Listos para el gran día?
            </h2>
            <p className="text-muted-foreground font-light text-base sm:text-lg mb-4">
              Cread vuestra página de boda en minutos. Desde 30€, pago único.
            </p>
            <p className="text-muted-foreground/60 text-sm mb-8 sm:mb-10">
              30 días de garantía · Pago seguro con Paddle · Sin suscripciones
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/auth"
                onClick={() => window.gtag?.("event", "clic_crear_boda", { location: "final_cta" })}
                className="group inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl bg-primary text-primary-foreground font-medium text-base sm:text-lg hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300"
              >
                Empezar desde 30€
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#demos"
                className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl border-2 border-border text-foreground font-light text-base sm:text-lg hover:bg-card transition-all duration-300"
              >
                Ver demos
              </a>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 border-t border-border bg-background">
        <div className="container max-w-4xl px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              <span className="font-heading text-foreground">BodasFácil</span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <Link to="/privacidad" className="hover:text-foreground transition-colors">Privacidad</Link>
              <Link to="/terminos" className="hover:text-foreground transition-colors">Términos</Link>
              <Link to="/reembolso" className="hover:text-foreground transition-colors">Reembolso</Link>
              <Link to="/cookies" className="hover:text-foreground transition-colors">Cookies</Link>
              <button onClick={() => { setContactSubject(""); setContactOpen(true); }} className="hover:text-foreground transition-colors">
                Contacto
              </button>
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
    </div>
  );
};

export default Index;
