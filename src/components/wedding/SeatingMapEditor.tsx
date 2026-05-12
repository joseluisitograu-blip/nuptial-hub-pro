import { useState, useRef } from "react";
import { Plus, Trash2, X, UserPlus, Users } from "lucide-react";

interface SeatingTableItem {
  id?: string;
  table_name: string;
  capacity: number;
  sort_order: number;
  guests: string[];
}

interface Props {
  tables: SeatingTableItem[];
  onAdd: () => void;
  onRemove: (i: number) => void;
  onUpdateName: (i: number, name: string) => void;
  onUpdateCapacity: (i: number, cap: number) => void;
  onAddGuest: (i: number, name: string) => void;
  onRemoveGuest: (i: number, guestIdx: number) => void;
}

const RING_R = 36;
const RING_CIRC = 2 * Math.PI * RING_R; // ≈ 226.19

function TableBubble({
  table,
  index,
  selected,
  onClick,
}: {
  table: SeatingTableItem;
  index: number;
  selected: boolean;
  onClick: () => void;
}) {
  const seated = table.guests.filter((g) => g.trim()).length;
  const fillPct = table.capacity > 0 ? Math.min(seated / table.capacity, 1) : 0;
  const dash = fillPct * RING_CIRC;
  const over = seated > table.capacity;
  const full = !over && fillPct >= 0.7;
  const ringColor = over ? "#ef4444" : full ? "#f59e0b" : "#22c55e";

  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200 w-full text-center
        ${selected
          ? "border-primary bg-primary/5 ring-2 ring-primary/25 shadow-lg scale-[1.02]"
          : "border-border bg-card hover:border-primary/40 hover:shadow-md hover:scale-[1.01]"
        }`}
    >
      {/* SVG ring */}
      <div className="relative">
        <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
          {/* Track */}
          <circle
            cx="44" cy="44" r={RING_R}
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            className="text-border"
          />
          {/* Fill */}
          <circle
            cx="44" cy="44" r={RING_R}
            fill="none"
            stroke={ringColor}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${RING_CIRC}`}
            style={{ transition: "stroke-dasharray 0.5s ease" }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-foreground leading-none">{seated}</span>
          <span className="text-[10px] text-muted-foreground leading-none mt-0.5">/{table.capacity}</span>
        </div>
      </div>

      <span className="text-sm font-medium text-foreground leading-tight line-clamp-2 max-w-full px-1">
        {table.table_name || `Mesa ${index + 1}`}
      </span>

      <span
        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
        style={{ backgroundColor: ringColor + "22", color: ringColor }}
      >
        {over ? "Completa" : seated === 0 ? "Vacía" : `${Math.round(fillPct * 100)}%`}
      </span>
    </button>
  );
}

const SeatingMapEditor = ({
  tables,
  onAdd,
  onRemove,
  onUpdateName,
  onUpdateCapacity,
  onAddGuest,
  onRemoveGuest,
}: Props) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [newGuest, setNewGuest] = useState("");
  const guestInputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (i: number) => {
    setSelectedIdx(selectedIdx === i ? null : i);
    setNewGuest("");
  };

  const handleAddGuest = (tableIdx: number) => {
    const name = newGuest.trim();
    if (!name) return;
    onAddGuest(tableIdx, name);
    setNewGuest("");
    guestInputRef.current?.focus();
  };

  const selected = selectedIdx !== null && selectedIdx < tables.length ? tables[selectedIdx] : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl text-foreground">Plan de mesas</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Los invitados verán las mesas un día antes de la boda
          </p>
        </div>
        <button
          onClick={() => { onAdd(); setSelectedIdx(tables.length); setNewGuest(""); }}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" /> Añadir mesa
        </button>
      </div>

      {/* Empty state */}
      {tables.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
          <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-muted-foreground text-sm font-medium mb-1">Sin mesas todavía</p>
          <p className="text-muted-foreground text-xs">Añade tus mesas y asigna a cada invitado su sitio</p>
          <button
            onClick={onAdd}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Crear primera mesa
          </button>
        </div>
      )}

      {/* Map grid */}
      {tables.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {tables.map((t, i) => (
            <TableBubble
              key={i}
              table={t}
              index={i}
              selected={selectedIdx === i}
              onClick={() => handleSelect(i)}
            />
          ))}
        </div>
      )}

      {/* Edit panel */}
      {selected !== null && selectedIdx !== null && (
        <div className="bg-card border border-primary/30 rounded-2xl p-5 space-y-4 animate-fade-in shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base text-foreground">
              Editando: {selected.table_name || `Mesa ${selectedIdx + 1}`}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onRemove(selectedIdx);
                  setSelectedIdx(null);
                }}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                title="Eliminar mesa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedIdx(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Name + Capacity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Nombre</label>
              <input
                value={selected.table_name}
                onChange={(e) => onUpdateName(selectedIdx, e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Mesa Nupcial, Mesa 1..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Capacidad</label>
              <input
                type="number"
                min={1}
                max={50}
                value={selected.capacity}
                onChange={(e) => onUpdateCapacity(selectedIdx, parseInt(e.target.value) || 8)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Guest list */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Invitados ({selected.guests.filter((g) => g.trim()).length}/{selected.capacity})
            </label>

            {/* Add guest input */}
            <div className="flex gap-2 mb-3">
              <input
                ref={guestInputRef}
                value={newGuest}
                onChange={(e) => setNewGuest(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddGuest(selectedIdx)}
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Nombre del invitado (Enter para añadir)"
              />
              <button
                onClick={() => handleAddGuest(selectedIdx)}
                disabled={!newGuest.trim()}
                className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition-opacity"
                title="Añadir invitado"
              >
                <UserPlus className="w-4 h-4" />
              </button>
            </div>

            {/* Guest chips */}
            {selected.guests.filter((g) => g.trim()).length > 0 ? (
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                {selected.guests.map((g, gi) =>
                  g.trim() ? (
                    <span
                      key={gi}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-foreground text-xs font-medium group"
                    >
                      {g}
                      <button
                        onClick={() => onRemoveGuest(selectedIdx, gi)}
                        className="text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ) : null
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic py-2">
                Sin invitados asignados — escribe un nombre y pulsa Enter
              </p>
            )}
          </div>
        </div>
      )}

      {/* Summary */}
      {tables.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-1">
          <div className="text-xs text-muted-foreground bg-secondary rounded-lg px-3 py-1.5">
            {tables.length} mesa{tables.length !== 1 ? "s" : ""}
          </div>
          <div className="text-xs text-muted-foreground bg-secondary rounded-lg px-3 py-1.5">
            {tables.reduce((acc, t) => acc + t.guests.filter((g) => g.trim()).length, 0)} invitados asignados
          </div>
          <div className="text-xs text-muted-foreground bg-secondary rounded-lg px-3 py-1.5">
            {tables.reduce((acc, t) => acc + t.capacity, 0)} plazas totales
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatingMapEditor;
