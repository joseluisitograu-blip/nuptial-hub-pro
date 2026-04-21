import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  subject?: string;
}

const ContactModal = ({ open, onClose, subject = "" }: ContactModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subjectValue, setSubjectValue] = useState(subject);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSending(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: name.trim().slice(0, 100),
      email: email.trim().slice(0, 255),
      subject: subjectValue.trim().slice(0, 200),
      message: message.trim().slice(0, 2000),
    });

    if (error) {
      toast({ title: "Error al enviar", description: "Inténtalo de nuevo.", variant: "destructive" });
    } else {
      toast({ title: "¡Mensaje enviado!", description: "Te responderemos lo antes posible." });
      setName("");
      setEmail("");
      setSubjectValue("");
      setMessage("");
      onClose();
    }
    setSending(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-heading text-2xl text-foreground mb-1">Contáctanos</h2>
        <p className="text-muted-foreground text-sm font-light mb-6">Te responderemos lo antes posible.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Nombre *</label>
            <input
              type="text"
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              type="email"
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              placeholder="Para que podamos responderte"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Asunto</label>
            <input
              type="text"
              maxLength={200}
              value={subjectValue}
              onChange={(e) => setSubjectValue(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              placeholder="¿Sobre qué nos escribes?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Mensaje *</label>
            <textarea
              required
              maxLength={2000}
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none"
              placeholder="Tu mensaje..."
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
          >
            {sending ? "Enviando..." : "Enviar mensaje"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
