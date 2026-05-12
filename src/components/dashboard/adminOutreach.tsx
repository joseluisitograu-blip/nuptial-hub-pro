import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Send, Clock, CheckCircle, AlertCircle, Mail } from "lucide-react";
import { toast } from "sonner";

interface SentEmail {
  id: string;
  to_email: string;
  to_name: string | null;
  sent_at: string;
}

export default function AdminOutreach() {
  const [toEmail, setToEmail] = useState("");
  const [toName, setToName] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<SentEmail[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("outreach_emails")
        .select("id, to_email, to_name, sent_at")
        .order("sent_at", { ascending: false })
        .limit(20);
      setSent((data as SentEmail[]) || []);
    };
    fetch();
  }, []);

  const handleSend = async () => {
    if (!toEmail) { toast.error("Introduce el email"); return; }
    setSending(true);
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-outreach-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          to_email: toEmail,
          to_name: toName || undefined,
          custom_message: customMessage || undefined,
        }),
      }
    );
    const data = await res.json();
    if (data.success) {
      toast.success(`Email enviado a ${toEmail} ✓`);
      setSent((prev) => [{ id: Date.now().toString(), to_email: toEmail, to_name: toName || null, sent_at: new Date().toISOString() }, ...prev]);
      setToEmail("");
      setToName("");
      setCustomMessage("");
    } else {
      toast.error(`Error: ${data.error}`);
    }
    setSending(false);
  };

  const inputClass = "w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-light text-sm";

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Mail className="w-5 h-5 text-primary" />
          <h3 className="font-heading text-lg text-foreground">Enviar email a wedding planner</h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email *</label>
            <input
              type="email"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              placeholder="planner@ejemplo.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Nombre (opcional)</label>
            <input
              type="text"
              value={toName}
              onChange={(e) => setToName(e.target.value)}
              placeholder="María García"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            Mensaje personalizado (opcional)
          </label>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows={3}
            placeholder="Me pongo en contacto contigo porque creo que BodasFácil puede ser muy útil para tus clientes..."
            className={`${inputClass} resize-none`}
          />
          <p className="text-xs text-muted-foreground mt-1">Si lo dejas vacío se usará el mensaje por defecto.</p>
        </div>

        <button
          onClick={handleSend}
          disabled={sending || !toEmail}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {sending ? "Enviando..." : "Enviar email"}
        </button>
      </div>

      {/* Historial */}
      {sent.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h4 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            Historial de envíos
          </h4>
          <div className="space-y-2">
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

