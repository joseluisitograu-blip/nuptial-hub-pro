import { Link } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { Heart, Sparkles, Users, Music, Camera, MapPin, Clock, HelpCircle, BookHeart, Gift, Share2, Star, ArrowRight, CheckCircle, Play, Instagram } from "lucide-react";
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
  { icon: HelpCircle, title: "FAQ inteligente", desc: "Preguntas frecuentes: parking, niños, dress code, alojamiento..." },
  { icon: Share2, title: "QR & WhatsApp", desc: "Comparte con un QR imprimible o directamente por WhatsApp." },
  { icon: Sparkles, title: "4 temas visuales", desc: "Elegant, Romantic, Rustic y Modern. Cada boda con su personalidad." },
  { icon: Users, title: "Sitting plan", desc: "Asigna invitados a mesas. Visible solo un día antes de la boda." },
];

const demos = [
  { slug: "demo-elegant", theme: "Elegant", couple: "Sofía & Daniel", color: "hsl(33, 30%, 40%)", gradient: "from-amber-800/20 to-amber-600/10" },
  { slug: "demo-romantic", theme: "Romantic", couple: "Isabella & Marco", color: "hsl(340, 45%, 55%)", gradient: "from-pink-600/20 to-rose-400/10" },
  { slug: "demo-rustic", theme: "Rustic", couple: "Elena & Pablo", color: "hsl(25, 50%, 32%)", gradient: "from-orange-900/20 to-orange-700/10" },
  { slug: "demo-modern", theme: "Modern", couple: "Martina & Álex", color: "hsl(220, 25%, 18%)", gradient: "from-slate-800/20 to-slate-600/10" },
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

  // Capture UTM params & discount code from URL (Google Ads, Instagram, etc.)
  const urlParams = new URLSearchParams(window.location.search);
  const discountCode = urlParams.get("code") || urlParams.get("discount") || undefined;
  const utmSource = urlParams.get("utm_source") || "";

  const handleBuy = (priceId: string) => {
    openCheckout({
      priceId,
      discountCode,
      successUrl: `${window.location.origin}/dashboard?checkout=success`,
      customData: {
        ...(utmSource ? { utm_source: utmSource, utm_medium: urlParams.get("utm_medium") || "", utm_campaign: urlParams.get("utm_campaign") || "" } : {}),
      },
    });
  };

  // Stats counters
  const stat1 = useCounter(4);
  const stat2 = useCounter(15);
  const stat3 = useCounter(100);

  return (
    <div className="min-h-screen bg-background">
      <PaymentTestModeBanner />

      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Boda elegante"
            className={`w-full h-full object-cover transition-all duration-[1.5s] ${heroLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
            onLoad={() => setHeroLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/50 to-foreground/70" />
        </div>
        <div className={`relative z-10 text-center px-6 max-w-3xl transition-all duration-1000 delay-500 ${heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-primary-foreground/80" />
            <span className="text-primary-foreground/80 text-xs tracking-wider uppercase font-light">La web de bodas más bonita</span>
          </div>
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-primary-foreground mb-6 leading-[0.95]">
            Tu boda merece<br />algo único
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl font-light mb-10 max-w-xl mx-auto leading-relaxed">
            Crea una experiencia digital inmersiva para tus invitados. Playlist, fotos, RSVP, mapa, agenda y mucho más.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="group px-8 py-4 rounded-xl bg-primary-foreground text-foreground font-medium text-lg hover:shadow-xl hover:shadow-primary-foreground/20 hover:-translate-y-0.5 transition-all duration-300"
            >
              Crear mi boda
              <ArrowRight className="w-4 h-4 inline ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#demos"
              className="group px-8 py-4 rounded-xl border-2 border-primary-foreground/30 text-primary-foreground font-light text-lg hover:bg-primary-foreground/10 hover:border-primary-foreground/50 transition-all duration-300"
            >
              <Play className="w-4 h-4 inline mr-2" />
              Ver demos en vivo
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-1.5">
            <div className="w-1 h-2.5 rounded-full bg-primary-foreground/60 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container max-w-4xl flex flex-wrap items-center justify-center gap-10 sm:gap-16 text-center">
          <div ref={stat1.ref}>
            <p className="font-heading text-3xl text-foreground">{stat1.count}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Temas visuales</p>
          </div>
          <div ref={stat2.ref}>
            <p className="font-heading text-3xl text-foreground">{stat2.count}+</p>
            <p className="text-xs text-muted-foreground mt-0.5">Secciones</p>
          </div>
          <div>
            <p className="font-heading text-3xl text-foreground">QR</p>
            <p className="text-xs text-muted-foreground mt-0.5">Incluido</p>
          </div>
          <div ref={stat3.ref}>
            <p className="font-heading text-3xl text-foreground">{stat3.count}%</p>
            <p className="text-xs text-muted-foreground mt-0.5">Personalizable</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-secondary">
        <div className="container max-w-5xl">
          <RevealSection>
            <div className="text-center mb-16">
              <span className="inline-block text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 font-light">Funcionalidades</span>
              <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-3">
                Todo lo que necesitas
              </h2>
              <p className="text-muted-foreground font-light text-lg max-w-lg mx-auto">
                12 funcionalidades para que tu boda sea inolvidable
              </p>
            </div>
          </RevealSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <RevealSection key={f.title} delay={i % 3 * 100}>
                <div className="bg-card border border-border rounded-xl p-6 group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 h-full">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                    <f.icon className="w-4.5 h-4.5 text-muted-foreground group-hover:text-primary transition-colors" />
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
      <section id="demos" className="py-24 bg-background">
        <div className="container max-w-4xl">
          <RevealSection>
            <div className="text-center mb-16">
              <span className="inline-block text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 font-light">Inspírate</span>
              <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-3">
                Demos en vivo
              </h2>
              <p className="text-muted-foreground font-light text-lg">
                Prueba cada estilo con datos reales
              </p>
            </div>
          </RevealSection>
          <div className="grid sm:grid-cols-2 gap-5">
            {demos.map((d, i) => (
              <RevealSection key={d.slug} delay={i % 2 * 150}>
                <Link
                  to={`/w/${d.slug}`}
                  className={`group bg-gradient-to-br ${d.gradient} bg-card border border-border rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: d.color }}
                    >
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl text-foreground">{d.couple}</h3>
                      <p className="text-sm text-muted-foreground">{d.theme}</p>
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
      <section className="py-24 bg-secondary">
        <div className="container max-w-3xl">
          <RevealSection>
            <div className="text-center mb-16">
              <span className="inline-block text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 font-light">Cómo funciona</span>
              <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-3">
                Así de fácil
              </h2>
              <p className="text-muted-foreground font-light text-lg">
                En 3 pasos tienes tu web de boda lista
              </p>
            </div>
          </RevealSection>
          <div className="space-y-6">
            {[
              { step: "1", title: "Regístrate", desc: "Crea tu cuenta en segundos y accede al panel de control." },
              { step: "2", title: "Personaliza tu boda", desc: "Elige un tema, añade los datos, sube fotos y configura cada sección." },
              { step: "3", title: "Comparte con un QR", desc: "Genera un código QR o envía el enlace por WhatsApp. ¡Listo!" },
            ].map((s, i) => (
              <RevealSection key={s.step} delay={i * 150}>
                <div className="flex gap-5 items-start bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-heading text-xl shadow-md">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="font-heading text-lg text-foreground mb-1">{s.title}</h3>
                    <p className="text-muted-foreground font-light text-sm">{s.desc}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-background">
        <div className="container max-w-4xl">
          <RevealSection>
            <div className="text-center mb-16">
              <span className="inline-block text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 font-light">Testimonios</span>
              <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-3">
                Lo que dicen las parejas
              </h2>
            </div>
          </RevealSection>
          <div className="grid sm:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <RevealSection key={t.name} delay={i * 120}>
                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-300 h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map((s) => <Star key={s} className="w-4 h-4 text-primary fill-primary" />)}
                  </div>
                  <p className="text-foreground/80 text-sm font-light leading-relaxed mb-4 flex-1">"{t.text}"</p>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-secondary">
        <div className="container max-w-5xl">
          <RevealSection>
            <div className="text-center mb-16">
              <span className="inline-block text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 font-light">Precios</span>
              <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-3">
                Nuestros planes
              </h2>
              <p className="text-muted-foreground font-light text-lg">
                Elige el que mejor se adapte a tu día especial
              </p>
            </div>
          </RevealSection>
          <div className="grid sm:grid-cols-3 gap-6">
            {/* Plan Básico */}
            <RevealSection delay={0}>
              <div className="bg-card border border-border rounded-xl p-7 flex flex-col h-full hover:shadow-lg transition-all duration-300">
                <h3 className="font-heading text-2xl text-foreground mb-1">Básico</h3>
                <div className="mb-4">
                  <span className="font-heading text-4xl text-foreground">35€</span>
                  <span className="text-muted-foreground text-sm ml-1">/ boda</span>
                </div>
                <p className="text-muted-foreground text-sm font-light mb-6">Ideal para parejas que quieren algo sencillo y bonito.</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {[
                    "Página web personalizada",
                    "1 tema visual a elegir",
                    "RSVP online",
                    "Código QR para invitaciones",
                    "Información de ceremonia y recepción",
                    "Countdown del gran día",
                    "Borrador de la web en 24h",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
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

            {/* Plan Completo */}
            <RevealSection delay={150}>
              <div className="bg-card border-2 border-primary rounded-xl p-7 flex flex-col relative shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-4 py-1 rounded-full shadow-md">
                  Más popular
                </div>
                <h3 className="font-heading text-2xl text-foreground mb-1">Completo</h3>
                <div className="mb-4">
                  <span className="font-heading text-4xl text-foreground">65€</span>
                  <span className="text-muted-foreground text-sm ml-1">/ boda</span>
                </div>
                <p className="text-muted-foreground text-sm font-light mb-6">Todo incluido para una experiencia inolvidable.</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {[
                    "Todo lo del plan Básico",
                    "4 temas visuales disponibles",
                    "Playlist colaborativa con votos",
                    "Muro de fotos en vivo",
                    "Sitting plan inteligente",
                    "Agenda del día completa",
                    "FAQ + Mapa interactivo",
                    "Lista de regalos / cuenta bancaria",
                    "Vuestra historia de amor",
                    "Compartir por WhatsApp",
                    "Mantenimiento y ajustes incluidos",
                    "Soporte 24 horas",
                    "Borrador de la web en 24h",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
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

            {/* Plan Wedding Planner */}
            <RevealSection delay={300}>
              <div className="bg-card border border-border rounded-xl p-7 flex flex-col h-full hover:shadow-lg transition-all duration-300">
                <h3 className="font-heading text-2xl text-foreground mb-1">Wedding Planner</h3>
                <div className="mb-4">
                  <span className="font-heading text-3xl text-foreground">A medida</span>
                </div>
                <p className="text-muted-foreground text-sm font-light mb-6">Para profesionales que gestionan múltiples bodas.</p>
                <ul className="space-y-3 mb-8 flex-1">
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
                    <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
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
      <section className="py-28 bg-background text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-accent blur-3xl" />
        </div>
        <RevealSection>
          <div className="container max-w-2xl relative z-10">
            <Heart className="w-8 h-8 text-primary mx-auto mb-6 opacity-60" />
            <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
              ¿Listos para el gran día?
            </h2>
            <p className="text-muted-foreground font-light text-lg mb-10">
              Cread vuestra página de boda en minutos. Desde 35€.
            </p>
            <Link
              to="/auth"
              className="group inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-primary text-primary-foreground font-medium text-lg hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300"
            >
              Crear mi boda
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </RevealSection>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm font-light">
            © {new Date().getFullYear()} Click Tu Boda. Hecho con <Heart className="w-3.5 h-3.5 inline text-primary" /> en España.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="https://instagram.com/clicktuboda" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" title="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
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
