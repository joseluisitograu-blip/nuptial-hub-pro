import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import { Link } from "react-router-dom";

const COOKIE_KEY = "ctb_cookie_consent";

type Consent = "all" | "essential" | null;

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = (consent: Consent) => {
    if (!consent) return;
    localStorage.setItem(COOKIE_KEY, consent);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 animate-fade-in">
      <div className="container max-w-2xl">
        <div className="bg-card border border-border rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <Cookie className="w-5 h-5 sm:w-6 sm:h-6 text-primary mt-0.5 shrink-0" />
            <div className="flex-1 space-y-2.5 sm:space-y-3">
              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                Usamos cookies para mejorar tu experiencia y analizar el tráfico.{" "}
                <Link to="/cookies" className="underline text-primary hover:opacity-80">
                  Política de cookies
                </Link>
              </p>

              {showDetails && (
                <div className="text-[11px] sm:text-xs text-muted-foreground space-y-1.5 sm:space-y-2 border-t border-border pt-2.5 sm:pt-3">
                  <p>
                    <strong className="text-foreground">Esenciales:</strong> Necesarias para el
                    funcionamiento del sitio (sesión, preferencias).
                  </p>
                  <p>
                    <strong className="text-foreground">Analíticas:</strong> Nos ayudan a entender cómo
                    usas la web para mejorarla.
                  </p>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => accept("all")}
                  className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-primary text-primary-foreground text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Aceptar todas
                </button>
                <button
                  onClick={() => accept("essential")}
                  className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-border text-foreground text-xs sm:text-sm font-medium hover:bg-secondary transition-colors"
                >
                  Solo esenciales
                </button>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-[11px] sm:text-xs text-muted-foreground underline hover:text-foreground transition-colors"
                >
                  {showDetails ? "Ocultar" : "Más info"}
                </button>
              </div>
            </div>
            <button
              onClick={() => accept("essential")}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;

export function hasCookieConsent(type: "all" | "essential" = "all"): boolean {
  const stored = localStorage.getItem(COOKIE_KEY);
  if (type === "essential") return !!stored;
  return stored === "all";
}
