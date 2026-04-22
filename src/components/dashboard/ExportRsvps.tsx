import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Download } from "lucide-react";

const ExportRsvps = ({ weddingId }: { weddingId: string }) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    const { data } = await supabase
      .from("rsvps")
      .select("guest_name, email, attending, num_guests, dietary_notes, message, created_at")
      .eq("wedding_id", weddingId)
      .order("created_at", { ascending: false });

    if (!data || data.length === 0) {
      setExporting(false);
      return;
    }

    const headers = ["Nombre", "Email", "Asiste", "Nº invitados", "Dieta/Alergias", "Mensaje", "Fecha"];
    const rows = data.map((r) => [
      r.guest_name,
      r.email || "",
      r.attending ? "Sí" : "No",
      String(r.num_guests),
      r.dietary_notes || "",
      (r.message || "").replace(/\n/g, " "),
      new Date(r.created_at).toLocaleDateString("es-ES"),
    ]);

    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const csv = [headers.join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rsvps-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground hover:opacity-80 transition-opacity disabled:opacity-50"
      title="Exportar RSVPs a CSV"
    >
      <Download className="w-3.5 h-3.5" />
      {exporting ? "Exportando..." : "Exportar CSV"}
    </button>
  );
};

export default ExportRsvps;
