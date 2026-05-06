import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Check, ListChecks, Calendar, ChevronDown, ChevronUp, AlertTriangle, Trophy } from "lucide-react";
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
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
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

  useEffect(() => { fetchItems(); }, [weddingId]);

  // Expandir todas las categorías con tareas pendientes por defecto
  useEffect(() => {
    if (items.length > 0) {
      const catsWithPending = new Set(
        items.filter((i) => !i.is_done).map((i) => i.category)
      );
      setExpandedCats(catsWithPending);
    }
  }, [items.length]);

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
    toast.success("¡Checklist de boda cargado! 18 tareas añadidas");
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
    if (!item.is_done) toast.success(`✓ "${item.title}" completada`);
    fetchItems();
  };

  const deleteItem = async (id: string) => {
    await supabase.from("wedding_checklist").delete().eq("id", id);
    fetchItems();
  };

  const toggleCat = (cat: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const expandAll = () => setExpandedCats(new Set(Object.keys(grouped)));
  const collapseAll = () => setExpandedCats(new Set());

  const stats = useMemo(() => {
    const total = items.length;
    const done = items.filter((i) => i.is_done).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdue = items.filter((i) => {
      if (!i.due_date || i.is_done) return false;
      return new Date(i.due_date) < today;
    }).length;

    const upcoming = items.filter((i) => {
      if (!i.due_date || i.is_done) return false;
      const d = new Date(i.due_date);
      const diff = (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 7;
    }).length;

    return { total, done, pct, overdue, upcoming };
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

  const isOverdue = (due_date: string | null) => {
    if (!due_date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(due_date) < today;
  };

  const isUpcoming = (due_date: string | null) => {
    if (!due_date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(due_date);
    const diff = (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  };

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
          <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${stats.pct}%` }} />
        </div>
        {stats.pct === 100 && (
          <div className="flex items-center gap-2 mt-3 text-sm text-primary font-medium">
            <Trophy className="w-4 h-4" /> ¡Checklist completado! Todo listo para el gran día 🎉
          </div>
        )}
      </div>

      {/* Alertas */}
      {stats.overdue > 0 && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{stats.overdue} {stats.overdue === 1 ? "tarea tiene" : "tareas tienen"} la fecha límite vencida</span>
        </div>
      )}
      {stats.upcoming > 0 && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-600 text-sm">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span>{stats.upcoming} {stats.upcoming === 1 ? "tarea vence" : "tareas vencen"} en los próximos 7 días</span>
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <div className="text-center py-8 bg-card border border-border rounded-lg">
          <ListChecks className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-foreground font-medium mb-1">Sin tareas todavía</p>
          <p className="text-muted-foreground text-sm mb-4">Carga el checklist predefinido o añade tus propias tareas</p>
          <button onClick={loadDefaults}
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            Cargar checklist predefinido (18 tareas)
          </button>
        </div>
      )}

      {/* Controles expandir/colapsar */}
      {items.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{Object.keys(grouped).length} categorías</span>
          <div className="flex gap-2">
            <button onClick={expandAll} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Expandir todo</button>
            <span className="text-muted-foreground">·</span>
            <button onClick={collapseAll} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Colapsar todo</button>
          </div>
        </div>
      )}

      {/* Grouped tasks */}
      {Object.entries(grouped).map(([cat, catItems]) => {
        const info = catInfo(cat);
        const doneCat = catItems.filter((i) => i.is_done).length;
        const isOpen = expandedCats.has(cat);
        const allDone = doneCat === catItems.length;

        return (
          <div key={cat} className={`border rounded-lg overflow-hidden transition-all ${allDone ? "border-border opacity-60" : "border-border"}`}>
            <button
              onClick={() => toggleCat(cat)}
              className="w-full flex items-center justify-between p-3 bg-card hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span>{info.emoji}</span>
                <span className="text-sm font-medium text-foreground">{info.label}</span>
                <span className="text-xs text-muted-foreground">({doneCat}/{catItems.length})</span>
                {allDone && <span className="text-xs px-1.5 py-0.5 rounded bg-green-50 text-green-600 border border-green-200">✓ Completo</span>}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(doneCat / catItems.length) * 100}%` }} />
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
            </button>
            {isOpen && (
              <div className="divide-y divide-border">
                {catItems.map((item) => {
                  const overdue = !item.is_done && isOverdue(item.due_date);
                  const upcoming = !item.is_done && isUpcoming(item.due_date);
                  return (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-card/50 hover:bg-secondary/30 transition-colors">
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
                      {item.due_date && !item.is_done && (
                        <span className={`text-xs flex items-center gap-1 whitespace-nowrap ${
                          overdue ? "text-red-500" : upcoming ? "text-amber-500" : "text-muted-foreground"
                        }`}>
                          <Calendar className="w-3 h-3" />
                          {new Date(item.due_date).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                          {overdue && " ⚠️"}
                        </span>
                      )}
                      <button onClick={() => deleteItem(item.id!)} className="p-1 text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
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
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ej: Confirmar menú con el catering"
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Categoría</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Fecha límite (opcional)</label>
              <input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
            <button onClick={addItem} className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Añadir</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)}
          className="w-full py-3 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary transition-colors text-sm flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Añadir tarea
        </button>
      )}
    </div>
  );
}
