import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail, MailOpen, Trash2 } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

const DashboardMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      setMessages((data as Message[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const markRead = async (id: string) => {
    await supabase.from("contact_messages").update({ read: true }).eq("id", id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const deleteMsg = async (id: string) => {
    await supabase.from("contact_messages").delete().eq("id", id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const selected = messages.find((m) => m.id === selectedId);
  const unreadCount = messages.filter((m) => !m.read).length;

  if (loading) return <p className="text-muted-foreground text-sm py-4">Cargando mensajes...</p>;

  if (messages.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-4 text-center">No hay mensajes todavía.</p>
    );
  }

  return (
    <div className="grid md:grid-cols-[1fr_1.5fr] gap-4">
      {/* List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {messages.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setSelectedId(m.id);
              if (!m.read) markRead(m.id);
            }}
            className={`w-full text-left p-3 rounded-lg border transition-colors ${
              selectedId === m.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            } ${!m.read ? "bg-primary/5" : ""}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-sm truncate ${!m.read ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                {m.name}
              </span>
              {!m.read ? (
                <Mail className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              ) : (
                <MailOpen className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{m.subject || m.message}</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              {new Date(m.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
            </p>
          </button>
        ))}
      </div>

      {/* Detail */}
      <div className="border border-border rounded-lg p-5 min-h-[200px]">
        {selected ? (
          <>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-medium text-foreground">{selected.subject || "Sin asunto"}</h4>
                <p className="text-sm text-muted-foreground">
                  De: {selected.name} {selected.email && `(${selected.email})`}
                </p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">
                  {new Date(selected.created_at).toLocaleDateString("es-ES", {
                    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
              <button
                onClick={() => deleteMsg(selected.id)}
                className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-foreground/80 font-light whitespace-pre-wrap text-sm leading-relaxed">
              {selected.message}
            </p>
            {selected.email && (
              <a
                href={`mailto:${selected.email}`}
                className="inline-block mt-4 text-sm text-primary hover:underline"
              >
                Responder por email →
              </a>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Selecciona un mensaje para leerlo
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardMessages;
