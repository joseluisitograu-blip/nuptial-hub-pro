import { useEffect, useState } from "react";

interface Props {
  targetDate: Date;
}

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
      <div className="grid grid-cols-4 gap-4 md:gap-8">
        {units.map((u) => (
          <div key={u.label}>
            <span className="font-heading text-5xl md:text-7xl text-foreground block">
              {String(u.value).padStart(2, "0")}
            </span>
            <span className="text-muted-foreground text-xs uppercase tracking-[0.2em] mt-2 block">
              {u.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeddingCountdown;
