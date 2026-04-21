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

const WeddingSeating = ({ weddingId, weddingDate }: Props) => {
  const [tables, setTables] = useState<SeatingTable[]>([]);
  const [assignments, setAssignments] = useState<SeatingAssignment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Check if seating should be visible (1 day before wedding)
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

  if (loading) return <div className="py-24 text-center text-muted-foreground">Cargando...</div>;

  if (!isVisible) {
    return (
      <div className="py-24 bg-secondary">
        <div className="container max-w-md text-center">
          <Users className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-heading text-4xl text-foreground mb-3">Distribución de mesas</h2>
          <p className="text-muted-foreground font-light">
            La distribución de mesas estará disponible un día antes de la boda. ¡Paciencia! 😊
          </p>
        </div>
      </div>
    );
  }

  const filtered = search.trim()
    ? assignments.filter((a) => a.guest_name.toLowerCase().includes(search.toLowerCase()))
    : [];

  const highlightedTableId = filtered.length === 1 ? filtered[0].table_id : null;

  return (
    <div className="py-24 bg-secondary">
      <div className="container max-w-3xl">
        <div className="text-center mb-10">
          <Users className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-3">Distribución de mesas</h2>
          <p className="text-muted-foreground font-light mb-6">Busca tu nombre para encontrar tu mesa</p>

          <div className="relative max-w-sm mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar tu nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {search.trim() && filtered.length > 0 && (
            <div className="mt-4 space-y-1">
              {filtered.map((a) => {
                const table = tables.find((t) => t.id === a.table_id);
                return (
                  <p key={a.id} className="text-foreground font-medium">
                    {a.guest_name} → <span className="text-primary">{table?.table_name || "Mesa"}</span>
                  </p>
                );
              })}
            </div>
          )}
          {search.trim() && filtered.length === 0 && (
            <p className="mt-4 text-muted-foreground">No encontrado. Comprueba con los novios.</p>
          )}
        </div>

        {tables.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tables.map((table) => {
              const guests = assignments.filter((a) => a.table_id === table.id);
              const isHighlighted = highlightedTableId === table.id;
              return (
                <div
                  key={table.id}
                  className={`bg-card border rounded-xl p-5 transition-all ${
                    isHighlighted ? "border-primary ring-2 ring-primary/20 scale-[1.02]" : "border-border"
                  }`}
                >
                  <h3 className="font-heading text-lg text-foreground mb-1">{table.table_name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{guests.length}/{table.capacity} invitados</p>
                  <div className="space-y-1">
                    {guests.map((g) => (
                      <p
                        key={g.id}
                        className={`text-sm ${
                          search.trim() && g.guest_name.toLowerCase().includes(search.toLowerCase())
                            ? "text-primary font-semibold"
                            : "text-foreground/80"
                        }`}
                      >
                        {g.guest_name}
                      </p>
                    ))}
                    {guests.length === 0 && <p className="text-sm text-muted-foreground italic">Sin asignar aún</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeddingSeating;
