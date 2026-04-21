import heroImage from "@/assets/hero-wedding.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Decoración de boda"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/30" />
      </div>
      <div className="relative z-10 text-center px-6 animate-fade-in-up">
        <p className="font-body text-primary-foreground/80 tracking-[0.3em] uppercase text-sm mb-4">
          ¡Nos casamos!
        </p>
        <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl text-primary-foreground mb-6 leading-tight">
          María & Carlos
        </h1>
        <div className="flex items-center justify-center gap-4 text-primary-foreground/90 font-body text-lg">
          <span>15 de Junio, 2026</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground/60" />
          <span>Sevilla</span>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-primary-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
