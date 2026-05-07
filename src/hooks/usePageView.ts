import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";

// Dispara un page_view GA4 en cada cambio de ruta de React Router.
// Indispensable en SPAs: sin este hook, GA solo ve la primera página cargada.
export function usePageView() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Delay mínimo para que React actualice document.title antes de leer
    const id = setTimeout(() => {
      trackPageView(pathname + search, document.title);
    }, 80);
    return () => clearTimeout(id);
  }, [pathname, search]);
}
