// Módulo central de analytics — único punto de contacto con GA4.
// Importa `track`, `trackPurchase`, etc. en lugar de llamar window.gtag directamente.

type EventName =
  | "page_view"
  | "purchase"
  | "begin_checkout"
  | "scroll_depth"
  | "view_pricing"
  | "clic_crear_boda"
  | "clic_comprar"
  | "clic_comprar_dashboard"
  | "clic_publicar_editor"
  | "clic_ver_demos"
  | "clic_demo"
  | "crear_boda_click"
  | "guardar_boda"
  | "registro_intento"
  | "registro_exitoso"
  | "login_intento"
  | "login_exitoso"
  | "rsvp_completado"
  | "compra_completada"
  | (string & Record<never, never>); // permite strings arbitrarios sin perder autocompletado

export function track(event: EventName, params?: Record<string, unknown>): void {
  window.gtag?.("event", event, params);
}

export function trackPageView(path: string, title: string): void {
  window.gtag?.("event", "page_view", {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
}

export function trackPurchase(plan: "basico" | "completo"): void {
  const value = plan === "basico" ? 30 : 60;
  // GA4 ecommerce — requiere `items` para atribución de revenue
  track("purchase", {
    transaction_id: `txn_${Date.now()}`,
    value,
    currency: "EUR",
    items: [
      {
        item_id: `plan_${plan}`,
        item_name: plan === "basico" ? "Plan Básico BodasFácil" : "Plan Completo BodasFácil",
        item_category: "web_de_boda",
        price: value,
        quantity: 1,
      },
    ],
  });
  // Evento custom adicional para filtros en GA
  track("compra_completada", { plan, value, currency: "EUR" });
}

export function trackBeginCheckout(plan: "basico" | "completo"): void {
  const value = plan === "basico" ? 30 : 60;
  track("begin_checkout", {
    value,
    currency: "EUR",
    items: [
      {
        item_id: `plan_${plan}`,
        item_name: plan === "basico" ? "Plan Básico BodasFácil" : "Plan Completo BodasFácil",
        item_category: "web_de_boda",
        price: value,
        quantity: 1,
      },
    ],
  });
}
