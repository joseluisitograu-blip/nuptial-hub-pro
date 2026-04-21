import { Link } from "react-router-dom";
import { Heart, Sparkles, Users, Music, Camera, MapPin, Clock, HelpCircle, BookHeart, Gift, Share2, Star, ArrowRight, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-wedding.jpg";

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
  { slug: "demo-elegant", theme: "Elegant", couple: "Sofía & Daniel", color: "hsl(33, 30%, 40%)" },
  { slug: "demo-romantic", theme: "Romantic", couple: "Isabella & Marco", color: "hsl(340, 45%, 55%)" },
  { slug: "demo-rustic", theme: "Rustic", couple: "Elena & Pablo", color: "hsl(25, 50%, 32%)" },
  { slug: "demo-modern", theme: "Modern", couple: "Martina & Álex", color: "hsl(220, 25%, 18%)" },
];

const testimonials = [
  { name: "Ana & Luis", text: "Nuestros invitados no paraban de decir lo bonita que era la página. ¡Y la playlist fue un éxito total!" },
  { name: "Marta, Wedding Planner", text: "Lo uso con todas mis parejas. Es rapidísimo de configurar y el resultado es espectacular." },
  { name: "Carlos & Elena", text: "El QR en las invitaciones de papel fue el toque perfecto. Moderno pero con encanto." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Boda" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/50" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <p className="text-primary-foreground/60 tracking-[0.4em] uppercase text-xs mb-6 font-body">La web de bodas más bonita</p>
          <h1 className="font-heading text-5xl md:text-7xl text-primary-foreground mb-6 leading-tight">
            Tu boda merece<br />algo único
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl font-light mb-10 max-w-xl mx-auto">
            Crea una experiencia digital inmersiva para tus invitados. Playlist, fotos, RSVP, mapa, agenda y mucho más.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="px-8 py-4 rounded-xl bg-primary-foreground text-foreground font-medium text-lg hover:opacity-90 transition-opacity"
            >
              Crear mi boda gratis
            </Link>
            <a
              href="#demos"
              className="px-8 py-4 rounded-xl border-2 border-primary-foreground/40 text-primary-foreground font-light text-lg hover:bg-primary-foreground/10 transition-colors"
            >
              Ver demos en vivo
            </a>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="py-6 bg-card border-b border-border">
        <div className="container max-w-4xl flex flex-wrap items-center justify-center gap-8 text-center">
          <div>
            <p className="font-heading text-2xl text-foreground">4</p>
            <p className="text-xs text-muted-foreground">Temas visuales</p>
          </div>
          <div>
            <p className="font-heading text-2xl text-foreground">15+</p>
            <p className="text-xs text-muted-foreground">Secciones</p>
          </div>
          <div>
            <p className="font-heading text-2xl text-foreground">QR</p>
            <p className="text-xs text-muted-foreground">Incluido</p>
          </div>
          <div>
            <p className="font-heading text-2xl text-foreground">100%</p>
            <p className="text-xs text-muted-foreground">Personalizable</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-secondary">
        <div className="container max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-3">
              Todo lo que necesitas
            </h2>
            <p className="text-muted-foreground font-light text-lg">
              12 funcionalidades para que tu boda sea inolvidable
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-card border border-border rounded-xl p-6 group hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-4.5 h-4.5 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-lg mb-1.5">{f.title}</h3>
                <p className="text-muted-foreground font-light text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demos */}
      <section id="demos" className="py-24 bg-background">
        <div className="container max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-3">
              Demos en vivo
            </h2>
            <p className="text-muted-foreground font-light text-lg">
              Prueba cada estilo con datos reales. Compártelos con tus clientes.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {demos.map((d) => (
              <Link
                key={d.slug}
                to={`/w/${d.slug}`}
                className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: d.color }}>
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl text-foreground">{d.couple}</h3>
                    <p className="text-sm text-muted-foreground">{d.theme}</p>
                  </div>
                </div>
                <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                  Ver demo <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-secondary">
        <div className="container max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-3">
              Así de fácil
            </h2>
            <p className="text-muted-foreground font-light text-lg">
              En 3 pasos tienes tu web de boda lista
            </p>
          </div>
          <div className="space-y-6">
            {[
              { step: "1", title: "Regístrate gratis", desc: "Crea tu cuenta en segundos y accede al panel de control." },
              { step: "2", title: "Personaliza tu boda", desc: "Elige un tema, añade los datos, sube fotos y configura cada sección." },
              { step: "3", title: "Comparte con un QR", desc: "Genera un código QR o envía el enlace por WhatsApp. ¡Listo!" },
            ].map((s) => (
              <div key={s.step} className="flex gap-5 items-start bg-card border border-border rounded-xl p-6">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-heading text-lg">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-heading text-lg text-foreground mb-1">{s.title}</h3>
                  <p className="text-muted-foreground font-light text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-background">
        <div className="container max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-3">
              Lo que dicen las parejas
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-card border border-border rounded-xl p-6">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map((s) => <Star key={s} className="w-4 h-4 text-primary fill-primary" />)}
                </div>
                <p className="text-foreground/80 text-sm font-light leading-relaxed mb-4">"{t.text}"</p>
                <p className="text-sm font-medium text-foreground">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-secondary">
        <div className="container max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-3">
              Nuestros planes
            </h2>
            <p className="text-muted-foreground font-light text-lg">
              Elige el que mejor se adapte a tu día especial
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {/* Plan Básico */}
            <div className="bg-card border border-border rounded-xl p-7 flex flex-col">
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
              <Link
                to="/auth"
                className="block text-center px-6 py-3 rounded-xl border-2 border-primary text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Empezar
              </Link>
            </div>

            {/* Plan Completo */}
            <div className="bg-card border-2 border-primary rounded-xl p-7 flex flex-col relative shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-4 py-1 rounded-full">
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
              <Link
                to="/auth"
                className="block text-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                Elegir Completo
              </Link>
            </div>

            {/* Plan Wedding Planner */}
            <div className="bg-card border border-border rounded-xl p-7 flex flex-col">
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
              <a
                href="mailto:hola@nuptialhub.com"
                className="block text-center px-6 py-3 rounded-xl border-2 border-primary text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Contáctanos
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-background text-center">
        <div className="container max-w-2xl">
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
            ¿Listos para el gran día?
          </h2>
          <p className="text-muted-foreground font-light text-lg mb-10">
            Cread vuestra página de boda en minutos. Gratis.
          </p>
          <Link
            to="/auth"
            className="inline-block px-10 py-4 rounded-xl bg-primary text-primary-foreground font-medium text-lg hover:opacity-90 transition-opacity"
          >
            Crear mi boda
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border text-center">
        <p className="text-muted-foreground text-sm font-light">
          Hecho con <Heart className="w-3.5 h-3.5 inline text-primary" /> para los días más bonitos
        </p>
      </footer>
    </div>
  );
};

export default Index;
