import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const OWNER_EMAIL = "joseluisitograu@gmail.com";

interface PurchaseInfo {
  hasPurchase: boolean;
  productId: string | null;
  loading: boolean;
  isOwner: boolean;
  isCompleto: boolean;
}

export function usePurchase(): PurchaseInfo {
  const { user } = useAuth();
  const [hasPurchase, setHasPurchase] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isOwner = user?.email === OWNER_EMAIL;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (isOwner) {
      setHasPurchase(true);
      setLoading(false);
      return;
    }

    const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN || "";
    const environment = clientToken.startsWith("test_") ? "sandbox" : "live";

    const fetchPurchase = async () => {
      const { data } = await supabase
        .from("purchases")
        .select("product_id")
        .eq("user_id", user.id)
        .eq("environment", environment)
        .eq("status", "completed")
        .limit(1)
        .maybeSingle();

      setHasPurchase(!!data);
      setProductId(data?.product_id ?? null);
      setLoading(false);
    };

    fetchPurchase();
  }, [user, isOwner]);

  return { hasPurchase, productId, loading, isOwner };
}
