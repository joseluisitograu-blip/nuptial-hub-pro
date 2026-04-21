import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Send } from "lucide-react";

interface Entry {
  id: string;
  author_name: string;
  message: string;
  created_at: string;
}

const WeddingGuestbook = ({ weddingId }: { weddingId: string }) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const fetchEntries = () => {
    supabase
      .from("guestbook")
      .select("*")
      .eq("wedding_id", weddingId)
      .order("created_at", { ascending: false })
      .then(({ data }) => setEntries((data as Entry[]) || []));
  };

  useEffect(() => {
    fetchEntries();
  }, [weddingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSending(true);
    await supabase.from("guestbook").insert({
      wedding_id: weddingId,
      author_name: name.trim(),
      message: message.trim(),
    });
    setName("");
    setMessage("");
    setSending(false);
    fetchEntries();
  };

  return (
    <div className="py-24 bg-background">
      <div className="container max-w-2xl">
        <div className="text-center mb-12">
          <BookOpen className="w-8 h-8 text-sand-accent mx-auto mb-4" />
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-2">Libro de firmas</h2>
          <p className="text-muted-foreground font-light">Deja un mensaje a los novios</p>
        </div>

        <form onSubmit={handleSubmit} className="mb-12 space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            required
            maxLength={100}
            className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-light"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tu mensaje para los novios ✨"
            required
            maxLength={500}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-light resize-none"
          />
          <button
            type="submit"
            disabled={sending}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> {sending ? "Enviando..." : "Firmar"}
          </button>
        </form>

        {entries.length > 0 && (
          <div className="space-y-6">
            {entries.map((entry) => (
              <div key={entry.id} className="bg-card border border-border rounded-xl p-5">
                <p className="text-foreground font-light leading-relaxed mb-3">"{entry.message}"</p>
                <p className="text-sm text-muted-foreground">
                  — {entry.author_name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeddingGuestbook;
