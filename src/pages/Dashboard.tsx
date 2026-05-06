
import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Plus, ExternalLink, LogOut, Heart, MessageCircle, ChevronDown, ChevronUp, Lock, Mail, BarChart3, Gift, Wallet, ListChecks, CheckCircle, ArrowRight, Sparkles, Copy, Check } from "lucide-react";
import WeddingStats from "@/components/dashboard/WeddingStats";
import ExportRsvps from "@/components/dashboard/ExportRsvps";
import DashboardMessages from "@/components/dashboard/DashboardMessages";
import WeddingBudget from "@/components/dashboard/WeddingBudget";
import WeddingGifts from "@/components/dashboard/WeddingGifts";
import WeddingChecklist from "@/components/dashboard/WeddingChecklist";
import { usePurchase } from "@/hooks/usePurchase";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

interface Wedding {
  id: string;
  slug: string;
  partner1_name: string;
  partner2_name: string;
  wedding_date: string | null;
}

type WeddingTab = "stats" | "budget" | "gifts" | "checklist";

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<WeddingTab>("stats");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const { hasPurchase, loading: purchaseLoading, isOwner, isCompleto } = usePurchase();
  const { openCheckout, loading: checkoutLoading } = usePaddleCheckout();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const robots = document.querySelector('meta[name="robots"]');
    const prev = robots?.getAttribute("content") ?? "index, follow";
    robots?.setAttribute("content", "noindex, nofollow");
    return () => { robots?.setAttribute("content", prev); };
  }, []);

  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      const plan = searchParams.get("plan") || "completo";
      const value = plan === "basico" ? 30 : 60;
      window.gtag?.("event", "purchase", {
        transaction_id: `txn_${Date.now()}`,
        value,
        currency: "EUR",
      });
      window.gtag?.("event", "compra_completada", { plan });
      toast({ title: "¡Pago completado! 🎉", description: "Tu boda ya está activa. ¡Enhorabuena!" });
      searchParams.delete("checkout");
      searchParams.delete("plan");
      setSearchParams(searchParams, { replace: true });
      // Recarga tras 2,5s para que el webhook de Paddle haya llegado y usePurchase refleje el pago
      setTimeout(() => window.location.reload(), 2500);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchWeddings = async () => {
      const { data } = await supabase
        .from("weddings")
        .select("id, slug, partner1_name, partner2_name, wedding_date")
        .eq("user_id", user.id);
      const valid = (data || []).filter(
        (w) => w.partner1_name || w.partner2_name || w.wedding_date
      );
      setWeddings(valid);
      if (valid.length > 0) setExpandedId(valid[0].id);
      setLoading(false);
    };
    fetchWeddings();
  }, [user]);

  const createWedding = async () => {
    if (!user) return;
    setCreating(true);
    window.gtag?.("event", "crear_boda_click", {});
    const slug = `boda-${Date.now().toString(36)}`;
    const { data, error } = await supabase
      .from("weddings")
      .insert({ user_id: user.id, slug, partner1_name: "", partner2_name: "" })
      .select("id")
      .single();
    if (!error && data) {
      navigate(`/dashboard/edit/${data.id}`);
    }
    setCreating(false);
  };

  const handleBuy = (priceId: string) => {
    const plan = priceId.includes("basico") ? "basico" : "completo";
    window.gtag?.("event", "clic_comprar_dashboard", { plan });
    openCheckout({
      priceId,
      customerEmail: user?.email || undefined,
      customData: { userId: user?.id || "" },
      successUrl: `${window.location.origin}/dashboard?checkout=success&plan=${plan}`,
    });
  };

  const handleCopyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/w/${slug}`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleToggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      setActiveTab("stats");
    }
  };

  if (authLoading || loading || purchaseLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Heart className="w-8 h-8 text-primary animate-pulse" />
      </div>
    );
  }

  const tabs: { id: WeddingTab; label: string; icon: React.ReactNode; requiresCompleto?: boolean }[] = [
    { id: "stats", label: "Resumen", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "checklist", label: "Checklist", icon: <ListChecks className="w-4 h-4" />, requiresCompleto: true },
    { id: "budget", label: "Presupuesto", icon: <Wallet className="w-4 h-4" />, requiresCompleto: true },
    { id: "gifts", label: "Regalos", icon: <Gift className="w-4 h-4" />, requiresCompleto: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-md z-40">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          <span className="font-heading text-xl">BodasFácil</span>
        </div>
        <div className="flex items-center gap-4">
          {!hasPurchase && (
            <button
              onClick={() => handleBuy("completo_one_time")}
              disabled={checkoutLoading}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Sparkles className="w-4 h-4" /> Publicar mi boda · desde 30€
            </button>
          )}
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </header>

      <div className="container max-w-4xl py-8 sm:py-12 px-4 sm:px-8">

        {/* Banner de upgrade */}
        {!hasPurchase && weddings.length > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 sm:p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-medium text-foreground mb-1">Tu boda está lista 🎉 Solo falta publicarla</p>
              <p className="text-muted-foreground text-sm font-light">Elige un plan para que tus invitados puedan verla. Pago único, sin suscripciones.</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={() => handleBuy("basico_one_time")}
                disabled={checkoutLoading}
                className="px-4 py-2 rounded-lg border-2 border-primary text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all whitespace-nowrap"
              >
                Básico · 30€
              </button>
              <button
                onClick={() => handleBuy("completo_one_time")}
                disabled={checkoutLoading}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Completo · 60€ ⭐
              </button>
            </div>
          </div>
        )}

        {/* Onboarding — sin compra y sin bodas */}
        {!hasPurchase && weddings.length === 0 && (
          <div className="text-center py-12 sm:py-20">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-3">
              Bienvenido a BodasFácil 💍
            </h2>
            <p className="text-muted-foreground font-light mb-2 max-w-md mx-auto">
              Empieza creando vuestra boda. Es gratis explorar y personalizar — solo pagas cuando queráis publicarla.
            </p>
            <p className="text-muted-foreground/60 text-sm mb-8">Desde 30€, pago único, sin suscripciones.</p>
            <button
              onClick={createWedding}
              disabled={creating}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-medium text-lg hover:opacity-90 transition-opacity mb-8"
            >
              <Plus className="w-5 h-5" /> {creating ? "Creando..." : "Crear mi boda gratis"}
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto mt-4">
              {["Personaliza el diseño", "Añade tu información", "Publica cuando estés listo"].map((s, i) => (
                <div key={s} className="flex items-center gap-2 text-sm text-muted-foreground bg-card border border-border rounded-lg p-3">
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 font-medium">{i + 1}</span>
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lista de bodas */}
        {weddings.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl sm:text-3xl">Tus bodas</h2>
              <button
                onClick={createWedding}
                disabled={creating}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" /> {creating ? "Creando..." : "Nueva boda"}
              </button>
            </div>
            <div className="grid gap-4">
              {weddings.map((w) => {
                const isExpanded = expandedId === w.id;
                const weddingUrl = `${window.location.origin}/w/${w.slug}`;
                return (
                  <div key={w.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between p-5 sm:p-6">
                      <div>
                        <h3 className="font-heading text-lg sm:text-xl">
                          {w.partner1_name && w.partner2_name
                            ? `${w.partner1_name} & ${w.partner2_name}`
                            : "Sin nombre aún"}
                        </h3>
                        <p className="text-muted-foreground text-sm font-light">
                          /{w.slug}
                          {w.wedding_date && ` · ${new Date(w.wedding_date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}`}
                        </p>
                        {!hasPurchase && (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 mt-1">
                            <Lock className="w-3 h-3" /> Sin publicar
                          </span>
                        )}
                        {hasPurchase && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 border border-green-200 rounded-full px-2 py-0.5 mt-1">
                            <CheckCircle className="w-3 h-3" /> Publicada
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleExpand(w.id)}
                          className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleCopyLink(w.slug)}
                          className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground"
                          title="Copiar enlace"
                        >
                          {copiedSlug === w.slug ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`¡Hola! Os recordamos que nuestra boda se acerca. 💍 Toda la info aquí: ${weddingUrl}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-md hover:bg-secondary transition-colors text-primary"
                          title="Compartir por WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <Link
                          to={`/w/${w.slug}`}
                          className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground"
                          title="Ver página"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/dashboard/edit/${w.id}`}
                          className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                          Editar
                        </Link>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-border px-5 sm:px-6 pt-4 pb-5">
                        <div className="flex gap-1 border-b border-border mb-4 overflow-x-auto scrollbar-hide">
                          {tabs.map((tab) => (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${
                                activeTab === tab.id
                                  ? "border-primary text-primary"
                                  : "border-transparent text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {tab.icon} {tab.label}
                              {tab.requiresCompleto && !isCompleto && <Lock className="w-3 h-3 ml-1 opacity-40" />}
                            </button>
                          ))}
                        </div>

                        {activeTab === "stats" && (
                          <>
                            <WeddingStats weddingId={w.id} />
                            <div className="mt-3 flex justify-end">
                              <ExportRsvps weddingId={w.id} />
                            </div>
                          </>
                        )}
                        {activeTab === "budget" && isCompleto && <WeddingBudget weddingId={w.id} />}
                        {activeTab === "gifts" && isCompleto && <WeddingGifts weddingId={w.id} />}
                        {activeTab === "checklist" && isCompleto && <WeddingChecklist weddingId={w.id} />}
                        {(activeTab === "budget" || activeTab === "gifts" || activeTab === "checklist") && !isCompleto && (
                          <div className="text-center py-10">
                            <Lock className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                            <p className="text-foreground font-medium mb-1">Exclusivo del plan Completo</p>
                            <p className="text-muted-foreground text-sm mb-4">Gestiona presupuesto, regalos y checklist de tu boda.</p>
                            <button
                              onClick={() => handleBuy("completo_one_time")}
                              disabled={checkoutLoading}
                              className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                            >
                              Actualizar a Completo · 60€
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {isOwner && (
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-6">
              <Mail className="w-5 h-5 text-primary" />
              <h2 className="font-heading text-2xl">Mensajes</h2>
            </div>
            <DashboardMessages />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
