import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Plus, ExternalLink, LogOut, Heart, MessageCircle, ChevronDown, ChevronUp, Lock, Mail, BarChart3, Gift, Wallet, ListChecks } from "lucide-react";
import WeddingStats from "@/components/dashboard/WeddingStats";
import ExportRsvps from "@/components/dashboard/ExportRsvps";
import DashboardMessages from "@/components/dashboard/DashboardMessages";
import WeddingBudget from "@/components/dashboard/WeddingBudget";
import WeddingGifts from "@/components/dashboard/WeddingGifts";
import WeddingChecklist from "@/components/dashboard/WeddingChecklist";
import { usePurchase } from "@/hooks/usePurchase";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import { useToast } from "@/hooks/use-toast";

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
  const { hasPurchase, loading: purchaseLoading, isOwner, isCompleto } = usePurchase();
  const { openCheckout, loading: checkoutLoading } = usePaddleCheckout();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      toast({ title: "¡Pago completado!", description: "Ya puedes crear tu boda." });
      searchParams.delete("checkout");
      setSearchParams(searchParams, { replace: true });
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
      setLoading(false);
    };
    fetchWeddings();
  }, [user]);

  const createWedding = async () => {
    if (!user) return;
    setCreating(true);
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
    openCheckout({
      priceId,
      customerEmail: user?.email || undefined,
      customData: { userId: user?.id || "" },
      successUrl: `${window.location.origin}/dashboard?checkout=success`,
    });
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
        <div className="animate-pulse font-heading text-2xl text-muted-foreground">Cargando...</div>
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
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          <span className="font-heading text-xl">Mis Bodas</span>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" /> Salir
        </button>
      </header>

      <div className="container max-w-4xl py-12">
        {!hasPurchase ? (
          <div className="text-center py-20">
            <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-40" />
            <h2 className="font-heading text-3xl text-foreground mb-3">
              Elige tu plan para empezar
            </h2>
            <p className="text-muted-foreground font-light mb-8 max-w-md mx-auto">
              Selecciona un plan y crea la web de vuestra boda en minutos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleBuy("basico_one_time")}
                disabled={checkoutLoading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-primary text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-all"
              >
                Básico · 35€
              </button>
              <button
                onClick={() => handleBuy("completo_one_time")}
                disabled={checkoutLoading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                Completo · 65€
              </button>
            </div>
          </div>
        ) : weddings.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-40" />
            <h2 className="font-heading text-3xl text-foreground mb-3">
              Crea tu primera boda
            </h2>
            <p className="text-muted-foreground font-light mb-8 max-w-md mx-auto">
              Diseña una experiencia única e inmersiva para compartir con tus invitados.
            </p>
            <button
              onClick={createWedding}
              disabled={creating}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" /> Crear boda
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-3xl">Tus bodas</h2>
              <button
                onClick={createWedding}
                disabled={creating}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" /> Nueva boda
              </button>
            </div>
            <div className="grid gap-4">
              {weddings.map((w) => {
                const isExpanded = expandedId === w.id;
                return (
                  <div
                    key={w.id}
                    className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-heading text-xl">
                          {w.partner1_name && w.partner2_name
                            ? `${w.partner1_name} & ${w.partner2_name}`
                            : "Sin nombre aún"}
                        </h3>
                        <p className="text-muted-foreground text-sm font-light">
                          /{w.slug}
                          {w.wedding_date &&
                            ` · ${new Date(w.wedding_date).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleExpand(w.id)}
                          className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground"
                          title="Ver gestión"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(
                            `¡Hola! Os recordamos que nuestra boda se acerca. 💍 Toda la info aquí: ${window.location.origin}/w/${w.slug}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-md hover:bg-secondary transition-colors text-primary"
                          title="Enviar recordatorio por WhatsApp"
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
                      <div className="mt-4">
                        {/* Tab navigation */}
                        <div className="flex gap-1 border-b border-border mb-4">
                          {tabs.map((tab) => (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                                activeTab === tab.id
                                  ? "border-primary text-primary"
                                  : "border-transparent text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {tab.icon} {tab.label}
                            </button>
                          ))}
                        </div>

                        {/* Tab content */}
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
                            <p className="text-foreground font-medium mb-1">Funcionalidad exclusiva del plan Completo</p>
                            <p className="text-muted-foreground text-sm mb-4">Gestiona presupuesto, regalos y checklist de tu boda.</p>
                            <button
                              onClick={() => handleBuy("completo_one_time")}
                              disabled={checkoutLoading}
                              className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                            >
                              Actualizar a Completo · 65€
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
