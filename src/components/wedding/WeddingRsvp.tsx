import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Heart } from "lucide-react";

const WeddingRsvp = ({ weddingId }: { weddingId: string }) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    guest_name: "",
    email: "",
    attending: true,
    num_guests: 1,
    dietary_notes: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("rsvps").insert({
      wedding_id: weddingId,
      guest_name: form.guest_name,
      email: form.email,
      attending: form.attending,
      num_guests: form.num_guests,
      dietary_notes: form.dietary_notes,
      message: form.message,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="py-24 bg-background text-center">
        <Heart className="w-10 h-10 text-sand-accent mx-auto mb-4" />
        <h2 className="font-heading text-4xl text-foreground mb-2">¡Gracias!</h2>
        <p className="text-muted-foreground font-light">
          Hemos recibido tu confirmación. ¡Nos vemos pronto!
        </p>
      </div>
    );
  }

  return (
    <div className="py-24 bg-background" id="rsvp">
      <div className="container max-w-lg">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-2">
            Confirma tu asistencia
          </h2>
          <p className="text-muted-foreground font-light">
            ¡Queremos contar contigo!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Tu nombre
            </label>
            <input
              type="text"
              required
              value={form.guest_name}
              onChange={(e) => setForm({ ...form, guest_name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-light"
              placeholder="Nombre completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-light"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">¿Asistirás?</label>
            <select
              value={form.attending ? "yes" : "no"}
              onChange={(e) => setForm({ ...form, attending: e.target.value === "yes" })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-light"
            >
              <option value="yes">¡Sí, allí estaré!</option>
              <option value="no">No podré asistir</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Acompañantes</label>
            <select
              value={form.num_guests}
              onChange={(e) => setForm({ ...form, num_guests: parseInt(e.target.value) })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-light"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Alergias o intolerancias
            </label>
            <textarea
              value={form.dietary_notes}
              onChange={(e) => setForm({ ...form, dietary_notes: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-light resize-none"
              rows={2}
              placeholder="Déjanos saber..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Mensaje para los novios
            </label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-light resize-none"
              rows={3}
              placeholder="¡Felicidades! ✨"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Confirmar asistencia
          </button>
        </form>
      </div>
    </div>
  );
};

export default WeddingRsvp;
