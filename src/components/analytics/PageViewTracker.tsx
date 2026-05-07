import { usePageView } from "@/hooks/usePageView";

// Componente sin UI — solo registra page_view en GA4 en cada cambio de ruta.
// Debe estar dentro de <BrowserRouter> para tener acceso a useLocation().
export function PageViewTracker() {
  usePageView();
  return null;
}
