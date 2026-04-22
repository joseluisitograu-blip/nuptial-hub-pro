import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { gatewayFetch, type PaddleEnv } from '../_shared/paddle.ts';

const responseHeaders = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
    "Content-Type": "application/json",
  },
};

const ALLOWED_PRICE_IDS = new Set([
  "basico_one_time",
  "completo_one_time",
]);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, responseHeaders);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      ...responseHeaders,
    });
  }

  const { priceId, environment } = body;

  if (!priceId || typeof priceId !== "string" || priceId.length > 100) {
    return new Response(JSON.stringify({ error: "priceId required" }), {
      status: 400,
      ...responseHeaders,
    });
  }

  if (!ALLOWED_PRICE_IDS.has(priceId)) {
    return new Response(JSON.stringify({ error: "Invalid priceId" }), {
      status: 400,
      ...responseHeaders,
    });
  }

  const env = (environment === "live" ? "live" : "sandbox") as PaddleEnv;

  const response = await gatewayFetch(env, `/prices?external_id=${encodeURIComponent(priceId)}`);
  const data = await response.json();

  if (!data.data?.length) {
    return new Response(JSON.stringify({ error: "Price not found" }), {
      status: 404,
      ...responseHeaders,
    });
  }

  return new Response(JSON.stringify({ paddleId: data.data[0].id }), responseHeaders);
});
