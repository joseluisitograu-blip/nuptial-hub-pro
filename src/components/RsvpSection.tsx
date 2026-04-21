import { useState } from "react";

const RsvpSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    guests: "1",
    allergies: "",
    attending: "yes",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="py-24 bg-background">
        <div className="container max-w-lg text-center">
          <h2 className="font-heading text-4xl text-foreground mb-4">¡Gracias!</h2>
          <p className="text-muted-foreground font-light">
            Hemos recibido tu confirmación. ¡Nos vemos el 15 de Junio!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-background" id="rsvp">
      <div className="container max-w-lg">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-2">
            Confirma tu asistencia
          </h2>
          <p className="text-muted-foreground font-light">
            Antes del 15 de Mayo, por favor
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Nombre completo</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-light"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">¿Asistirás?</label>
            <select
              value={formData.attending}
              onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-light"
            >
              <option value="yes">¡Sí, allí estaré!</option>
              <option value="no">No podré asistir</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Número de acompañantes</label>
            <select
              value={formData.guests}
              onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-light"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Alergias o intolerancias</label>
            <textarea
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-light resize-none"
              rows={3}
              placeholder="Déjanos saber si tienes alguna alergia..."
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
    </section>
  );
};

export default RsvpSection;
