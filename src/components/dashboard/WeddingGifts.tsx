import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Check, Gift, Heart, Send } from "lucide-react";
import { toast } from "sonner";

interface GiftItem {
  id?: string;
  wedding_id: string;
  guest_name: string;
  description: string;
  estimated_value: number;
  gift_type: string;
  thank_you_sent: boolean;
  notes: string;
}

const GIFT_TYPES = [
  { id: "physical", label: "Regalo físico", emoji: "🎁" },
  { id: "money", label: "Dinero / Sobre", emoji: "💰" },
  { id: "transfer", label: "Transferencia", emoji: "🏦" },
  { id: "experience", label: "Experiencia", emoji: "🎫" },
  { id: "other", label: "Otro", emoji: "📦" },
];

const fmt = (n: number) =>
  n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

export default function WeddingGifts({ weddingId }: { weddingId: string }) {
  const [items, setItems] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<GiftItem>>({
    guest_name: "",
    description: "",
    estimated_value: 0,
    gift_type: "physical",
    notes: "",
  });

  const fetchItems = async () => {
    const { data } = await supabase
      .from("wedding_gifts")
      .select("*")
      .eq("wedding_id", weddingId)
      .order("created_at", { ascending: false });
    setItems((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [weddingId]);

  const addItem = async () => {
    if (!form.guest_name) {
      toast.error("Indica el nombre del invitado");
      return;
    }
    await supabase.from("wedding_gifts").insert({
      wedding_id: weddingId,
      guest_name: form.guest_name || "",
      description: form.description || "",
      estimated_value: form.estimated_value || 0,
      gift_type: form.gift_type || "physical",
      notes: form.notes || "",
    } as any);
    toast.success("Regalo registrado");
    setShowForm(false);
    setForm({ guest_name: "", description: "", estimated_value: 0, gift_type: "physical", notes: "" });
    fetchItems();
  };

  const toggleThankYou = async (item: GiftItem) => {
    await supabase.from("wedding_gifts").update({ thank_you_sent: !item.thank_you_sent } as any).eq("id", item.id!);
    fetchItems();
  };

  const deleteItem = async (id: string) => {
    await supabase.from("wedding_gifts").delete().eq("id", id);
    fetchItems();
  };

  const stats = useMemo(() => {
    const total = items.length;
    const totalValue = items.reduce((s, i) => s + Number(i.estimated_value), 0);
    const thanksSent = items.filter((i) => i.thank_you_sent).length;
    const thanksPending = total - thanksSent;
    const byType: Record<string, number> = {};
    items.forEach((i) => {
      byType[i.gift_type] = (byType[i.gift_type] || 0) + 1;
    });
    return { total, totalValue, thanksSent, thanksPending, byType };
  }, [items]);

  if (loading) return <div className="text-muted-foreground text-sm py-4">Cargando regalos...</div>;

  const typeLabel = (id: string) => GIFT_TYPES.find((t) => t.id === id);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard icon={<Gift className="w-4 h-4" />} label="Total regalos" value={String(stats.total)} />
        <SummaryCard icon={<Heart className="w-4 h-4" />} label="Valor total" value={fmt(stats.totalValue)} />
        <SummaryCard icon={<Send className="w-4 h-4" />} label="Gracias enviadas" value={`${stats.thanksSent}/${stats.total}`} />
        <SummaryCard icon={<Check className="w-4 h-4" />} label="Pendientes" value={String(stats.thanksPending)} accent={stats.thanksPending > 0 ? "warn" : undefined} />
      </div>

      {/* Progress bar for thank yous */}
      {stats.total > 0 && (
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>Agradecimientos enviados</span>
            <span>{stats.total > 0 ? ((stats.thanksSent / stats.total) * 100).toFixed(0) : 0}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${stats.total > 0 ? (stats.thanksSent / stats.total) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Items */}
      <div className="space-y-2">
        {items.map((item) => {
          const type = typeLabel(item.gift_type);
          return (
            <div key={item.id} className="bg-card border border-border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center gap-2">
              <button
                onClick={() => toggleThankYou(item)}
                title={item.thank_you_sent ? "Gracias enviadas" : "Marcar como agradecido"}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  item.thank_you_sent ? "bg-primary border-primary text-primary-foreground" : "border-border hover:border-primary"
                }`}
              >
                {item.thank_you_sent && <Check className="w-3 h-3" />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{type?.emoji}</span>
                  <span className="text-sm font-medium text-foreground">{item.guest_name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{type?.label}</span>
                </div>
                {item.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {Number(item.estimated_value) > 0 && (
                  <span className="text-sm font-medium text-foreground">{fmt(Number(item.estimated_value))}</span>
                )}
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
              <label className="block text-xs font-medium text-muted-foreground mb-1">Invitado</label>
              <input
                value={form.guest_name}
                onChange={(e) => setForm({ ...form, guest_name: e.target.value })}
                placeholder="Nombre del invitado"
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Tipo</label>
              <select
                value={form.gift_type}
                onChange={(e) => setForm({ ...form, gift_type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {GIFT_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Descripción</label>
              <input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Ej: Juego de toallas"
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Valor estimado (€)</label>
              <input
                type="number"
                value={form.estimated_value || ""}
                onChange={(e) => setForm({ ...form, estimated_value: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
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
          <Plus className="w-4 h-4" /> Registrar regalo
        </button>
      )}
    </div>
  );
}

function SummaryCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: "warn" }) {
  return (
    <div className="bg-card border border-border rounded-lg p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
        {icon} {label}
      </div>
      <div className={`text-lg font-heading ${accent === "warn" ? "text-amber-500" : "text-foreground"}`}>
        {value}
      </div>
    </div>
  );
}
