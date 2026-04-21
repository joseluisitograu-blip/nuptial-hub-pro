import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyWebhook, EventName, type PaddleEnv } from '../_shared/paddle.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const env = (url.searchParams.get("env") || "sandbox") as PaddleEnv;

    const event = await verifyWebhook(req, env);
    console.log("Paddle event:", event.eventType, env);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const eventData = event.data as any;

    if (
      event.eventType === EventName.SubscriptionCreated ||
      event.eventType === EventName.SubscriptionUpdated
    ) {
      const userId = eventData.customData?.userId;
      if (!userId) {
        console.warn("No userId in customData");
        return new Response(JSON.stringify({ received: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const subscriptionData = {
        user_id: userId,
        paddle_subscription_id: eventData.id,
        paddle_customer_id: eventData.customerId,
        product_id: eventData.items?.[0]?.price?.productId || "",
        price_id: eventData.items?.[0]?.price?.id || "",
        status: eventData.status,
        current_period_start: eventData.currentBillingPeriod?.startsAt || null,
        current_period_end: eventData.currentBillingPeriod?.endsAt || null,
        cancel_at_period_end: eventData.scheduledChange?.action === "cancel",
        environment: env,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("subscriptions")
        .upsert(subscriptionData, { onConflict: "paddle_subscription_id" });

      if (error) console.error("Upsert error:", error);
    }

    if (event.eventType === EventName.SubscriptionCanceled) {
      const { error } = await supabase
        .from("subscriptions")
        .update({ status: "canceled", updated_at: new Date().toISOString() })
        .eq("paddle_subscription_id", eventData.id);

      if (error) console.error("Cancel update error:", error);
    }

    if (event.eventType === EventName.TransactionCompleted) {
      const userId = eventData.customData?.userId;
      if (userId && !eventData.subscriptionId) {
        // One-time purchase — store as a completed transaction
        const { error } = await supabase
          .from("purchases")
          .upsert({
            user_id: userId,
            paddle_transaction_id: eventData.id,
            paddle_customer_id: eventData.customerId,
            product_id: eventData.items?.[0]?.price?.productId || "",
            price_id: eventData.items?.[0]?.price?.id || "",
            status: "completed",
            environment: env,
            updated_at: new Date().toISOString(),
          }, { onConflict: "paddle_transaction_id" });

        if (error) console.error("Purchase upsert error:", error);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
