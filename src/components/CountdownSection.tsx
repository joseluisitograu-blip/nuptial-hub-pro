import { useEffect, useState } from "react";

const WEDDING_DATE = new Date("2026-06-15T17:00:00");

const CountdownSection = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const diff = WEDDING_DATE.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const units = [
    { label: "Días", value: timeLeft.days },
    { label: "Horas", value: timeLeft.hours },
    { label: "Minutos", value: timeLeft.minutes },
    { label: "Segundos", value: timeLeft.seconds },
  ];

  return (
    <section className="py-20 bg-secondary">
      <div className="container max-w-4xl text-center">
        <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-2">
          Cuenta atrás
        </h2>
        <p className="text-muted-foreground mb-12 font-light">
          Cada segundo cuenta para el gran día
        </p>
        <div className="grid grid-cols-4 gap-4 md:gap-8">
          {units.map((unit) => (
            <div key={unit.label} className="flex flex-col items-center">
              <span className="font-heading text-5xl md:text-7xl text-foreground">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="text-muted-foreground text-xs md:text-sm uppercase tracking-widest mt-2">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CountdownSection;
