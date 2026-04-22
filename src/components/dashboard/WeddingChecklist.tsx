import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Check, ListChecks, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

interface ChecklistItem {
  id?: string;
  wedding_id: string;
  title: string;
  category: string;
  is_done: boolean;
  due_date: string | null;
  notes: string;
  sort_order: number;
}

const CATEGORIES = [
  { id: "venue", label: "Lugar", emoji: "🏛️" },
  { id: "catering", label: "Catering", emoji: "🍽️" },
  { id: "attire", label: "Vestimenta", emoji: "👗" },
  { id: "beauty", label: "Belleza", emoji: "💄" },
  { id: "photo", label: "Foto/Vídeo", emoji: "📸" },
  { id: "music", label: "Música", emoji: "🎵" },
  { id: "flowers", label: "Flores", emoji: "💐" },
  { id: "invitations", label: "Invitaciones", emoji: "💌" },
  { id: "legal", label: "Legal", emoji: "📋" },
  { id: "general", label: "General", emoji: "📌" },
];

const DEFAULT_TASKS = [
  { title: "Reservar el lugar de la ceremonia", category: "venue", sort_order: 1 },
  { title: "Reservar el lugar del banquete", category: "venue", sort_order: 2 },
  { title: "Contratar catering / menú", category: "catering", sort_order: 3 },
  { title: "Elegir y comprar el vestido/traje", category: "attire", sort_order: 4 },
  { title: "Contratar fotógrafo/videógrafo", category: "photo", sort_order: 5 },
  { title: "Elegir DJ o grupo de música", category: "music", sort_order: 6 },
  { title: "Encargar las flores y decoración", category: "flowers", sort_order: 7 },
  { title: "Diseñar e imprimir invitaciones", category: "invitations", sort_order: 8 },
  { title: "Prueba de maquillaje y peluquería", category: "beauty", sort_order: 9 },
  { title: "Comprar las alianzas", category: "general", sort_order: 10 },
  { title: "Reservar transporte para el día", category: "general", sort_order: 11 },
  { title: "Contratar seguro de boda", category: "legal", sort_order: 12 },
  { title: "Solicitar cita en el Registro Civil", category: "legal", sort_order: 13 },
  { title: "Preparar el viaje de luna de miel", category: "general", sort_order: 14 },
  { title: "Confirmar lista definitiva de invitados", category: "invitations", sort_order: 15 },
  { title: "Elegir tarta nupcial", category: "catering", sort_order: 16 },
  { title: "Preparar detalles para invitados", category: "general", sort_order: 17 },
  { title: "Ensayo general", category: "general", sort_order: 18 },
];

export default function WeddingChecklist({ weddingId }: { weddingId: string }) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", category: "general", due_date: "" });

  const fetchItems = async () => {
    const { data } = await supabase
      .from("wedding_checklist")
      .select("*")
      .eq("wedding_id", weddingId)
      .order("sort_order", { ascending: true });
    setItems((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [weddingId]);

  const loadDefaults = async () => {
    const inserts = DEFAULT_TASKS.map((t) => ({
      wedding_id: weddingId,
      title: t.title,
      category: t.category,
      sort_order: t.sort_order,
      is_done: false,
      notes: "",
    }));
    await supabase.from("wedding_checklist").insert(inserts as any);
    toast.success("Checklist predefinido cargado");
    fetchItems();
  };

  const addItem = async () => {
    if (!form.title) { toast.error("Escribe una tarea"); return; }
    await supabase.from("wedding_checklist").insert({
      wedding_id: weddingId,
      title: form.title,
      category: form.category,
      due_date: form.due_date || null,
      is_done: false,
      notes: "",
      sort_order: items.length,
    } as any);
    toast.success("Tarea añadida");
    setShowForm(false);
    setForm({ title: "", category: "general", due_date: "" });
    fetchItems();
  };

  const toggleDone = async (item: ChecklistItem) => {
    await supabase.from("wedding_checklist").update({ is_done: !item.is_done } as any).eq("id", item.id!);
    fetchItems();
  };

  const deleteItem = async (id: string) => {
    await supabase.from("wedding_checklist").delete().eq("id", id);
    fetchItems();
  };

  const stats = useMemo(() => {
    const total = items.length;
    const done = items.filter((i) => i.is_done).length;
    return { total, done, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  }, [items]);

  const grouped = useMemo(() => {
    const map: Record<string, ChecklistItem[]> = {};
    items.forEach((i) => {
      if (!map[i.category]) map[i.category] = [];
      map[i.category].push(i);
    });
    return map;
  }, [items]);

  if (loading) return <div className="text-muted-foreground text-sm py-4">Cargando checklist...</div>;

  const catInfo = (id: string) => CATEGORIES.find((c) => c.id === id) || { label: id, emoji: "📌" };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">{stats.done}/{stats.total} tareas completadas</span>
          </div>
          <span className="text-2xl font-heading text-primary">{stats.pct}%</span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${stats.pct}%` }}
          />
        </div>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Aún no tienes tareas. ¿Quieres cargar un checklist predefinido de boda?</p>
          <button
            onClick={loadDefaults}
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Cargar checklist predefinido
          </button>
        </div>
      )}

      {/* Grouped tasks */}
      {Object.entries(grouped).map(([cat, catItems]) => {
        const info = catInfo(cat);
        const doneCat = catItems.filter((i) => i.is_done).length;
        const isOpen = expandedCat === cat || expandedCat === null;
        return (
          <div key={cat} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedCat(expandedCat === cat ? null : cat)}
              className="w-full flex items-center justify-between p-3 bg-card hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span>{info.emoji}</span>
                <span className="text-sm font-medium text-foreground">{info.label}</span>
                <span className="text-xs text-muted-foreground">({doneCat}/{catItems.length})</span>
              </div>
              {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>
            {isOpen && (
              <div className="divide-y divide-border">
                {catItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-card/50">
                    <button
                      onClick={() => toggleDone(item)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        item.is_done ? "bg-primary border-primary text-primary-foreground" : "border-border hover:border-primary"
                      }`}
                    >
                      {item.is_done && <Check className="w-3 h-3" />}
                    </button>
                    <span className={`flex-1 text-sm ${item.is_done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {item.title}
                    </span>
                    {item.due_date && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.due_date).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                      </span>
                    )}
                    <button onClick={() => deleteItem(item.id!)} className="p-1 text-muted-foreground hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Add form */}
      {showForm ? (
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Tarea</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ej: Confirmar menú con el catering"
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
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
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
            <button onClick={addItem} className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Añadir</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary transition-colors text-sm flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Añadir tarea
        </button>
      )}
    </div>
  );
}
