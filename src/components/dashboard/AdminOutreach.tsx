import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Send, Clock, CheckCircle, Upload, X, AlertCircle, FileText } from "lucide-react";
import { toast } from "sonner";

interface SentEmail {
  id: string;
  to_email: string;
  to_name: string | null;
  sent_at: string;
}

interface Recipient {
  to_email: string;
  to_name: string;
}

export default function AdminOutreach() {
  const [toEmail, setToEmail] = useState("");
  const [toName, setToName] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<SentEmail[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [bulkSending, setBulkSending] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ sent: number; total: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("outreach_emails")
        .select("id, to_email, to_name, sent_at")
        .order("sent_at", { ascending: false })
        .limit(50);
      setSent((data as SentEmail[]) || []);
    };
    fetch();
  }, []);

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const handleSingle = async () => {
    if (!toEmail) { toast.error("Introduce el email"); return; }
    setSending(true);
    const token = await getToken();
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-outreach-email`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ to_email: toEmail, to_name: toName || undefined, custom_message: customMessage || undefined }),
      }
    );
    const data = await res.json();
    if (data.success) {
      toast.success(`Email enviado a ${toEmail} ✓`);
      setSent((prev) => [{ id: Date.now().toString(), to_email: toEmail, to_name: toName || null, sent_at: new Date().toISOString() }, ...prev]);
      setToEmail(""); setToName("");
    } else {
      toast.error(data.error || "Error al enviar");
    }
    setSending(false);
  };

  const handleCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split("\n").filter(Boolean);
      const parsed: Recipient[] = [];
      lines.forEach((line, i) => {
        if (i === 0 && line.toLowerCase().includes("email")) return; // saltar cabecera
        const [email, name] = line.split(/[,;]/).map(s => s.trim().replace(/"/g, ""));
        if (email && email.includes("@")) {
          parsed.push({ to_email: email, to_name: name || "" });
        }
      });
      setRecipients(parsed);
      toast.success(`${parsed.length} destinatarios cargados del CSV`);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleBulkSend = async () => {
    if (recipients.length === 0) { toast.error("No hay destinatarios cargados"); return; }
    setBulkSending(true);
    setBulkProgress({ sent: 0, total: recipients.length });
    const token = await getToken();

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-outreach-email`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          recipients,
          custom_message: customMessage || undefined,
        }),
      }
    );
    const data = await res.json();

    if (data.success) {
      toast.success(`✓ ${data.sent} emails enviados · ${data.failed} fallidos`);
      if (data.errors?.length > 0) {
        console.log("Errores:", data.errors);
      }
      // Recargar historial
      const { data: newSent } = await supabase
        .from("outreach_emails")
        .select("id, to_email, to_name, sent_at")
        .order("sent_at", { ascending: false })
        .limit(50);
      setSent((newSent as SentEmail[]) || []);
      setRecipients([]);
    } else {
      toast.error(data.error || "Error en el envío masivo");
    }

    setBulkSending(false);
    setBulkProgress(null);
  };

  const inputClass = "w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-light text-sm";

  return (
    <div className="space-y-6">

      {/* Envío masivo por CSV */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Upload className="w-5 h-5 text-primary" />
          <h3 className="font-heading text-lg text-foreground">Envío masivo por CSV</h3>
        </div>
        <p className="text-xs text-muted-foreground">El CSV debe tener dos columnas: <strong>email</strong> y <strong>nombre</strong> (opcional). Separadas por coma o punto y coma.</p>

        <div className="flex flex-col sm:flex-row gap-3">
          <label className="flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 cursor-pointer transition-all text-sm text-muted-foreground flex-1 justify-center">
            <FileText className="w-4 h-4" />
            {recipients.length > 0 ? `${recipients.length} destinatarios cargados` : "Subir archivo CSV"}
            <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleCSV} className="hidden" />
          </label>
          {recipients.length > 0 && (
            <button onClick={() => setRecipients([])} className="p-3 rounded-lg border border-border text-muted-foreground hover:text-red-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Preview destinatarios */}
        {recipients.length > 0 && (
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-secondary/50 px-3 py-2 text-xs font-medium text-muted-foreground">
              Vista previa — {recipients.length} destinatarios
            </div>
            <div className="max-h-40 overflow-y-auto divide-y divide-border">
              {recipients.slice(0, 10).map((r, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 text-xs">
                  <span className="text-foreground">{r.to_email}</span>
                  {r.to_name && <span className="text-muted-foreground">{r.to_name}</span>}
                </div>
              ))}
              {recipients.length > 10 && (
                <div className="px-3 py-2 text-xs text-muted-foreground">+{recipients.length - 10} más...</div>
              )}
            </div>
          </div>
        )}

        {/* Mensaje personalizado para masivo */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Mensaje personalizado (opcional — se aplica a todos)</label>
          <textarea value={customMessage} onChange={(e) => setCustomMessage(e.target.value)} rows={2}
            placeholder="Dejar vacío para usar el mensaje por defecto..."
            className={`${inputClass} resize-none`} />
        </div>

        <button onClick={handleBulkSend} disabled={bulkSending || recipients.length === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 w-full sm:w-auto justify-center">
          <Send className="w-4 h-4" />
          {bulkSending ? `Enviando...` : `Enviar a ${recipients.length} destinatarios`}
        </button>

        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          Los emails ya contactados anteriormente se omiten automáticamente.
        </p>
      </div>

      {/* Envío individual */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Send className="w-5 h-5 text-primary" />
          <h3 className="font-heading text-lg text-foreground">Envío individual</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email *</label>
            <input type="email" value={toEmail} onChange={(e) => setToEmail(e.target.value)}
              placeholder="planner@ejemplo.com" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Nombre (opcional)</label>
            <input type="text" value={toName} onChange={(e) => setToName(e.target.value)}
              placeholder="María García" className={inputClass} />
          </div>
        </div>
        <button onClick={handleSingle} disabled={sending || !toEmail}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
          <Send className="w-4 h-4" />
          {sending ? "Enviando..." : "Enviar email"}
        </button>
      </div>

      {/* Historial */}
      {sent.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h4 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            Historial — {sent.length} emails enviados
          </h4>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {sent.map((email) => (
              <div key={email.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-foreground font-medium">{email.to_email}</p>
                    {email.to_name && <p className="text-xs text-muted-foreground">{email.to_name}</p>}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(email.sent_at).toLocaleDateString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
