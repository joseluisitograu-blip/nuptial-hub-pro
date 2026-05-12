import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Search } from "lucide-react";

interface SeatingTable {
  id: string;
  table_name: string;
  capacity: number;
  sort_order: number;
}

interface SeatingAssignment {
  id: string;
  table_id: string;
  guest_name: string;
}

interface Props {
  weddingId: string;
  weddingDate: string | null;
}

const RING_R = 32;
const RING_CIRC = 2 * Math.PI * RING_R; // ≈ 201.06

function TableCircle({
  table,
  guests,
  highlighted,
  searchTerm,
}: {
  table: SeatingTable;
  guests: SeatingAssignment[];
  highlighted: boolean;
  searchTerm: string;
}) {
  const fillPct = table.capacity > 0 ? Math.min(guests.length / table.capacity, 1) : 0;
  const dash = fillPct * RING_CIRC;
  const over = guests.length > table.capacity;
  const full = !over && fillPct >= 0.7;
  const ringColor = over ? "#ef4444" : full ? "#f59e0b" : "hsl(var(--primary))";

  return (
    <div
      className={`bg-card rounded-2xl border p-5 flex flex-col items-center gap-3 transition-all duration-300 ${
        highlighted
          ? "border-primary ring-2 ring-primary/30 shadow-xl scale-[1.03]"
          : "border-border hover:border-primary/30 hover:shadow-md"
      }`}
    >
      {/* Ring */}
      <div className="relative">
        <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
          <circle cx="40" cy="40" r={RING_R} fill="none" stroke="currentColor" strokeWidth="5" className="text-border" />
          <circle
            cx="40" cy="40" r={RING_R}
            fill="none"
            stroke={ringColor}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${RING_CIRC}`}
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-bold text-foreground leading-none">{guests.length}</span>
          <span className="text-[10px] text-muted-foreground leading-none mt-0.5">/{table.capacity}</span>
        </div>
      </div>

      {/* Name */}
      <h3 className="font-heading text-sm text-foreground text-center leading-tight">{table.table_name}</h3>

      {/* Guest list */}
      <div className="w-full space-y-1 max-h-32 overflow-y-auto">
        {guests.length === 0 && (
          <p className="text-xs text-muted-foreground italic text-center">Sin asignar</p>
        )}
        {guests.map((g) => {
          const isMatch = searchTerm.trim() && g.guest_name.toLowerCase().includes(searchTerm.toLowerCase());
          return (
            <p
              key={g.id}
              className={`text-xs px-2 py-0.5 rounded transition-colors ${
                isMatch
                  ? "bg-primary/15 text-primary font-semibold"
                  : "text-foreground/75"
              }`}
            >
              {g.guest_name}
            </p>
          );
        })}
      </div>
    </div>
  );
}

const WeddingSeating = ({ weddingId, weddingDate }: Props) => {
  const [tables, setTables] = useState<SeatingTable[]>([]);
  const [assignments, setAssignments] = useState<SeatingAssignment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const isVisible = (() => {
    if (!weddingDate) return false;
    const wedding = new Date(weddingDate);
    const now = new Date();
    const oneDayBefore = new Date(wedding);
    oneDayBefore.setDate(oneDayBefore.getDate() - 1);
    return now >= oneDayBefore;
  })();

  useEffect(() => {
    if (!isVisible) { setLoading(false); return; }
    const fetch = async () => {
      const [t, a] = await Promise.all([
        supabase.from("seating_tables").select("*").eq("wedding_id", weddingId).order("sort_order"),
        supabase.from("seating_assignments").select("*").eq("wedding_id", weddingId),
      ]);
      setTables((t.data as SeatingTable[]) || []);
      setAssignments((a.data as SeatingAssignment[]) || []);
      setLoading(false);
    };
    fetch();
  }, [weddingId, isVisible]);

  if (loading) return <div className="py-24 text-center text-muted-foreground">Cargando mesas...</div>;

  if (!isVisible) {
    return (
      <div className="py-24 bg-secondary">
        <div className="container max-w-md text-center px-6">
          <Users className="w-8 h-8 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="font-heading text-4xl text-foreground mb-3">Distribución de mesas</h2>
          <p className="text-muted-foreground font-light text-sm">
            El plan de mesas estará disponible un día antes de la boda. ¡Paciencia!
          </p>
        </div>
      </div>
    );
  }

  const normalizedSearch = search.trim().toLowerCase();
  const matched = normalizedSearch
    ? assignments.filter((a) => a.guest_name.toLowerCase().includes(normalizedSearch))
    : [];
  const highlightedTableId = matched.length > 0 ? matched[0].table_id : null;

  return (
    <div className="py-20 bg-secondary">
      <div className="container max-w-4xl px-5">
        {/* Header + search */}
        <div className="text-center mb-10">
          <Users className="w-8 h-8 text-muted-foreground mx-auto mb-4 opacity-60" />
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-3">Distribución de mesas</h2>
          <p className="text-muted-foreground font-light mb-6 text-sm">Busca tu nombre para encontrar tu sitio</p>

          <div className="relative max-w-sm mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Busca tu nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
            />
          </div>

          {/* Search results */}
          {normalizedSearch && matched.length > 0 && (
            <div className="mt-4 space-y-1.5 max-w-xs mx-auto">
              {matched.map((a) => {
                const table = tables.find((t) => t.id === a.table_id);
                return (
                  <div key={a.id} className="bg-primary/10 border border-primary/25 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-foreground">{a.guest_name}</span>
                    <span className="text-sm font-semibold text-primary">{table?.table_name || "Mesa"}</span>
                  </div>
                );
              })}
            </div>
          )}
          {normalizedSearch && matched.length === 0 && (
            <p className="mt-4 text-sm text-muted-foreground">No encontrado. Comprueba con los novios.</p>
          )}
        </div>

        {/* Table grid */}
        {tables.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {tables.map((table) => {
              const tableGuests = assignments.filter((a) => a.table_id === table.id);
              return (
                <TableCircle
                  key={table.id}
                  table={table}
                  guests={tableGuests}
                  highlighted={highlightedTableId === table.id}
                  searchTerm={search}
                />
              );
            })}
          </div>
        )}

        {tables.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">El plan de mesas estará disponible pronto.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeddingSeating;
