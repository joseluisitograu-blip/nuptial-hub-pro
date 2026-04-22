import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Check, X, TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";
import { toast } from "sonner";

interface BudgetItem {
  id?: string;
  wedding_id: string;
  category: string;
  vendor_name: string;
  description: string;
  estimated_cost: number;
  actual_cost: number;
  is_paid: boolean;
  payment_date: string | null;
  notes: string;
}

const CATEGORIES = [
  { id: "venue", label: "Lugar / Finca", emoji: "🏛️" },
  { id: "catering", label: "Catering", emoji: "🍽️" },
  { id: "photography", label: "Fotografía / Vídeo", emoji: "📸" },
  { id: "flowers", label: "Flores / Decoración", emoji: "💐" },
  { id: "music", label: "Música / DJ", emoji: "🎵" },
  { id: "dress", label: "Vestido / Traje", emoji: "👗" },
  { id: "rings", label: "Alianzas", emoji: "💍" },
  { id: "invitations", label: "Invitaciones", emoji: "💌" },
  { id: "transport", label: "Transporte", emoji: "🚗" },
  { id: "beauty", label: "Peluquería / Maquillaje", emoji: "💄" },
  { id: "cake", label: "Tarta", emoji: "🎂" },
  { id: "gifts", label: "Detalles invitados", emoji: "🎁" },
  { id: "honeymoon", label: "Luna de miel", emoji: "✈️" },
  { id: "other", label: "Otros", emoji: "📋" },
];

const CATEGORY_COLORS: Record<string, string> = {
  venue: "hsl(33, 60%, 50%)",
  catering: "hsl(15, 70%, 55%)",
  photography: "hsl(200, 60%, 50%)",
  flowers: "hsl(330, 60%, 60%)",
  music: "hsl(270, 50%, 55%)",
  dress: "hsl(290, 40%, 60%)",
  rings: "hsl(45, 80%, 55%)",
  invitations: "hsl(350, 50%, 55%)",
  transport: "hsl(180, 50%, 45%)",
  beauty: "hsl(310, 50%, 55%)",
  cake: "hsl(25, 70%, 55%)",
  gifts: "hsl(140, 50%, 45%)",
  honeymoon: "hsl(210, 60%, 55%)",
  other: "hsl(0, 0%, 55%)",
};

const fmt = (n: number) =>
  n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

export default function WeddingBudget({ weddingId }: { weddingId: string }) {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<BudgetItem>>({
    category: "venue",
    vendor_name: "",
    description: "",
    estimated_cost: 0,
    actual_cost: 0,
    is_paid: false,
    notes: "",
  });

  const fetchItems = async () => {
    const { data } = await supabase
      .from("wedding_budget_items")
      .select("*")
      .eq("wedding_id", weddingId)
      .order("created_at", { ascending: true });
    setItems((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [weddingId]);

  const addItem = async () => {
    if (!form.description && !form.vendor_name) {
      toast.error("Añade al menos un proveedor o descripción");
      return;
    }
    const { error } = await supabase.from("wedding_budget_items").insert({
      wedding_id: weddingId,
      category: form.category || "other",
      vendor_name: form.vendor_name || "",
      description: form.description || "",
      estimated_cost: form.estimated_cost || 0,
      actual_cost: form.actual_cost || 0,
      is_paid: form.is_paid || false,
      notes: form.notes || "",
    } as any);
    if (!error) {
      toast.success("Partida añadida");
      setShowForm(false);
      setForm({ category: "venue", vendor_name: "", description: "", estimated_cost: 0, actual_cost: 0, is_paid: false, notes: "" });
      fetchItems();
    }
  };

  const togglePaid = async (item: BudgetItem) => {
    await supabase
      .from("wedding_budget_items")
      .update({ is_paid: !item.is_paid, payment_date: !item.is_paid ? new Date().toISOString().slice(0, 10) : null } as any)
      .eq("id", item.id!);
    fetchItems();
  };

  const deleteItem = async (id: string) => {
    await supabase.from("wedding_budget_items").delete().eq("id", id);
    fetchItems();
  };

  const updateActualCost = async (id: string, actual_cost: number) => {
    await supabase.from("wedding_budget_items").update({ actual_cost } as any).eq("id", id);
    fetchItems();
  };

  const stats = useMemo(() => {
    const totalEstimated = items.reduce((s, i) => s + Number(i.estimated_cost), 0);
    const totalActual = items.reduce((s, i) => s + Number(i.actual_cost), 0);
    const totalPaid = items.filter((i) => i.is_paid).reduce((s, i) => s + Number(i.actual_cost || i.estimated_cost), 0);
    const totalPending = totalActual - totalPaid;
    const diff = totalEstimated - totalActual;

    const byCategory: Record<string, { estimated: number; actual: number }> = {};
    items.forEach((i) => {
      if (!byCategory[i.category]) byCategory[i.category] = { estimated: 0, actual: 0 };
      byCategory[i.category].estimated += Number(i.estimated_cost);
      byCategory[i.category].actual += Number(i.actual_cost);
    });

    return { totalEstimated, totalActual, totalPaid, totalPending, diff, byCategory };
  }, [items]);

  // Simple pie chart via SVG
  const pieData = useMemo(() => {
    const entries = Object.entries(stats.byCategory)
      .filter(([, v]) => v.actual > 0)
      .sort((a, b) => b[1].actual - a[1].actual);
    const total = entries.reduce((s, [, v]) => s + v.actual, 0);
    if (total === 0) return [];
    let cumulative = 0;
    return entries.map(([cat, v]) => {
      const start = cumulative;
      const pct = v.actual / total;
      cumulative += pct;
      return { cat, pct, start, color: CATEGORY_COLORS[cat] || "hsl(0,0%,60%)" };
    });
  }, [stats.byCategory]);

  if (loading) return <div className="text-muted-foreground text-sm py-4">Cargando presupuesto...</div>;

  const catLabel = (id: string) => CATEGORIES.find((c) => c.id === id);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard icon={<DollarSign className="w-4 h-4" />} label="Presupuesto" value={fmt(stats.totalEstimated)} />
        <SummaryCard icon={<TrendingUp className="w-4 h-4" />} label="Coste real" value={fmt(stats.totalActual)} accent={stats.totalActual > stats.totalEstimated ? "over" : "under"} />
        <SummaryCard icon={<Check className="w-4 h-4" />} label="Pagado" value={fmt(stats.totalPaid)} />
        <SummaryCard
          icon={stats.diff >= 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
          label={stats.diff >= 0 ? "Ahorro" : "Exceso"}
          value={fmt(Math.abs(stats.diff))}
          accent={stats.diff >= 0 ? "under" : "over"}
        />
      </div>

      {/* Pie chart + category breakdown */}
      {pieData.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-primary" /> Distribución por categoría
          </h4>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <svg viewBox="0 0 36 36" className="w-32 h-32 flex-shrink-0">
              {pieData.map((d, i) => {
                const r = 15.9155;
                const circumference = 2 * Math.PI * r;
                return (
                  <circle
                    key={i}
                    cx="18"
                    cy="18"
                    r={r}
                    fill="none"
                    stroke={d.color}
                    strokeWidth="3.5"
                    strokeDasharray={`${d.pct * circumference} ${circumference}`}
                    strokeDashoffset={`${-d.start * circumference}`}
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {pieData.map((d) => {
                const cat = catLabel(d.cat);
                return (
                  <div key={d.cat} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-muted-foreground">{cat?.emoji} {cat?.label || d.cat}</span>
                    <span className="font-medium text-foreground">{(d.pct * 100).toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Items list */}
      <div className="space-y-2">
        {items.map((item) => {
          const cat = catLabel(item.category);
          const overBudget = Number(item.actual_cost) > Number(item.estimated_cost) && Number(item.estimated_cost) > 0;
          return (
            <div key={item.id} className="bg-card border border-border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center gap-2">
              <button
                onClick={() => togglePaid(item)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  item.is_paid ? "bg-primary border-primary text-primary-foreground" : "border-border hover:border-primary"
                }`}
              >
                {item.is_paid && <Check className="w-3 h-3" />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{cat?.emoji}</span>
                  <span className={`text-sm font-medium ${item.is_paid ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {item.vendor_name || item.description}
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">{cat?.label}</span>
                </div>
                {item.vendor_name && item.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Estimado</div>
                  <div className="font-light">{fmt(Number(item.estimated_cost))}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Real</div>
                  <input
                    type="number"
                    value={Number(item.actual_cost)}
                    onChange={(e) => updateActualCost(item.id!, parseFloat(e.target.value) || 0)}
                    className={`w-20 text-right bg-transparent border-b font-medium focus:outline-none ${
                      overBudget ? "text-red-500 border-red-300" : "text-foreground border-border"
                    }`}
                  />
                </div>
                <button onClick={() => deleteItem(item.id!)} className="p-1 text-muted-foreground hover:text-red-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add form */}
      {showForm ? (
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Categoría</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Proveedor</label>
              <input
                value={form.vendor_name}
                onChange={(e) => setForm({ ...form, vendor_name: e.target.value })}
                placeholder="Nombre del proveedor"
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Descripción</label>
              <input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Ej: Menú completo con barra libre"
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Estimado (€)</label>
                <input
                  type="number"
                  value={form.estimated_cost || ""}
                  onChange={(e) => setForm({ ...form, estimated_cost: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Real (€)</label>
                <input
                  type="number"
                  value={form.actual_cost || ""}
                  onChange={(e) => setForm({ ...form, actual_cost: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cancelar
            </button>
            <button onClick={addItem} className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              Añadir
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary transition-colors text-sm flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Añadir partida
        </button>
      )}
    </div>
  );
}

function SummaryCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: "over" | "under" }) {
  return (
    <div className="bg-card border border-border rounded-lg p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
        {icon} {label}
      </div>
      <div className={`text-lg font-heading ${accent === "over" ? "text-red-500" : accent === "under" ? "text-green-600" : "text-foreground"}`}>
        {value}
      </div>
    </div>
  );
}
