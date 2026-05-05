import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN || "";
    const environment = clientToken.startsWith("test_") ? "sandbox" : "live";

    const fetchData = async () => {
      // Comprobar rol admin
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin");

      const adminRole = roles && roles.length > 0;
      setIsOwner(adminRole);

      if (adminRole) {
        setHasPurchase(true);
        setLoading(false);
        return;
      }

      // Comprobar compras completadas
      const { data } = await supabase
        .from("purchases")
        .select("product_id, plan")
        .eq("user_id", user.id)
        .eq("environment", environment)
        .eq("status", "completed")
        .limit(1)
        .maybeSingle();

      setHasPurchase(!!data);
      setProductId(data?.product_id ?? null);
      setPlan(data?.plan ?? null);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const isCompleto =
    isOwner ||
    (productId || "").toLowerCase().includes("completo") ||
    (plan || "").toLowerCase().includes("completo");

  return { hasPurchase, productId, loading, isOwner, isCompleto };
}
