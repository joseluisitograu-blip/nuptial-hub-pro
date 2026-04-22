import { useState, useEffect, useCallback, useMemo } from "react";
import { Heart } from "lucide-react";

interface Props {
  partner1: string;
  partner2: string;
  weddingDate?: string | null;
  onComplete: () => void;
}

interface Petal {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
  opacity: number;
}

const WeddingIntro = ({ partner1, partner2, weddingDate, onComplete }: Props) => {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");

  const petals = useMemo<Petal[]>(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 4,
      size: 8 + Math.random() * 14,
      rotation: Math.random() * 360,
      opacity: 0.3 + Math.random() * 0.5,
    })),
  []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("visible"), 100);
    const t2 = setTimeout(() => setPhase("exit"), 3200);
    const t3 = setTimeout(onComplete, 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    setPhase("exit");
    setTimeout(onComplete, 600);
  }, [onComplete]);

  const formattedDate = weddingDate
    ? new Date(weddingDate).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background cursor-pointer transition-opacity duration-700 ${
        phase === "exit" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      onClick={handleSkip}
    >
      {/* Falling petals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {petals.map((p) => (
          <div
            key={p.id}
            className="absolute"
            style={{
              left: `${p.left}%`,
              top: "-20px",
              animation: `petal-fall ${p.duration}s ${p.delay}s ease-in infinite`,
              opacity: p.opacity,
            }}
          >
            <Heart
              className="text-primary fill-primary"
              style={{
                width: p.size,
                height: p.size,
                transform: `rotate(${p.rotation}deg)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div
        className={`relative z-10 text-center px-6 transition-all duration-1000 ${
          phase === "enter"
            ? "opacity-0 scale-90"
            : phase === "visible"
            ? "opacity-100 scale-100"
            : "opacity-0 scale-110"
        }`}
      >
        <div className="mb-6">
          <Heart className="w-8 h-8 text-primary mx-auto animate-pulse" />
        </div>
        <p className="font-body text-muted-foreground tracking-[0.3em] uppercase text-[10px] sm:text-xs mb-4">
          ¡Nos casamos!
        </p>
        <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-foreground leading-[0.9] mb-3">
          {partner1}
          <span className="block text-xl sm:text-2xl font-body font-light tracking-widest my-2 text-muted-foreground">
            &amp;
          </span>
          {partner2}
        </h1>
        {formattedDate && (
          <p className="font-body text-muted-foreground text-sm sm:text-base mt-4 tracking-wide">
            {formattedDate}
          </p>
        )}
        <p className="text-muted-foreground/50 text-xs mt-8 animate-pulse">
          Toca para continuar
        </p>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes petal-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.5; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default WeddingIntro;
