// Tipos globales de Window — centraliza la declaración para que no se repita en cada componente.
export {};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
