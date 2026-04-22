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
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 animate-fade-in">
      <div className="container max-w-2xl">
        <div className="bg-card border border-border rounded-2xl shadow-xl p-6">
          <div className="flex items-start gap-3">
            <Cookie className="w-6 h-6 text-primary mt-0.5 shrink-0" />
            <div className="flex-1 space-y-3">
              <p className="text-sm text-foreground leading-relaxed">
                Usamos cookies propias y de terceros para mejorar tu experiencia y analizar el tráfico.
                Puedes aceptar todas o solo las esenciales.{" "}
                <Link to="/privacidad" className="underline text-primary hover:opacity-80">
                  Política de privacidad
                </Link>
              </p>

              {showDetails && (
                <div className="text-xs text-muted-foreground space-y-2 border-t border-border pt-3">
                  <p>
                    <strong className="text-foreground">Esenciales:</strong> Necesarias para el
                    funcionamiento del sitio (sesión, preferencias). No se pueden desactivar.
                  </p>
                  <p>
                    <strong className="text-foreground">Analíticas:</strong> Nos ayudan a entender cómo
                    usas la web para mejorarla (Google Analytics).
                  </p>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => accept("all")}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Aceptar todas
                </button>
                <button
                  onClick={() => accept("essential")}
                  className="px-4 py-2 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-secondary transition-colors"
                >
                  Solo esenciales
                </button>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-xs text-muted-foreground underline hover:text-foreground transition-colors"
                >
                  {showDetails ? "Ocultar detalles" : "Más información"}
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
