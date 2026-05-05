declare global {
  interface Window {
    Paddle: any;
    profitwell: any;
    profitwellSnippetBase: any;
  }
}

const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN;
const paddleEnv = import.meta.env.VITE_PADDLE_ENV || "sandbox";

const PRICE_IDS: Record<string, string> = {
  basico_one_time: import.meta.env.VITE_PADDLE_PRICE_BASICO || "pri_01kqc1gvdwcc2tk0mearpjsw66",
  completo_one_time: import.meta.env.VITE_PADDLE_PRICE_COMPLETO || "pri_01kqc1d0ayrhfyjtgc0rdg6qez",
};

let paddleInitialized = false;

export async function initializePaddle() {
  if (paddleInitialized) return;
  if (!clientToken) {
    throw new Error("VITE_PAYMENTS_CLIENT_TOKEN is not set");
  }
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.onload = () => {
      if (!window.profitwell) {
        window.profitwell = () => {};
      }
      if (typeof (window.profitwell as any).q === "undefined") {
        (window.profitwell as any).q = [];
      }
      window.profitwellSnippetBase = window.profitwellSnippetBase || "";

      // Solo setear environment en sandbox
      if (paddleEnv === "sandbox") {
        window.Paddle.Environment.set("sandbox");
      }

      window.Paddle.Initialize({ token: clientToken });
      paddleInitialized = true;
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export async function getPaddlePriceId(priceId: string): Promise<string> {
  const resolved = PRICE_IDS[priceId];
  if (!resolved) {
    throw new Error(`Price ID not found: ${priceId}`);
  }
  return resolved;
}
