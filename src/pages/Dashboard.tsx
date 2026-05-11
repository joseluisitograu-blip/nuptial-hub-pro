
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
import { track, trackPurchase, trackBeginCheckout } from "@/lib/analytics";


interface Wedding {
  id: string;
  slug: string;
  partner1_name: string;
  partner2_name: string;
  wedding_date: string | null;
  is_published: boolean;
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
      const plan = (searchParams.get("plan") || "completo") as "basico" | "completo";
      trackPurchase(plan);
      toast({ title: "¡Pago completado! 🎉", description: "Tu boda ya está publicada. ¡Enhorabuena!" });
      searchParams.delete("checkout");
      searchParams.delete("plan");
      setSearchParams(searchParams, { replace: true });
      // Tras 2,5s (webhook de Paddle procesado), publicar las bodas del usuario y recargar
      setTimeout(async () => {
        if (user) {
          await supabase.from("weddings").update({ is_published: true } as any).eq("user_id", user.id);
        }
        window.location.reload();
      }, 2500);
    }
  }, [searchParams, user]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchWeddings = async () => {
      const { data } = await supabase
        .from("weddings")
        .select("id, slug, partner1_name, partner2_name, wedding_date, is_published")
        .eq("user_id", user.id);
      const valid = data || [];
      setWeddings(valid);
      if (valid.length > 0) setExpandedId(valid[0].id);
      setLoading(false);
    };
    fetchWeddings();
  }, [user]);

  const createWedding = async () => {
    if (!user) return;
    setCreating(true);
    track("crear_boda_click");
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
    const plan = priceId.includes("basico") ? "basico" : "completo" as "basico" | "completo";
    trackBeginCheckout(plan);
    track("clic_comprar_dashboard", { plan });
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

        {/* Banner de upgrade — comparativa de planes */}
        {!hasPurchase && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 sm:p-6 mb-8">
            <div className="mb-4">
              <p className="font-medium text-foreground mb-0.5">
                {weddings.length > 0 ? "Tu boda está lista 🎉 Solo falta publicarla" : "Elige tu plan cuando estés lista 💍"}
              </p>
              <p className="text-muted-foreground text-sm font-light">Pago único para siempre. Sin suscripciones. 30 días de garantía.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {/* Plan Básico */}
              <div className="bg-card rounded-xl border border-border p-4">
                <div className="mb-3">
                  <p className="font-heading text-lg leading-none">Básico</p>
                  <p className="font-heading text-2xl mt-1">30€ <span className="text-sm text-muted-foreground font-normal">pago único</span></p>
                </div>
                <ul className="space-y-1.5 mb-4">
                  {["RSVP online + ver confirmaciones", "Playlist colaborativa de invitados", "Muro de fotos en vivo", "Código QR · 1 tema visual"].map(f => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleBuy("basico_one_time")} disabled={checkoutLoading}
                  className="w-full py-2.5 rounded-lg border-2 border-primary text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all">
                  Publicar con Básico →
                </button>
              </div>
              {/* Plan Completo */}
              <div className="bg-card rounded-xl border-2 border-primary p-4 relative">
                <div className="absolute -top-3 left-4 bg-primary text-primary-foreground text-xs font-medium px-3 py-0.5 rounded-full shadow-sm">⭐ Más popular</div>
                <div className="mb-3">
                  <p className="font-heading text-lg leading-none">Completo</p>
                  <p className="font-heading text-2xl mt-1">60€ <span className="text-sm text-muted-foreground font-normal">pago único</span></p>
                </div>
                <ul className="space-y-1.5 mb-4">
                  {["Todo lo del plan Básico", "12 temas visuales disponibles", "📊 Gestor de presupuesto (14 cat.)", "🎁 Control de regalos y agradecimientos", "✅ Checklist profesional (18 tareas)"].map(f => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleBuy("completo_one_time")} disabled={checkoutLoading}
                  className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity shadow-md">
                  Publicar con Completo →
                </button>
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-3">Pago seguro con Paddle · 30 días de garantía sin preguntas</p>
          </div>
        )}

        {/* Onboarding — sin bodas */}
        {weddings.length === 0 && (
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
                const isEmpty = !w.partner1_name && !w.partner2_name;
                const isExpanded = expandedId === w.id;
                const weddingUrl = `${window.location.origin}/w/${w.slug}`;

                /* ── Onboarding card for empty weddings ── */
                if (isEmpty) {
                  return (
                    <div key={w.id} className="bg-card border-2 border-primary/30 rounded-xl p-5 sm:p-6 animate-fade-in">
                      <div className="mb-4">
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">Boda creada ✓</span>
                        <h3 className="font-heading text-xl mt-3">¡Ahora personalízala en 3 pasos!</h3>
                        <p className="text-muted-foreground text-sm mt-0.5">Tarda menos de 5 minutos. Gratis hasta que la publiques.</p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <Link
                          to={`/dashboard/edit/${w.id}?tab=pareja`}
                          className="flex items-start gap-3 p-4 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                        >
                          <span className="text-xl flex-shrink-0 mt-0.5">💑</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm leading-tight">1. Añade vuestros nombres</p>
                            <p className="text-xs opacity-75 mt-0.5">Y la fecha de la boda</p>
                          </div>
                          <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        </Link>
                        <Link
                          to={`/dashboard/edit/${w.id}?tab=diseno`}
                          className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all"
                        >
                          <span className="text-xl flex-shrink-0 mt-0.5">🎨</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm leading-tight text-foreground">2. Elige un tema</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Elegante, rústico, romántico...</p>
                          </div>
                          <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
                        </Link>
                        <Link
                          to={`/w/${w.slug}`}
                          className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all"
                        >
                          <span className="text-xl flex-shrink-0 mt-0.5">👁️</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm leading-tight text-foreground">3. Previsualiza tu boda</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Así la verán tus invitados</p>
                          </div>
                          <ExternalLink className="w-4 h-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
                        </Link>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={w.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 justify-between p-4 sm:p-6">
                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-heading text-lg sm:text-xl truncate">
                          {w.partner1_name && w.partner2_name
                            ? `${w.partner1_name} & ${w.partner2_name}`
                            : "Sin nombre aún"}
                        </h3>
                        <p className="text-muted-foreground text-xs sm:text-sm font-light truncate">
                          /{w.slug}
                          {w.wedding_date && ` · ${new Date(w.wedding_date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}`}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {!w.is_published && (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                              <Lock className="w-3 h-3" /> Sin publicar
                            </span>
                          )}
                          {w.is_published && (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                              <CheckCircle className="w-3 h-3" /> Publicada
                            </span>
                          )}
                          {w.wedding_date && (() => {
                            const days = Math.ceil((new Date(w.wedding_date).getTime() - Date.now()) / 86400000);
                            if (days > 0 && days <= 365) return (
                              <span className="inline-flex items-center gap-1 text-xs text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5">
                                ⏳ {days} días
                              </span>
                            );
                            return null;
                          })()}
                        </div>
                        {/* Completion bar */}
                        {!w.is_published && (() => {
                          const filled = [w.partner1_name, w.partner2_name, w.wedding_date].filter(Boolean).length;
                          const pct = Math.round((filled / 3) * 100);
                          if (pct === 100) return null;
                          return (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-primary/50 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                              </div>
                              <Link to={`/dashboard/edit/${w.id}?tab=pareja`} className="text-[10px] text-primary/70 hover:text-primary shrink-0 font-medium transition-colors">
                                {pct === 0 ? "Personaliza →" : `${pct}% — continuar →`}
                              </Link>
                            </div>
                          );
                        })()}
                      </div>
                      {/* Acciones */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Solo desktop */}
                        <button
                          onClick={() => handleCopyLink(w.slug)}
                          className="hidden sm:flex p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground"
                          title="Copiar enlace"
                        >
                          {copiedSlug === w.slug ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`¡Hola! Os recordamos que nuestra boda se acerca. 💍 Toda la info aquí: ${weddingUrl}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hidden sm:flex p-2 rounded-md hover:bg-secondary transition-colors text-primary"
                          title="Compartir por WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <Link
                          to={`/w/${w.slug}`}
                          className="hidden sm:flex p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground"
                          title="Ver página"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/dashboard/edit/${w.id}`}
                          className="px-3 sm:px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleToggleExpand(w.id)}
                          className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    {/* Acciones móvil — dentro del expandido */}
                    {isExpanded && (
                      <div className="sm:hidden flex items-center gap-2 px-4 pb-3">
                        <button
                          onClick={() => handleCopyLink(w.slug)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-muted-foreground text-xs hover:text-foreground transition-colors"
                        >
                          {copiedSlug === w.slug ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                          Copiar enlace
                        </button>
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`¡Hola! Os recordamos que nuestra boda se acerca. 💍 Toda la info aquí: ${weddingUrl}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-primary text-xs hover:opacity-80 transition-opacity"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                        </a>
                        <Link
                          to={`/w/${w.slug}`}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-muted-foreground text-xs hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Ver web
                        </Link>
                      </div>
                    )}

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
                              {tab.requiresCompleto && !isCompleto && <span className="text-[9px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full ml-1 leading-none">PREVIEW</span>}
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
                        {activeTab === "budget" && !isCompleto && (
                          <div className="space-y-4">
                            <div className="relative overflow-hidden rounded-xl border border-border">
                              <div className="p-4 space-y-3 select-none pointer-events-none">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Vista previa — datos de ejemplo</p>
                                {[
                                  { cat: "🏛️ Lugar / Finca", est: "8.000€", pct: 80 },
                                  { cat: "🍽️ Catering", est: "6.800€", pct: 68 },
                                  { cat: "📸 Fotografía / Vídeo", est: "2.200€", pct: 22 },
                                  { cat: "💐 Flores / Decoración", est: "1.200€", pct: 12 },
                                  { cat: "🎵 Música / DJ", est: "800€", pct: 8 },
                                ].map((item) => (
                                  <div key={item.cat}>
                                    <div className="flex justify-between text-xs mb-1.5">
                                      <span className="text-foreground">{item.cat}</span>
                                      <span className="font-medium text-foreground">{item.est}</span>
                                    </div>
                                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                      <div className="h-full bg-primary rounded-full" style={{ width: `${item.pct}%` }} />
                                    </div>
                                  </div>
                                ))}
                                <div className="flex justify-between items-center pt-3 border-t border-border mt-3">
                                  <span className="text-sm font-medium">Total estimado</span>
                                  <span className="font-heading text-xl text-primary">19.000€</span>
                                </div>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                            </div>
                            <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl text-center">
                              <Wallet className="w-10 h-10 text-primary mx-auto mb-3" />
                              <h4 className="font-heading text-lg mb-1">Controla cada euro de tu boda</h4>
                              <p className="text-muted-foreground text-sm mb-1">14 categorías · Seguimiento en tiempo real · Sin sorpresas</p>
                              <p className="text-xs text-muted-foreground/70 mb-4">Las parejas que usan el gestor detectan desviaciones a tiempo y ahorran de media 800€.</p>
                              <button onClick={() => handleBuy("completo_one_time")} disabled={checkoutLoading}
                                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity text-sm w-full sm:w-auto">
                                Desbloquear con Plan Completo · 60€ →
                              </button>
                              <p className="text-xs text-muted-foreground mt-3">30 días de garantía · Pago único para siempre</p>
                            </div>
                          </div>
                        )}
                        {activeTab === "checklist" && !isCompleto && (
                          <div className="space-y-4">
                            <div className="relative overflow-hidden rounded-xl border border-border">
                              <div className="p-4 space-y-2.5 select-none pointer-events-none">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Vista previa — datos de ejemplo</p>
                                {[
                                  { title: "Reservar el lugar de la ceremonia", done: true, cat: "🏛️" },
                                  { title: "Contratar catering / menú", done: true, cat: "🍽️" },
                                  { title: "Elegir y comprar el vestido/traje", done: true, cat: "👗" },
                                  { title: "Contratar fotógrafo/videógrafo", done: false, cat: "📸" },
                                  { title: "Elegir DJ o grupo de música", done: false, cat: "🎵" },
                                  { title: "Encargar las flores y decoración", done: false, cat: "💐" },
                                  { title: "Comprar las alianzas", done: false, cat: "💍" },
                                ].map((item) => (
                                  <div key={item.title} className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${item.done ? "bg-primary border-primary" : "border-border"}`}>
                                      {item.done && <CheckCircle className="w-3 h-3 text-primary-foreground" />}
                                    </div>
                                    <span className={`text-xs ${item.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{item.cat} {item.title}</span>
                                  </div>
                                ))}
                                <div className="mt-3 pt-3 border-t border-border flex justify-between text-xs">
                                  <span className="text-muted-foreground">Progreso</span>
                                  <span className="font-medium text-primary">3 / 7 tareas</span>
                                </div>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                            </div>
                            <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl text-center">
                              <ListChecks className="w-10 h-10 text-primary mx-auto mb-3" />
                              <h4 className="font-heading text-lg mb-1">Tu checklist de boda completo</h4>
                              <p className="text-muted-foreground text-sm mb-1">18 tareas de wedding planner profesional · Añade las tuyas</p>
                              <p className="text-xs text-muted-foreground/70 mb-4">Fechas límite, categorías y estado de cada tarea. Nada se olvida.</p>
                              <button onClick={() => handleBuy("completo_one_time")} disabled={checkoutLoading}
                                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity text-sm w-full sm:w-auto">
                                Desbloquear con Plan Completo · 60€ →
                              </button>
                              <p className="text-xs text-muted-foreground mt-3">30 días de garantía · Pago único para siempre</p>
                            </div>
                          </div>
                        )}
                        {activeTab === "gifts" && !isCompleto && (
                          <div className="space-y-4">
                            <div className="relative overflow-hidden rounded-xl border border-border">
                              <div className="p-4 space-y-3 select-none pointer-events-none">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Vista previa — datos de ejemplo</p>
                                {[
                                  { name: "Familia García", type: "💰", amount: "300€", thanks: true },
                                  { name: "Ana y Pedro Martínez", type: "🏦", amount: "250€", thanks: true },
                                  { name: "Carlos y Marta López", type: "💰", amount: "200€", thanks: false },
                                  { name: "Los abuelos", type: "🎁", amount: "150€", thanks: false },
                                ].map((item) => (
                                  <div key={item.name} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                                    <span className="text-base flex-shrink-0">{item.type}</span>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                                      <p className="text-xs text-muted-foreground">{item.amount}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${item.thanks ? "bg-green-50 text-green-600 border border-green-200" : "bg-amber-50 text-amber-600 border border-amber-200"}`}>
                                      {item.thanks ? "✓ Agradecido" : "Pendiente"}
                                    </span>
                                  </div>
                                ))}
                                <div className="pt-2 flex justify-between text-xs">
                                  <span className="text-muted-foreground">Total recibido</span>
                                  <span className="font-heading text-lg text-primary">900€</span>
                                </div>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                            </div>
                            <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl text-center">
                              <Gift className="w-10 h-10 text-primary mx-auto mb-3" />
                              <h4 className="font-heading text-lg mb-1">Registra cada regalo</h4>
                              <p className="text-muted-foreground text-sm mb-1">Tipo de regalo · Importe · Seguimiento de agradecimientos</p>
                              <p className="text-xs text-muted-foreground/70 mb-4">Nunca olvides a quién has agradecido. Exporta la lista completa.</p>
                              <button onClick={() => handleBuy("completo_one_time")} disabled={checkoutLoading}
                                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity text-sm w-full sm:w-auto">
                                Desbloquear con Plan Completo · 60€ →
                              </button>
                              <p className="text-xs text-muted-foreground mt-3">30 días de garantía · Pago único para siempre</p>
                            </div>
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
