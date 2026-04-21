import { Link } from "react-router-dom";
import { Heart, Sparkles, Users, Music, Camera, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-wedding.jpg";

const features = [
  { icon: Heart, title: "Página inmersiva", desc: "Experiencia a pantalla completa con animaciones y navegación por secciones" },
  { icon: Users, title: "RSVP online", desc: "Tus invitados confirman asistencia, alergias y acompañantes" },
  { icon: Music, title: "Playlist colaborativa", desc: "Que tus invitados sugieran y voten las canciones de la fiesta" },
  { icon: Camera, title: "Muro de fotos", desc: "Todos comparten sus mejores fotos del día en un muro en vivo" },
  { icon: MapPin, title: "Mapa interactivo", desc: "Ubicación exacta de la ceremonia y la celebración" },
  { icon: Sparkles, title: "100% personalizable", desc: "Nombres, fechas, colores, cuenta bancaria y más" },
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
          <Heart className="w-10 h-10 text-primary-foreground/60 mx-auto mb-6" />
          <h1 className="font-heading text-5xl md:text-7xl text-primary-foreground mb-6 leading-tight">
            Tu boda, tu experiencia
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl font-light mb-10 max-w-xl mx-auto">
            Crea una página de boda inmersiva y única. Playlist colaborativa, muro de fotos, RSVP y mucho más.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="px-8 py-4 rounded-xl bg-primary-foreground text-foreground font-medium text-lg hover:opacity-90 transition-opacity"
            >
              Crear mi boda
            </Link>
            <a
              href="#features"
              className="px-8 py-4 rounded-xl border-2 border-primary-foreground/40 text-primary-foreground font-light text-lg hover:bg-primary-foreground/10 transition-colors"
            >
              Descubrir más
            </a>
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
              Una experiencia de boda diferente a todo lo que has visto
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-card border border-border rounded-xl p-7 group hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <f.icon className="w-5 h-5 text-sand-accent" />
                </div>
                <h3 className="font-heading text-xl mb-2">{f.title}</h3>
                <p className="text-muted-foreground font-light text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
            Empezar ahora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border text-center">
        <p className="text-muted-foreground text-sm font-light">
          Hecho con <Heart className="w-3.5 h-3.5 inline text-sand-accent" /> para los días más bonitos
        </p>
      </footer>
    </div>
  );
};

export default Index;
