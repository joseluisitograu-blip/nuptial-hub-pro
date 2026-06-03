import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Trash2, Users } from "lucide-react";

interface Guest {
  id: string;
  name: string;
  tableId: string | null;
}

interface Table {
  id: string;
  shape: "round" | "rect";
  capacity: number;
  x: number;
  y: number;
  size: number;
  name: string;
}

interface Props {
  tables: { id?: string; table_name: string; capacity: number; sort_order: number; guests: string[] }[];
  onAdd: () => void;
  onRemove: (i: number) => void;
  onUpdateName: (i: number, name: string) => void;
  onUpdateCapacity: (i: number, cap: number) => void;
  onAddGuest: (i: number, name: string) => void;
  onRemoveGuest: (i: number, guestIdx: number) => void;
}

function uid() { return Math.random().toString(36).slice(2, 10); }

export default function SeatingMapEditor({ tables: propTables, onAdd, onRemove, onUpdateName, onUpdateCapacity, onAddGuest, onRemoveGuest }: Props) {
  const floorRef = useRef<HTMLDivElement>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [newGuest, setNewGuest] = useState("");
  const [newCapacity, setNewCapacity] = useState(6);
  const [newShape, setNewShape] = useState<"round" | "rect">("round");
  const dragTable = useRef<{ id: string; ox: number; oy: number } | null>(null);
  const dragGuest = useRef<string | null>(null);
  const [dragOverTable, setDragOverTable] = useState<string | null>(null);
  const [, forceUpdate] = useState(0);
  const rerender = () => forceUpdate(n => n + 1);

  // Sync from props on mount
  useEffect(() => {
    if (propTables.length === 0) return;
    const floorW = floorRef.current?.offsetWidth || 600;
    const floorH = floorRef.current?.offsetHeight || 440;
    const newTables: Table[] = propTables.map((t, i) => {
      const cols = Math.ceil(Math.sqrt(propTables.length));
      const col = i % cols, row = Math.floor(i / cols);
      const size = 120;
      return {
        id: t.id || uid(),
        shape: "round",
        capacity: t.capacity,
        x: 60 + col * (size + 40),
        y: 60 + row * (size + 40),
        size,
        name: t.table_name || `Mesa ${i + 1}`,
      };
    });
    setTables(newTables);
    const allGuests: Guest[] = [];
    propTables.forEach((t, ti) => {
      const tid = newTables[ti]?.id;
      t.guests.filter(g => g.trim()).forEach(g => {
        allGuests.push({ id: uid(), name: g, tableId: tid || null });
      });
    });
    setGuests(allGuests);
  }, []);

  const addTable = () => {
    const floor = floorRef.current;
    if (!floor) return;
    const W = floor.offsetWidth, H = floor.offsetHeight;
    const size = newShape === "round" ? 120 : 140;
    const t: Table = {
      id: uid(),
      shape: newShape,
      capacity: newCapacity,
      x: 40 + Math.random() * (W - size - 80),
      y: 40 + Math.random() * (H - size - 80),
      size,
      name: `Mesa ${tables.length + 1}`,
    };
    setTables(prev => [...prev, t]);
    onAdd();
  };

  const deleteTable = (id: string) => {
    const idx = tables.findIndex(t => t.id === id);
    setGuests(prev => prev.map(g => g.tableId === id ? { ...g, tableId: null } : g));
    setTables(prev => prev.filter(t => t.id !== id));
    if (idx !== -1) onRemove(idx);
    setSelectedTable(null);
  };

  const addGuestToPool = () => {
    const name = newGuest.trim();
    if (!name) return;
    setGuests(prev => [...prev, { id: uid(), name, tableId: null }]);
    setNewGuest("");
  };

  const assignGuest = (guestId: string, tableId: string) => {
    const t = tables.find(t => t.id === tableId);
    if (!t) return;
    const assigned = guests.filter(g => g.tableId === tableId);
    if (assigned.length >= t.capacity) return;
    setGuests(prev => prev.map(g => g.id === guestId ? { ...g, tableId } : g));
    const tIdx = tables.findIndex(t => t.id === tableId);
    const gName = guests.find(g => g.id === guestId)?.name || "";
    if (tIdx !== -1 && gName) onAddGuest(tIdx, gName);
  };

  const unassignGuest = (guestId: string) => {
    const g = guests.find(g => g.id === guestId);
    if (!g || !g.tableId) return;
    const tIdx = tables.findIndex(t => t.id === g.tableId);
    const gIdx = guests.filter(x => x.tableId === g.tableId).findIndex(x => x.id === guestId);
    setGuests(prev => prev.map(x => x.id === guestId ? { ...x, tableId: null } : x));
    if (tIdx !== -1 && gIdx !== -1) onRemoveGuest(tIdx, gIdx);
  };

  // Mouse drag for tables
  const onTableMouseDown = useCallback((e: React.MouseEvent, tableId: string) => {
    if ((e.target as HTMLElement).closest(".seat-dot")) return;
    setSelectedTable(tableId);
    const floor = floorRef.current;
    if (!floor) return;
    const rect = floor.getBoundingClientRect();
    const t = tables.find(t => t.id === tableId)!;
    dragTable.current = { id: tableId, ox: e.clientX - rect.left - t.x, oy: e.clientY - rect.top - t.y };
    e.preventDefault();
  }, [tables]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragTable.current || !floorRef.current) return;
      const rect = floorRef.current.getBoundingClientRect();
      const { id, ox, oy } = dragTable.current;
      setTables(prev => prev.map(t => {
        if (t.id !== id) return t;
        return { ...t, x: Math.max(0, Math.min(rect.width - t.size, e.clientX - rect.left - ox)), y: Math.max(0, Math.min(rect.height - t.size, e.clientY - rect.top - oy)) };
      }));
    };
    const onUp = () => { dragTable.current = null; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  const unassigned = guests.filter(g => !g.tableId);
  const totalSeats = tables.reduce((a, t) => a + t.capacity, 0);
  const assignedCount = guests.filter(g => g.tableId).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-heading text-xl text-foreground">Plan de mesas</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Los invitados lo verán 24h antes de la boda</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={newShape}
            onChange={e => setNewShape(e.target.value as "round" | "rect")}
            className="text-xs px-2 py-1.5 rounded-lg border border-border bg-card text-foreground"
          >
            <option value="round">Redonda</option>
            <option value="rect">Rectangular</option>
          </select>
          <select
            value={newCapacity}
            onChange={e => setNewCapacity(parseInt(e.target.value))}
            className="text-xs px-2 py-1.5 rounded-lg border border-border bg-card text-foreground"
          >
            {[4,6,8,10,12].map(n => <option key={n} value={n}>{n} plazas</option>)}
          </select>
          <button
            onClick={addTable}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90"
          >
            <Plus className="w-3.5 h-3.5" /> Mesa
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_200px] gap-4">
        {/* Plano */}
        <div
          ref={floorRef}
          className="relative bg-secondary/40 rounded-xl border border-border overflow-hidden"
          style={{ height: 600 }}
          onClick={e => { if (e.target === e.currentTarget) setSelectedTable(null); }}
          onDragOver={e => e.preventDefault()}
        >
          {/* Grid punteado */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "24px 24px", opacity: 0.5
          }} />

          {tables.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground/50">Añade mesas y arrastra los invitados</p>
              </div>
            </div>
          )}

          {tables.map(t => {
            const assigned = guests.filter(g => g.tableId === t.id);
            const free = t.capacity - assigned.length;
            const pct = assigned.length / t.capacity;
            const ringColor = pct === 0 ? "hsl(var(--border))" : pct < 0.7 ? "#1D9E75" : pct < 1 ? "#BA7517" : "#E24B4A";
            const isSelected = selectedTable === t.id;
            const isDragOver = dragOverTable === t.id;

            return (
              <div
                key={t.id}
                id={`table-${t.id}`}
                style={{
                  position: "absolute",
                  left: Math.round(t.x),
                  top: Math.round(t.y),
                  width: t.size,
                  height: t.size,
                  borderRadius: t.shape === "round" ? "50%" : 12,
                  cursor: "grab",
                  userSelect: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  border: isDragOver ? "2px dashed #1D9E75" : isSelected ? "2px solid #378ADD" : "2px solid hsl(var(--border))",
                  background: isDragOver ? "#E1F5EE" : "hsl(var(--card))",
                  boxShadow: isSelected ? "0 0 0 3px #E6F1FB" : "none",
                  transition: "border-color 0.15s",
                  zIndex: isSelected ? 10 : 1,
                }}
                onMouseDown={e => onTableMouseDown(e, t.id)}
                onDragOver={e => { e.preventDefault(); setDragOverTable(t.id); }}
                onDragLeave={() => setDragOverTable(null)}
                onDrop={e => {
                  e.preventDefault();
                  setDragOverTable(null);
                  if (dragGuest.current) { assignGuest(dragGuest.current, t.id); dragGuest.current = null; }
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 500, color: "hsl(var(--foreground))", pointerEvents: "none" }}>{t.name}</span>
                <span style={{ fontSize: 9, color: ringColor, pointerEvents: "none" }}>{assigned.length}/{t.capacity}</span>

                {/* Asientos */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center", maxWidth: t.size - 16, pointerEvents: "none" }}>
                  {assigned.map(g => (
                    <div
                      key={g.id}
                      className="seat-dot"
                      title={g.name}
                      style={{
                        width: 20, height: 20, borderRadius: "50%",
                        background: "#E6F1FB", border: "0.5px solid #85B7EB",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 8, color: "#0C447C", cursor: "pointer", pointerEvents: "auto",
                        flexShrink: 0,
                      }}
                      onClick={e => { e.stopPropagation(); unassignGuest(g.id); }}
                    >
                      {g.name.split(" ")[0].slice(0, 3)}
                    </div>
                  ))}
                  {Array(free).fill(0).map((_, i) => (
                    <div key={i} style={{
                      width: 20, height: 20, borderRadius: "50%",
                      background: "hsl(var(--secondary))", border: "0.5px solid hsl(var(--border))",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9, color: "hsl(var(--muted-foreground))", pointerEvents: "none",
                    }}>+</div>
                  ))}
                </div>

                {/* Botón eliminar en seleccionada */}
                {isSelected && (
                  <button
                    style={{
                      position: "absolute", top: -10, right: -10,
                      width: 22, height: 22, borderRadius: "50%",
                      background: "#E24B4A", border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", zIndex: 20,
                    }}
                    onClick={e => { e.stopPropagation(); deleteTable(t.id); }}
                    title="Eliminar mesa"
                  >
                    <Trash2 style={{ width: 11, height: 11 }} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Panel invitados */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sin mesa</p>
            <span className="text-xs bg-secondary border border-border rounded-full px-2 py-0.5 text-muted-foreground">
              {unassigned.length}
            </span>
          </div>

          <div className="flex gap-1.5">
            <input
              type="text"
              value={newGuest}
              onChange={e => setNewGuest(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addGuestToPool()}
              placeholder="Nombre..."
              className="flex-1 min-w-0 text-xs px-2.5 py-2 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={addGuestToPool}
              className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 max-h-72 bg-secondary/30 rounded-lg border border-border p-2">
            {unassigned.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">Todos asignados</p>
            ) : unassigned.map(g => (
              <div
                key={g.id}
                draggable
                onDragStart={() => { dragGuest.current = g.id; }}
                onDragEnd={() => { dragGuest.current = null; }}
                className="flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg bg-card border border-border text-xs text-foreground cursor-grab hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                <span className="truncate">{g.name}</span>
                <span className="text-muted-foreground text-[10px] shrink-0">arrastrar</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="border-t border-border pt-3 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Asignados</span>
              <span className="font-medium text-foreground">{assignedCount}/{guests.length}</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: guests.length ? `${Math.round((assignedCount / guests.length) * 100)}%` : "0%" }}
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Plazas totales</span>
              <span className="font-medium text-foreground">{totalSeats}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
        <span className="flex items-center gap-1.5">
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#1D9E75", display: "inline-block" }} /> Con espacio
        </span>
        <span className="flex items-center gap-1.5">
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#BA7517", display: "inline-block" }} /> Casi llena
        </span>
        <span className="flex items-center gap-1.5">
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#E24B4A", display: "inline-block" }} /> Completa
        </span>
        <span className="ml-auto">Arrastra los invitados encima de una mesa · Clic en asiento para quitar</span>
      </div>
    </div>
  );
}
