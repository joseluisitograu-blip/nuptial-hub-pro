import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Save, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const inputClass =
  "w-full min-w-0 px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-light box-border";

const Field = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
  multiline?: boolean;
}) => (
  <div>
    <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className={`${inputClass} resize-none`}
        placeholder={placeholder}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
        placeholder={placeholder}
      />
    )}
  </div>
);

const EditWedding = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    slug: "",
    partner1_name: "",
    partner2_name: "",
    wedding_date: "",
    ceremony_venue: "",
    ceremony_address: "",
    ceremony_time: "",
    reception_venue: "",
    reception_address: "",
    reception_time: "",
    bank_account: "",
    gift_message: "",
    dress_code: "",
  });

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user || !id) return;
    const fetchData = async () => {
      const { data } = await supabase.from("weddings").select("*").eq("id", id).single();
      if (data) {
        setForm({
          slug: data.slug || "",
          partner1_name: data.partner1_name || "",
          partner2_name: data.partner2_name || "",
          wedding_date: data.wedding_date ? data.wedding_date.split("T")[0] : "",
          ceremony_venue: data.ceremony_venue || "",
          ceremony_address: data.ceremony_address || "",
          ceremony_time: data.ceremony_time || "",
          reception_venue: data.reception_venue || "",
          reception_address: data.reception_address || "",
          reception_time: data.reception_time || "",
          bank_account: data.bank_account || "",
          gift_message: data.gift_message || "",
          dress_code: data.dress_code || "",
        });
      }
      setLoading(false);
    };
    fetchData();
  }, [user, id]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("weddings")
      .update({
        slug: form.slug,
        partner1_name: form.partner1_name,
        partner2_name: form.partner2_name,
        wedding_date: form.wedding_date ? new Date(form.wedding_date).toISOString() : null,
        ceremony_venue: form.ceremony_venue,
        ceremony_address: form.ceremony_address,
        ceremony_time: form.ceremony_time,
        reception_venue: form.reception_venue,
        reception_address: form.reception_address,
        reception_time: form.reception_time,
        bank_account: form.bank_account,
        gift_message: form.gift_message,
        dress_code: form.dress_code,
      })
      .eq("id", id!);

    if (error) {
      toast.error("Error al guardar");
    } else {
      toast.success("¡Guardado!");
    }
    setSaving(false);
  };

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse font-heading text-2xl text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <header className="border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/dashboard" className="p-2 rounded-md hover:bg-secondary transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="font-heading text-xl truncate">Editar boda</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to={`/w/${form.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm hover:opacity-90 transition-opacity"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Ver
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" /> {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        <section className="space-y-4">
          <h2 className="font-heading text-2xl border-b border-border pb-2">Pareja</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nombre 1" value={form.partner1_name} onChange={(v) => update("partner1_name", v)} placeholder="María" />
            <Field label="Nombre 2" value={form.partner2_name} onChange={(v) => update("partner2_name", v)} placeholder="Carlos" />
          </div>
          <Field label="URL personalizada" value={form.slug} onChange={(v) => update("slug", v)} placeholder="maria-y-carlos" />
          <Field label="Fecha de la boda" value={form.wedding_date} onChange={(v) => update("wedding_date", v)} type="date" />
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-2xl border-b border-border pb-2">Ceremonia</h2>
          <Field label="Lugar" value={form.ceremony_venue} onChange={(v) => update("ceremony_venue", v)} placeholder="Iglesia de Santa María" />
          <Field label="Dirección" value={form.ceremony_address} onChange={(v) => update("ceremony_address", v)} placeholder="Calle Mayor, 12" />
          <Field label="Hora" value={form.ceremony_time} onChange={(v) => update("ceremony_time", v)} placeholder="17:00" />
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-2xl border-b border-border pb-2">Celebración</h2>
          <Field label="Lugar" value={form.reception_venue} onChange={(v) => update("reception_venue", v)} placeholder="Finca Los Olivos" />
          <Field label="Dirección" value={form.reception_address} onChange={(v) => update("reception_address", v)} placeholder="Camino Rural s/n" />
          <Field label="Hora" value={form.reception_time} onChange={(v) => update("reception_time", v)} placeholder="19:30" />
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-2xl border-b border-border pb-2">Regalos</h2>
          <Field label="Número de cuenta (IBAN)" value={form.bank_account} onChange={(v) => update("bank_account", v)} placeholder="ES12 3456 7890 ..." />
          <Field
            label="Mensaje para los invitados"
            value={form.gift_message}
            onChange={(v) => update("gift_message", v)}
            multiline
            placeholder="El mejor regalo es vuestra presencia..."
          />
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-2xl border-b border-border pb-2">Código de vestimenta</h2>
          <Field label="Estilo" value={form.dress_code} onChange={(v) => update("dress_code", v)} placeholder="Elegante / Cóctel" />
        </section>
      </div>
    </div>
  );
};

export default EditWedding;
