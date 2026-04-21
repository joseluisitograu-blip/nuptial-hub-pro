import { useEffect, useState, useRef } from "react";

interface Props {
  targetDate: Date;
}

const FlipUnit = ({ value, label }: { value: number; label: string }) => {
  const display = String(value).padStart(2, "0");
  const prevRef = useRef(display);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (prevRef.current !== display) {
      setFlipping(true);
      const t = setTimeout(() => setFlipping(false), 500);
      prevRef.current = display;
      return () => clearTimeout(t);
    }
  }, [display]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28">
        {/* Card background */}
        <div className="absolute inset-0 rounded-xl bg-card border border-border shadow-lg overflow-hidden">
          {/* Top half */}
          <div className="absolute inset-0 h-1/2 flex items-end justify-center overflow-hidden bg-card">
            <span className="font-heading text-4xl sm:text-5xl md:text-6xl text-foreground translate-y-1/2">
              {display}
            </span>
          </div>
          {/* Divider */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-border z-10" />
          {/* Bottom half */}
          <div className="absolute inset-0 top-1/2 flex items-start justify-center overflow-hidden bg-card/95">
            <span className="font-heading text-4xl sm:text-5xl md:text-6xl text-foreground -translate-y-1/2">
              {display}
            </span>
          </div>
        </div>
        {/* Flip animation overlay */}
        {flipping && (
          <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-20">
            <div className="absolute inset-0 h-1/2 origin-bottom animate-flip-top bg-card border border-border flex items-end justify-center overflow-hidden">
              <span className="font-heading text-4xl sm:text-5xl md:text-6xl text-foreground translate-y-1/2">
                {prevRef.current}
              </span>
            </div>
          </div>
        )}
      </div>
      <span className="text-muted-foreground text-[10px] sm:text-xs uppercase tracking-[0.2em] mt-3 block">
        {label}
      </span>
    </div>
  );
};

const WeddingCountdown = ({ targetDate }: Props) => {
  const getTimeLeft = () => {
    const diff = targetDate.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: "Días", value: timeLeft.days },
    { label: "Horas", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Seg", value: timeLeft.seconds },
  ];

  return (
    <div className="container max-w-3xl text-center">
      <div className="flex justify-center gap-3 sm:gap-5 md:gap-8">
        {units.map((u) => (
          <FlipUnit key={u.label} value={u.value} label={u.label} />
        ))}
      </div>
    </div>
  );
};

export default WeddingCountdown;
