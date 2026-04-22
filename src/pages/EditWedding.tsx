import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Save, ExternalLink, Plus, Trash2, Upload } from "lucide-react";
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

const themes = [
  { id: "elegant", label: "Elegante", colors: "bg-[hsl(30,25%,15%)]" },
  { id: "romantic", label: "Romántico", colors: "bg-[hsl(340,40%,55%)]" },
  { id: "rustic", label: "Rústico", colors: "bg-[hsl(30,40%,35%)]" },
  { id: "modern", label: "Moderno", colors: "bg-[hsl(220,20%,20%)]" },
];

interface StoryItem {
  id?: string;
  title: string;
  description: string;
  story_date: string;
  sort_order: number;
}

interface AccommodationItem {
  id?: string;
  name: string;
  address: string;
  phone: string;
  website: string;
  notes: string;
  sort_order: number;
}

interface AgendaItem {
  id?: string;
  title: string;
  start_time: string;
  end_time: string;
  location: string;
  description: string;
  icon: string;
  sort_order: number;
}

interface SeatingTableItem {
  id?: string;
  table_name: string;
  capacity: number;
  sort_order: number;
  guests: string[]; // guest names
}

interface FaqItem {
  id?: string;
  question: string;
  answer: string;
  sort_order: number;
}

const EditWedding = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [accommodations, setAccommodations] = useState<AccommodationItem[]>([]);
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [seatingTables, setSeatingTables] = useState<SeatingTableItem[]>([]);
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
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
    menu_starters: "",
    menu_mains: "",
    menu_desserts: "",
    theme_preset: "elegant",
    whatsapp_number: "",
    hero_image_url: "",
  });

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user || !id) return;
    const fetchData = async () => {
      const [{ data: wedding }, { data: storyData }, { data: accommData }, { data: agendaData }, { data: tablesData }, { data: assignData }, { data: faqData }] = await Promise.all([
        supabase.from("weddings").select("*").eq("id", id).single(),
        supabase.from("wedding_stories").select("*").eq("wedding_id", id).order("sort_order"),
        supabase.from("accommodations").select("*").eq("wedding_id", id).order("sort_order"),
        supabase.from("agenda_items").select("*").eq("wedding_id", id).order("sort_order"),
        supabase.from("seating_tables").select("*").eq("wedding_id", id).order("sort_order"),
        supabase.from("seating_assignments").select("*").eq("wedding_id", id),
        supabase.from("faqs").select("*").eq("wedding_id", id).order("sort_order"),
      ]);
      if (wedding) {
        setForm({
          slug: wedding.slug || "",
          partner1_name: wedding.partner1_name || "",
          partner2_name: wedding.partner2_name || "",
          wedding_date: wedding.wedding_date ? wedding.wedding_date.split("T")[0] : "",
          ceremony_venue: wedding.ceremony_venue || "",
          ceremony_address: wedding.ceremony_address || "",
          ceremony_time: wedding.ceremony_time || "",
          reception_venue: wedding.reception_venue || "",
          reception_address: wedding.reception_address || "",
          reception_time: wedding.reception_time || "",
          bank_account: wedding.bank_account || "",
          gift_message: wedding.gift_message || "",
          dress_code: wedding.dress_code || "",
          menu_starters: wedding.menu_starters || "",
          menu_mains: wedding.menu_mains || "",
          menu_desserts: wedding.menu_desserts || "",
          theme_preset: wedding.theme_preset || "elegant",
          whatsapp_number: (wedding as any).whatsapp_number || "",
          hero_image_url: wedding.hero_image_url || "",
        });
      }
      setStories((storyData as StoryItem[]) || []);
      setAccommodations((accommData as AccommodationItem[]) || []);
      setAgendaItems((agendaData as AgendaItem[]) || []);
      setFaqItems((faqData as FaqItem[]) || []);

      // Build seating tables with guest names
      const tables = (tablesData || []) as any[];
      const assigns = (assignData || []) as any[];
      setSeatingTables(tables.map((t) => ({
        id: t.id,
        table_name: t.table_name,
        capacity: t.capacity,
        sort_order: t.sort_order,
        guests: assigns.filter((a: any) => a.table_id === t.id).map((a: any) => a.guest_name),
      })));

      setLoading(false);
    };
    fetchData();
  }, [user, id]);

  const handleSave = async () => {
    setSaving(true);

    // Save wedding
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
        menu_starters: form.menu_starters,
        menu_mains: form.menu_mains,
        menu_desserts: form.menu_desserts,
        theme_preset: form.theme_preset,
        whatsapp_number: form.whatsapp_number,
        hero_image_url: form.hero_image_url,
      } as any)
      .eq("id", id!);

    // Save stories: delete all and re-insert
    await supabase.from("wedding_stories").delete().eq("wedding_id", id!);
    if (stories.length > 0) {
      await supabase.from("wedding_stories").insert(
        stories.map((s, i) => ({
          wedding_id: id!,
          title: s.title,
          description: s.description,
          story_date: s.story_date,
          sort_order: i,
        }))
      );
    }

    // Save accommodations: delete all and re-insert
    await supabase.from("accommodations").delete().eq("wedding_id", id!);
    if (accommodations.length > 0) {
      await supabase.from("accommodations").insert(
        accommodations.map((a, i) => ({
          wedding_id: id!,
          name: a.name,
          address: a.address,
          phone: a.phone,
          website: a.website,
          notes: a.notes,
          sort_order: i,
        }))
      );
    }

    // Save agenda items
    await supabase.from("agenda_items").delete().eq("wedding_id", id!);
    if (agendaItems.length > 0) {
      await supabase.from("agenda_items").insert(
        agendaItems.map((a, i) => ({
          wedding_id: id!,
          title: a.title,
          start_time: a.start_time,
          end_time: a.end_time,
          location: a.location,
          description: a.description,
          icon: a.icon,
          sort_order: i,
        }))
      );
    }

    // Save seating: delete assignments first, then tables, then re-insert
    await supabase.from("seating_assignments").delete().eq("wedding_id", id!);
    await supabase.from("seating_tables").delete().eq("wedding_id", id!);
    for (let i = 0; i < seatingTables.length; i++) {
      const t = seatingTables[i];
      const { data: tableData } = await supabase.from("seating_tables").insert({
        wedding_id: id!,
        table_name: t.table_name,
        capacity: t.capacity,
        sort_order: i,
      }).select("id").single();
      if (tableData && t.guests.length > 0) {
        await supabase.from("seating_assignments").insert(
          t.guests.filter(g => g.trim()).map(g => ({
            wedding_id: id!,
            table_id: tableData.id,
            guest_name: g.trim(),
          }))
        );
      }
    }

    // Save FAQs
    await supabase.from("faqs").delete().eq("wedding_id", id!);
    if (faqItems.length > 0) {
      await supabase.from("faqs").insert(
        faqItems.map((f, i) => ({
          wedding_id: id!,
          question: f.question,
          answer: f.answer,
          sort_order: i,
        }))
      );
    }

    if (error) {
      toast.error("Error al guardar");
    } else {
      toast.success("¡Guardado!");
    }
    setSaving(false);
  };

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const addStory = () =>
    setStories([...stories, { title: "", description: "", story_date: "", sort_order: stories.length }]);
  const removeStory = (i: number) => setStories(stories.filter((_, idx) => idx !== i));
  const updateStory = (i: number, key: keyof StoryItem, val: string) =>
    setStories(stories.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)));

  const addAccommodation = () =>
    setAccommodations([...accommodations, { name: "", address: "", phone: "", website: "", notes: "", sort_order: accommodations.length }]);
  const removeAccommodation = (i: number) => setAccommodations(accommodations.filter((_, idx) => idx !== i));
  const updateAccommodation = (i: number, key: keyof AccommodationItem, val: string) =>
    setAccommodations(accommodations.map((a, idx) => (idx === i ? { ...a, [key]: val } : a)));

  const addAgendaItem = () =>
    setAgendaItems([...agendaItems, { title: "", start_time: "", end_time: "", location: "", description: "", icon: "clock", sort_order: agendaItems.length }]);
  const removeAgendaItem = (i: number) => setAgendaItems(agendaItems.filter((_, idx) => idx !== i));
  const updateAgendaItem = (i: number, key: keyof AgendaItem, val: string) =>
    setAgendaItems(agendaItems.map((a, idx) => (idx === i ? { ...a, [key]: val } : a)));

  const addSeatingTable = () =>
    setSeatingTables([...seatingTables, { table_name: "", capacity: 8, sort_order: seatingTables.length, guests: [] }]);
  const removeSeatingTable = (i: number) => setSeatingTables(seatingTables.filter((_, idx) => idx !== i));
  const updateSeatingTable = (i: number, key: string, val: any) =>
    setSeatingTables(seatingTables.map((t, idx) => (idx === i ? { ...t, [key]: val } : t)));
  const updateSeatingGuests = (i: number, val: string) =>
    setSeatingTables(seatingTables.map((t, idx) => (idx === i ? { ...t, guests: val.split("\n") } : t)));

  const addFaqItem = () =>
    setFaqItems([...faqItems, { question: "", answer: "", sort_order: faqItems.length }]);
  const removeFaqItem = (i: number) => setFaqItems(faqItems.filter((_, idx) => idx !== i));
  const updateFaqItem = (i: number, key: keyof FaqItem, val: string) =>
    setFaqItems(faqItems.map((f, idx) => (idx === i ? { ...f, [key]: val } : f)));

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
        {/* Theme */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl border-b border-border pb-2">Tema visual</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => update("theme_preset", t.id)}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  form.theme_preset === t.id
                    ? "border-primary shadow-md"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <div className={`w-8 h-8 rounded-full ${t.colors} mx-auto mb-2`} />
                <span className="text-sm font-medium text-foreground">{t.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Couple */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl border-b border-border pb-2">Pareja</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nombre 1" value={form.partner1_name} onChange={(v) => update("partner1_name", v)} placeholder="María" />
            <Field label="Nombre 2" value={form.partner2_name} onChange={(v) => update("partner2_name", v)} placeholder="Carlos" />
          </div>
            <Field label="URL personalizada" value={form.slug} onChange={(v) => update("slug", v.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"))} placeholder="maria-y-carlos" />
            <p className="text-xs text-muted-foreground -mt-2">Solo letras, números y guiones. Tu web estará en: /w/{form.slug}</p>
          <Field label="Fecha de la boda" value={form.wedding_date} onChange={(v) => update("wedding_date", v)} type="date" />
        </section>

        {/* Story */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="font-heading text-2xl">Nuestra historia</h2>
            <button onClick={addStory} className="inline-flex items-center gap-1 text-sm text-primary hover:opacity-80">
              <Plus className="w-4 h-4" /> Añadir
            </button>
          </div>
          {stories.map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Hito {i + 1}</span>
                <button onClick={() => removeStory(i)} className="text-destructive hover:opacity-80">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <input value={s.title} onChange={(e) => updateStory(i, "title", e.target.value)} className={inputClass} placeholder="Título (ej: Nos conocimos)" />
              <input value={s.story_date} onChange={(e) => updateStory(i, "story_date", e.target.value)} className={inputClass} placeholder="Fecha (ej: Junio 2020)" />
              <textarea value={s.description} onChange={(e) => updateStory(i, "description", e.target.value)} className={`${inputClass} resize-none`} rows={2} placeholder="Descripción..." />
            </div>
          ))}
        </section>

        {/* Ceremony */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl border-b border-border pb-2">Ceremonia</h2>
          <Field label="Lugar" value={form.ceremony_venue} onChange={(v) => update("ceremony_venue", v)} placeholder="Iglesia de Santa María" />
          <Field label="Dirección" value={form.ceremony_address} onChange={(v) => update("ceremony_address", v)} placeholder="Calle Mayor, 12" />
          <Field label="Hora" value={form.ceremony_time} onChange={(v) => update("ceremony_time", v)} placeholder="17:00" />
        </section>

        {/* Reception */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl border-b border-border pb-2">Celebración</h2>
          <Field label="Lugar" value={form.reception_venue} onChange={(v) => update("reception_venue", v)} placeholder="Finca Los Olivos" />
          <Field label="Dirección" value={form.reception_address} onChange={(v) => update("reception_address", v)} placeholder="Camino Rural s/n" />
          <Field label="Hora" value={form.reception_time} onChange={(v) => update("reception_time", v)} placeholder="19:30" />
        </section>

        {/* Menu */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl border-b border-border pb-2">Menú</h2>
          <Field label="Entrantes" value={form.menu_starters} onChange={(v) => update("menu_starters", v)} multiline placeholder="Un plato por línea..." />
          <Field label="Platos principales" value={form.menu_mains} onChange={(v) => update("menu_mains", v)} multiline placeholder="Un plato por línea..." />
          <Field label="Postres" value={form.menu_desserts} onChange={(v) => update("menu_desserts", v)} multiline placeholder="Un plato por línea..." />
        </section>

        {/* Accommodations */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="font-heading text-2xl">Alojamiento</h2>
            <button onClick={addAccommodation} className="inline-flex items-center gap-1 text-sm text-primary hover:opacity-80">
              <Plus className="w-4 h-4" /> Añadir
            </button>
          </div>
          {accommodations.map((a, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Alojamiento {i + 1}</span>
                <button onClick={() => removeAccommodation(i)} className="text-destructive hover:opacity-80">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <input value={a.name} onChange={(e) => updateAccommodation(i, "name", e.target.value)} className={inputClass} placeholder="Nombre del hotel" />
              <input value={a.address} onChange={(e) => updateAccommodation(i, "address", e.target.value)} className={inputClass} placeholder="Dirección" />
              <input value={a.phone} onChange={(e) => updateAccommodation(i, "phone", e.target.value)} className={inputClass} placeholder="Teléfono" />
              <input value={a.website} onChange={(e) => updateAccommodation(i, "website", e.target.value)} className={inputClass} placeholder="Web (URL)" />
              <textarea value={a.notes} onChange={(e) => updateAccommodation(i, "notes", e.target.value)} className={`${inputClass} resize-none`} rows={2} placeholder="Notas (precio orientativo, distancia...)" />
            </div>
          ))}
        </section>

        {/* Gift */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl border-b border-border pb-2">Regalos</h2>
          <Field label="Número de cuenta (IBAN)" value={form.bank_account} onChange={(v) => update("bank_account", v)} placeholder="ES12 3456 7890 ..." />
          <Field label="Mensaje para los invitados" value={form.gift_message} onChange={(v) => update("gift_message", v)} multiline placeholder="El mejor regalo es vuestra presencia..." />
        </section>

        {/* Dress code */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl border-b border-border pb-2">Código de vestimenta</h2>
          <Field label="Estilo" value={form.dress_code} onChange={(v) => update("dress_code", v)} placeholder="Elegante / Cóctel" />
        </section>

        {/* WhatsApp */}
        <section className="space-y-4">
          <h2 className="font-heading text-2xl border-b border-border pb-2">WhatsApp RSVP</h2>
          <Field label="Número de WhatsApp" value={form.whatsapp_number} onChange={(v) => update("whatsapp_number", v)} placeholder="+34 600 000 000" />
          <p className="text-xs text-muted-foreground">Los invitados podrán confirmar asistencia directamente por WhatsApp a este número.</p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="font-heading text-2xl">Agenda del día</h2>
            <button onClick={addAgendaItem} className="inline-flex items-center gap-1 text-sm text-primary hover:opacity-80">
              <Plus className="w-4 h-4" /> Añadir
            </button>
          </div>
          {agendaItems.map((a, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Evento {i + 1}</span>
                <button onClick={() => removeAgendaItem(i)} className="text-destructive hover:opacity-80">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <input value={a.title} onChange={(e) => updateAgendaItem(i, "title", e.target.value)} className={inputClass} placeholder="Título (ej: Ceremonia)" />
              <div className="grid grid-cols-2 gap-3">
                <input value={a.start_time} onChange={(e) => updateAgendaItem(i, "start_time", e.target.value)} className={inputClass} placeholder="Hora inicio (17:00)" />
                <input value={a.end_time} onChange={(e) => updateAgendaItem(i, "end_time", e.target.value)} className={inputClass} placeholder="Hora fin (18:00)" />
              </div>
              <input value={a.location} onChange={(e) => updateAgendaItem(i, "location", e.target.value)} className={inputClass} placeholder="Lugar" />
              <input value={a.description} onChange={(e) => updateAgendaItem(i, "description", e.target.value)} className={inputClass} placeholder="Descripción breve" />
              <select value={a.icon} onChange={(e) => updateAgendaItem(i, "icon", e.target.value)} className={inputClass}>
                <option value="clock">⏰ Reloj</option>
                <option value="church">⛪ Ceremonia</option>
                <option value="wine">🍷 Cóctel</option>
                <option value="food">🍽️ Banquete</option>
                <option value="music">🎵 Música</option>
                <option value="party">🎉 Fiesta</option>
                <option value="camera">📸 Fotos</option>
                <option value="location">📍 Lugar</option>
              </select>
            </div>
          ))}
        </section>

        {/* Seating / Mesas */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="font-heading text-2xl">Mesas</h2>
            <button onClick={addSeatingTable} className="inline-flex items-center gap-1 text-sm text-primary hover:opacity-80">
              <Plus className="w-4 h-4" /> Añadir mesa
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Los invitados solo verán las mesas un día antes de la boda.</p>
          {seatingTables.map((t, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Mesa {i + 1}</span>
                <button onClick={() => removeSeatingTable(i)} className="text-destructive hover:opacity-80">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={t.table_name} onChange={(e) => updateSeatingTable(i, "table_name", e.target.value)} className={inputClass} placeholder="Nombre (Mesa 1, Mesa Nupcial...)" />
                <input type="number" value={t.capacity} onChange={(e) => updateSeatingTable(i, "capacity", parseInt(e.target.value) || 8)} className={inputClass} placeholder="Capacidad" />
              </div>
              <textarea
                value={t.guests.join("\n")}
                onChange={(e) => updateSeatingGuests(i, e.target.value)}
                className={`${inputClass} resize-none`}
                rows={4}
                placeholder="Un invitado por línea..."
              />
            </div>
          ))}
        </section>

        {/* FAQ */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="font-heading text-2xl">Preguntas frecuentes</h2>
            <button onClick={addFaqItem} className="inline-flex items-center gap-1 text-sm text-primary hover:opacity-80">
              <Plus className="w-4 h-4" /> Añadir
            </button>
          </div>
          {faqItems.map((f, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Pregunta {i + 1}</span>
                <button onClick={() => removeFaqItem(i)} className="text-destructive hover:opacity-80">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <input value={f.question} onChange={(e) => updateFaqItem(i, "question", e.target.value)} className={inputClass} placeholder="¿Hay parking?" />
              <textarea value={f.answer} onChange={(e) => updateFaqItem(i, "answer", e.target.value)} className={`${inputClass} resize-none`} rows={2} placeholder="Sí, hay parking gratuito..." />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default EditWedding;
