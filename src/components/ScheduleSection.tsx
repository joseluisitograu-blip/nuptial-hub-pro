const events = [
  { time: "17:00", title: "Ceremonia", description: "Iglesia de Santa María" },
  { time: "18:30", title: "Cóctel de bienvenida", description: "Jardines de la finca" },
  { time: "19:30", title: "Banquete", description: "Salón principal" },
  { time: "22:00", title: "Primer baile", description: "Pista de baile" },
  { time: "22:30", title: "Barra libre & fiesta", description: "Hasta el amanecer 🎉" },
];

const ScheduleSection = () => {
  return (
    <section className="py-24 bg-secondary">
      <div className="container max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-2">
            Programa del día
          </h2>
          <p className="text-muted-foreground font-light">
            Para que no os perdáis ni un momento
          </p>
        </div>
        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-12">
            {events.map((event, i) => (
              <div
                key={i}
                className={`relative flex items-center gap-6 md:gap-12 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className={`hidden md:block flex-1 ${i % 2 === 0 ? "text-right" : "text-left"}`}>
                  <h3 className="font-heading text-xl">{event.title}</h3>
                  <p className="text-muted-foreground text-sm font-light">{event.description}</p>
                </div>
                <div className="relative z-10 w-16 h-16 rounded-full bg-background border-2 border-accent flex items-center justify-center shrink-0">
                  <span className="text-sm font-medium text-foreground">{event.time}</span>
                </div>
                <div className={`flex-1 md:block ${i % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                  <div className="md:hidden">
                    <h3 className="font-heading text-xl">{event.title}</h3>
                    <p className="text-muted-foreground text-sm font-light">{event.description}</p>
                  </div>
                  <div className="hidden md:block" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;
