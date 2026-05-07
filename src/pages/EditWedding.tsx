
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Save, ExternalLink, Plus, Trash2, Upload, Sparkles, Heart, MapPin, UtensilsCrossed, Hotel, Clock, Users, HelpCircle, Gift, Phone, Palette, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { usePurchase } from "@/hooks/usePurchase";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import { track, trackBeginCheckout } from "@/lib/analytics";

const inputClass = "w-full min-w-0 px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-light box-border text-sm";

const Field = ({ label, value, onChange, type = "text", placeholder = "", multiline = false, hint }: {
  label: string; value: string; onChange: (val: string) => void;
  type?: string; placeholder?: string; multiline?: boolean; hint?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
    {multiline ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
        className={`${inputClass} resize-none`} placeholder={placeholder} />
    ) : (
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className={inputClass} placeholder={placeholder} />
    )}
    {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
  </div>
);

const themes = [
  { id: "elegant", label: "Elegante", color: "hsl(33, 30%, 40%)" },
  { id: "romantic", label: "Romántico", color: "hsl(340, 45%, 55%)" },
  { id: "rustic", label: "Rústico", color: "hsl(25, 50%, 32%)" },
  { id: "modern", label: "Moderno", color: "hsl(220, 25%, 18%)" },
  { id: "garden", label: "Jardín", color: "hsl(150, 35%, 35%)" },
  { id: "bohemian", label: "Bohemio", color: "hsl(10, 55%, 45%)" },
  { id: "minimal", label: "Minimal", color: "hsl(0, 0%, 12%)" },
  { id: "tropical", label: "Tropical", color: "hsl(170, 55%, 35%)" },
  { id: "lavender", label: "Lavanda", color: "hsl(270, 35%, 50%)" },
  { id: "mediterranean", label: "Mediterráneo", color: "hsl(210, 50%, 40%)" },
  { id: "autumn", label: "Otoñal", color: "hsl(15, 60%, 40%)" },
  { id: "nocturnal", label: "Nocturno", color: "hsl(45, 60%, 60%)" },
];

const TABS = [
  { id: "diseno", label: "Diseño", icon: Palette, fields: ["theme_preset", "hero_image_url"] },
  { id: "pareja", label: "Pareja", icon: Heart, fields: ["partner1_name", "partner2_name", "wedding_date", "slug"] },
  { id: "lugar", label: "Lugar", icon: MapPin, fields: ["ceremony_venue", "ceremony_address", "ceremony_time", "reception_venue", "reception_address", "reception_time"] },
  { id: "menu", label: "Menú", icon: UtensilsCrossed, fields: ["menu_starters", "menu_mains", "menu_desserts"] },
  { id: "agenda", label: "Agenda", icon: Clock, fields: [] },
  { id: "mesas", label: "Mesas", icon: Users, fields: [] },
  { id: "alojamiento", label: "Alojamiento", icon: Hotel, fields: [] },
  { id: "extras", label: "Extras", icon: Gift, fields: ["bank_account", "gift_message", "dress_code", "whatsapp_number"] },
  { id: "historia", label: "Historia", icon: Heart, fields: [] },
  { id: "faq", label: "FAQ", icon: HelpCircle, fields: [] },
];

interface StoryItem { id?: string; title: string; description: string; story_date: string; sort_order: number; }
interface AccommodationItem { id?: string; name: string; address: string; phone: string; website: string; notes: string; sort_order: number; }
interface AgendaItem { id?: string; title: string; start_time: string; end_time: string; location: string; description: string; icon: string; sort_order: number; }
interface SeatingTableItem { id?: string; table_name: string; capacity: number; sort_order: number; guests: string[]; }
interface FaqItem { id?: string; question: string; answer: string; sort_order: number; }

const EditWedding = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { hasPurchase } = usePurchase();
  const { openCheckout, loading: checkoutLoading } = usePaddleCheckout();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [activeTab, setActiveTab] = useState("diseno");
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [accommodations, setAccommodations] = useState<AccommodationItem[]>([]);
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [seatingTables, setSeatingTables] = useState<SeatingTableItem[]>([]);
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [form, setForm] = useState({
    slug: "", partner1_name: "", partner2_name: "", wedding_date: "",
    ceremony_venue: "", ceremony_address: "", ceremony_time: "",
    reception_venue: "", reception_address: "", reception_time: "",
    bank_account: "", gift_message: "", dress_code: "",
    menu_starters: "", menu_mains: "", menu_desserts: "",
    theme_preset: "elegant", whatsapp_number: "", hero_image_url: "",
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
      const tables = (tablesData || []) as any[];
      const assigns = (assignData || []) as any[];
      setSeatingTables(tables.map((t) => ({
        id: t.id, table_name: t.table_name, capacity: t.capacity, sort_order: t.sort_order,
        guests: assigns.filter((a: any) => a.table_id === t.id).map((a: any) => a.guest_name),
      })));
      setLoading(false);
      // Prefer explicit ?tab= param (from dashboard onboarding links), then auto-open
      // "pareja" on first visit when the form has no data yet
      const tabFromUrl = searchParams.get("tab");
      if (tabFromUrl && TABS.some((t) => t.id === tabFromUrl)) {
        setActiveTab(tabFromUrl);
      } else if (wedding && !wedding.partner1_name && !wedding.partner2_name) {
        setActiveTab("pareja");
      }
    };
    fetchData();
  }, [user, id]);

  // Calcular progreso de completado
  const completionPct = Math.round(
    ([form.partner1_name, form.partner2_name, form.wedding_date, form.ceremony_venue,
      form.ceremony_address, form.reception_venue, form.hero_image_url].filter(Boolean).length / 7) * 100
  );

  const handleSave = async () => {
    setSaving(true);
    track("guardar_boda");
    const { error } = await supabase.from("weddings").update({
      slug: form.slug, partner1_name: form.partner1_name, partner2_name: form.partner2_name,
      wedding_date: form.wedding_date ? new Date(form.wedding_date).toISOString() : null,
      ceremony_venue: form.ceremony_venue, ceremony_address: form.ceremony_address, ceremony_time: form.ceremony_time,
      reception_venue: form.reception_venue, reception_address: form.reception_address, reception_time: form.reception_time,
      bank_account: form.bank_account, gift_message: form.gift_message, dress_code: form.dress_code,
      menu_starters: form.menu_starters, menu_mains: form.menu_mains, menu_desserts: form.menu_desserts,
      theme_preset: form.theme_preset, whatsapp_number: form.whatsapp_number, hero_image_url: form.hero_image_url,
    } as any).eq("id", id!);

    await supabase.from("wedding_stories").delete().eq("wedding_id", id!);
    if (stories.length > 0) await supabase.from("wedding_stories").insert(stories.map((s, i) => ({ wedding_id: id!, title: s.title, description: s.description, story_date: s.story_date, sort_order: i })));

    await supabase.from("accommodations").delete().eq("wedding_id", id!);
    if (accommodations.length > 0) await supabase.from("accommodations").insert(accommodations.map((a, i) => ({ wedding_id: id!, name: a.name, address: a.address, phone: a.phone, website: a.website, notes: a.notes, sort_order: i })));

    await supabase.from("agenda_items").delete().eq("wedding_id", id!);
    if (agendaItems.length > 0) await supabase.from("agenda_items").insert(agendaItems.map((a, i) => ({ wedding_id: id!, title: a.title, start_time: a.start_time, end_time: a.end_time, location: a.location, description: a.description, icon: a.icon, sort_order: i })));

    await supabase.from("seating_assignments").delete().eq("wedding_id", id!);
    await supabase.from("seating_tables").delete().eq("wedding_id", id!);
    for (let i = 0; i < seatingTables.length; i++) {
      const t = seatingTables[i];
      const { data: tableData } = await supabase.from("seating_tables").insert({ wedding_id: id!, table_name: t.table_name, capacity: t.capacity, sort_order: i }).select("id").single();
      if (tableData && t.guests.length > 0) await supabase.from("seating_assignments").insert(t.guests.filter(g => g.trim()).map(g => ({ wedding_id: id!, table_id: tableData.id, guest_name: g.trim() })));
    }

    await supabase.from("faqs").delete().eq("wedding_id", id!);
    if (faqItems.length > 0) await supabase.from("faqs").insert(faqItems.map((f, i) => ({ wedding_id: id!, question: f.question, answer: f.answer, sort_order: i })));

    if (error) toast.error("Error al guardar");
    else toast.success("¡Cambios guardados! ✓");
    setSaving(false);
  };

  const handleBuy = (priceId: string) => {
    const planKey = priceId.includes("basico") ? "basico" : "completo" as "basico" | "completo";
    trackBeginCheckout(planKey);
    track("clic_publicar_editor", { plan: planKey });
    openCheckout({ priceId, customerEmail: user?.email || undefined, customData: { userId: user?.id || "" }, successUrl: `${window.location.origin}/dashboard?checkout=success` });
  };

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;
    setUploadingHero(true);
    const ext = file.name.split(".").pop();
    const path = `${id}/hero.${ext}`;
    const { error: uploadError } = await supabase.storage.from("wedding-photos").upload(path, file, { upsert: true });
    if (uploadError) { toast.error("Error al subir la imagen"); setUploadingHero(false); return; }
    const { data: urlData } = supabase.storage.from("wedding-photos").getPublicUrl(path);
    update("hero_image_url", urlData.publicUrl);
    setUploadingHero(false);
    toast.success("Imagen subida ✓");
  };

  const addStory = () => setStories([...stories, { title: "", description: "", story_date: "", sort_order: stories.length }]);
  const removeStory = (i: number) => setStories(stories.filter((_, idx) => idx !== i));
  const updateStory = (i: number, key: keyof StoryItem, val: string) => setStories(stories.map((s, idx) => idx === i ? { ...s, [key]: val } : s));

  const addAccommodation = () => setAccommodations([...accommodations, { name: "", address: "", phone: "", website: "", notes: "", sort_order: accommodations.length }]);
  const removeAccommodation = (i: number) => setAccommodations(accommodations.filter((_, idx) => idx !== i));
  const updateAccommodation = (i: number, key: keyof AccommodationItem, val: string) => setAccommodations(accommodations.map((a, idx) => idx === i ? { ...a, [key]: val } : a));

  const addAgendaItem = () => setAgendaItems([...agendaItems, { title: "", start_time: "", end_time: "", location: "", description: "", icon: "clock", sort_order: agendaItems.length }]);
  const removeAgendaItem = (i: number) => setAgendaItems(agendaItems.filter((_, idx) => idx !== i));
  const updateAgendaItem = (i: number, key: keyof AgendaItem, val: string) => setAgendaItems(agendaItems.map((a, idx) => idx === i ? { ...a, [key]: val } : a));

  const addSeatingTable = () => setSeatingTables([...seatingTables, { table_name: "", capacity: 8, sort_order: seatingTables.length, guests: [] }]);
  const removeSeatingTable = (i: number) => setSeatingTables(seatingTables.filter((_, idx) => idx !== i));
  const updateSeatingTable = (i: number, key: string, val: any) => setSeatingTables(seatingTables.map((t, idx) => idx === i ? { ...t, [key]: val } : t));
  const updateSeatingGuests = (i: number, val: string) => setSeatingTables(seatingTables.map((t, idx) => idx === i ? { ...t, guests: val.split("\n") } : t));

  const addFaqItem = () => setFaqItems([...faqItems, { question: "", answer: "", sort_order: faqItems.length }]);
  const removeFaqItem = (i: number) => setFaqItems(faqItems.filter((_, idx) => idx !== i));
  const updateFaqItem = (i: number, key: keyof FaqItem, val: string) => setFaqItems(faqItems.map((f, idx) => idx === i ? { ...f, [key]: val } : f));

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Heart className="w-8 h-8 text-primary animate-pulse" />
      </div>
    );
  }

  const currentTabIdx = TABS.findIndex((t) => t.id === activeTab);
  const nextTab = TABS[currentTabIdx + 1];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-md z-50">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/dashboard" className="p-2 rounded-md hover:bg-secondary transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <span className="font-heading text-lg truncate block">
              {form.partner1_name && form.partner2_name ? `${form.partner1_name} & ${form.partner2_name}` : "Editar boda"}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="h-1 w-20 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${completionPct}%` }} />
              </div>
              <span className="text-xs text-muted-foreground">{completionPct}% completado</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!hasPurchase && (
            <button onClick={() => handleBuy("completo_one_time")} disabled={checkoutLoading}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
              <Sparkles className="w-3.5 h-3.5" /> Publicar · desde 30€
            </button>
          )}
          <Link to={`/w/${form.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs hover:opacity-90 transition-opacity">
            <ExternalLink className="w-3.5 h-3.5" /> Ver
          </Link>
          <button onClick={handleSave} disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
            <Save className="w-3.5 h-3.5" /> {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </header>

      {/* Banner publicar */}
      {!hasPurchase && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
          <p className="text-amber-700 text-xs font-light">Tu boda está en modo preview — publícala para que tus invitados puedan verla</p>
          <div className="flex gap-2 shrink-0 w-full sm:w-auto">
            <button onClick={() => handleBuy("basico_one_time")} disabled={checkoutLoading}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg border border-amber-400 text-amber-700 text-xs font-medium hover:bg-amber-100 transition-colors whitespace-nowrap min-h-[40px]">
              Básico · 30€
            </button>
            <button onClick={() => handleBuy("completo_one_time")} disabled={checkoutLoading}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-amber-500 text-white text-xs font-medium hover:opacity-90 transition-opacity whitespace-nowrap min-h-[40px]">
              Completo · 60€ ⭐
            </button>
          </div>
        </div>
      )}

      {/* Tabs — mobile (fuera del flex) */}
      <div className="md:hidden border-b border-border bg-card/50">
        <div className="flex overflow-x-auto scrollbar-hide px-2 py-1.5 gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-3 rounded-lg text-xs whitespace-nowrap transition-all flex-shrink-0 min-h-[44px] ${
                  activeTab === tab.id ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-57px)]">
        {/* Sidebar tabs — desktop */}
        <aside className="hidden md:flex flex-col w-52 border-r border-border bg-card/50 shrink-0 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
          <div className="p-3 space-y-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Contenido */}
        <main className="flex-1 min-w-0">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">

            {/* DISEÑO */}
            {activeTab === "diseno" && (
              <>
                <div>
                  <h2 className="font-heading text-xl text-foreground mb-1">Tema visual</h2>
                  <p className="text-muted-foreground text-sm mb-4">Elige el estilo de tu web de boda</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {themes.map((t) => (
                      <button key={t.id} onClick={() => update("theme_preset", t.id)}
                        className={`p-3 rounded-xl border-2 transition-all text-center ${form.theme_preset === t.id ? "border-primary shadow-md" : "border-border hover:border-muted-foreground"}`}>
                        <div className="w-8 h-8 rounded-full mx-auto mb-2 shadow-sm" style={{ backgroundColor: t.color }} />
                        <span className="text-xs font-medium text-foreground">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Imagen principal (hero)</label>
                  {form.hero_image_url && (
                    <div className="mb-3 rounded-xl overflow-hidden h-40 border border-border">
                      <img src={form.hero_image_url} alt="Hero" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-border bg-card text-sm cursor-pointer hover:border-primary hover:bg-primary/5 transition-all w-full justify-center ${uploadingHero ? "opacity-50 pointer-events-none" : ""}`}>
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{uploadingHero ? "Subiendo..." : form.hero_image_url ? "Cambiar imagen" : "Subir imagen de portada"}</span>
                    <input type="file" accept="image/*" onChange={handleHeroUpload} className="hidden" />
                  </label>
                  <p className="text-xs text-muted-foreground mt-1.5">Formato JPG o PNG. Recomendado: 1600x900px o mayor.</p>
                </div>
              </>
            )}

            {/* PAREJA */}
            {activeTab === "pareja" && (
              <>
                {!form.partner1_name && !form.partner2_name && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-primary/10 border border-primary/20 rounded-xl text-sm text-primary animate-fade-in">
                    <span className="text-lg flex-shrink-0">💍</span>
                    <span>Empieza aquí — pon vuestros nombres y la fecha de la boda</span>
                  </div>
                )}
                <div>
                  <h2 className="font-heading text-xl text-foreground mb-4">Los novios</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Nombre 1" value={form.partner1_name} onChange={(v) => update("partner1_name", v)} placeholder="María" />
                    <Field label="Nombre 2" value={form.partner2_name} onChange={(v) => update("partner2_name", v)} placeholder="Carlos" />
                  </div>
                </div>
                <Field label="Fecha de la boda" value={form.wedding_date} onChange={(v) => update("wedding_date", v)} type="date" />
                <Field label="URL personalizada" value={form.slug}
                  onChange={(v) => update("slug", v.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"))}
                  placeholder="maria-y-carlos"
                  hint={`Tu web estará en: bodasfacil.com/w/${form.slug || "tu-slug"}`} />
              </>
            )}

            {/* LUGAR */}
            {activeTab === "lugar" && (
              <>
                <div>
                  <h2 className="font-heading text-xl text-foreground mb-4">Ceremonia</h2>
                  <div className="space-y-4">
                    <Field label="Lugar" value={form.ceremony_venue} onChange={(v) => update("ceremony_venue", v)} placeholder="Iglesia de Santa María" />
                    <Field label="Dirección" value={form.ceremony_address} onChange={(v) => update("ceremony_address", v)} placeholder="Calle Mayor, 12, Valencia" />
                    <Field label="Hora" value={form.ceremony_time} onChange={(v) => update("ceremony_time", v)} placeholder="17:00" />
                  </div>
                </div>
                <div>
                  <h2 className="font-heading text-xl text-foreground mb-4">Celebración</h2>
                  <div className="space-y-4">
                    <Field label="Lugar" value={form.reception_venue} onChange={(v) => update("reception_venue", v)} placeholder="Finca Los Olivos" />
                    <Field label="Dirección" value={form.reception_address} onChange={(v) => update("reception_address", v)} placeholder="Camino Rural s/n" />
                    <Field label="Hora" value={form.reception_time} onChange={(v) => update("reception_time", v)} placeholder="19:30" />
                  </div>
                </div>
              </>
            )}

            {/* MENÚ */}
            {activeTab === "menu" && (
              <>
                <h2 className="font-heading text-xl text-foreground mb-4">Menú del banquete</h2>
                <Field label="Entrantes" value={form.menu_starters} onChange={(v) => update("menu_starters", v)} multiline placeholder="Un plato por línea..." />
                <Field label="Platos principales" value={form.menu_mains} onChange={(v) => update("menu_mains", v)} multiline placeholder="Un plato por línea..." />
                <Field label="Postres" value={form.menu_desserts} onChange={(v) => update("menu_desserts", v)} multiline placeholder="Un plato por línea..." />
              </>
            )}

            {/* AGENDA */}
            {activeTab === "agenda" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-xl text-foreground">Agenda del día</h2>
                  <button onClick={addAgendaItem} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">
                    <Plus className="w-3.5 h-3.5" /> Añadir evento
                  </button>
                </div>
                {agendaItems.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
                    <Clock className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-40" />
                    <p className="text-muted-foreground text-sm">Sin eventos aún. Añade la ceremonia, cóctel, banquete...</p>
                  </div>
                )}
                {agendaItems.map((a, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Evento {i + 1}</span>
                      <button onClick={() => removeAgendaItem(i)} className="text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <input value={a.title} onChange={(e) => updateAgendaItem(i, "title", e.target.value)} className={inputClass} placeholder="Título (ej: Ceremonia)" />
                    <div className="grid grid-cols-2 gap-3">
                      <input value={a.start_time} onChange={(e) => updateAgendaItem(i, "start_time", e.target.value)} className={inputClass} placeholder="Inicio (17:00)" />
                      <input value={a.end_time} onChange={(e) => updateAgendaItem(i, "end_time", e.target.value)} className={inputClass} placeholder="Fin (18:00)" />
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
              </>
            )}

            {/* MESAS */}
            {activeTab === "mesas" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-heading text-xl text-foreground">Plan de mesas</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Los invitados solo verán las mesas un día antes de la boda</p>
                  </div>
                  <button onClick={addSeatingTable} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">
                    <Plus className="w-3.5 h-3.5" /> Añadir mesa
                  </button>
                </div>
                {seatingTables.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
                    <Users className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-40" />
                    <p className="text-muted-foreground text-sm">Sin mesas todavía. Añade tus mesas y asigna invitados.</p>
                  </div>
                )}
                {seatingTables.map((t, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Mesa {i + 1} · {t.guests.filter(g => g.trim()).length} invitados</span>
                      <button onClick={() => removeSeatingTable(i)} className="text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input value={t.table_name} onChange={(e) => updateSeatingTable(i, "table_name", e.target.value)} className={inputClass} placeholder="Nombre (Mesa 1, Nupcial...)" />
                      <input type="number" value={t.capacity} onChange={(e) => updateSeatingTable(i, "capacity", parseInt(e.target.value) || 8)} className={inputClass} placeholder="Capacidad" />
                    </div>
                    <textarea value={t.guests.join("\n")} onChange={(e) => updateSeatingGuests(i, e.target.value)}
                      className={`${inputClass} resize-none`} rows={4} placeholder="Un invitado por línea..." />
                  </div>
                ))}
              </>
            )}

            {/* ALOJAMIENTO */}
            {activeTab === "alojamiento" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-xl text-foreground">Alojamiento recomendado</h2>
                  <button onClick={addAccommodation} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">
                    <Plus className="w-3.5 h-3.5" /> Añadir
                  </button>
                </div>
                {accommodations.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
                    <Hotel className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-40" />
                    <p className="text-muted-foreground text-sm">Añade hoteles cercanos para tus invitados.</p>
                  </div>
                )}
                {accommodations.map((a, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Alojamiento {i + 1}</span>
                      <button onClick={() => removeAccommodation(i)} className="text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <input value={a.name} onChange={(e) => updateAccommodation(i, "name", e.target.value)} className={inputClass} placeholder="Hotel Nombre" />
                    <input value={a.address} onChange={(e) => updateAccommodation(i, "address", e.target.value)} className={inputClass} placeholder="Dirección" />
                    <input value={a.phone} onChange={(e) => updateAccommodation(i, "phone", e.target.value)} className={inputClass} placeholder="Teléfono" />
                    <input value={a.website} onChange={(e) => updateAccommodation(i, "website", e.target.value)} className={inputClass} placeholder="Web (URL)" />
                    <textarea value={a.notes} onChange={(e) => updateAccommodation(i, "notes", e.target.value)} className={`${inputClass} resize-none`} rows={2} placeholder="Precio orientativo, distancia..." />
                  </div>
                ))}
              </>
            )}

            {/* EXTRAS */}
            {activeTab === "extras" && (
              <>
                <div>
                  <h2 className="font-heading text-xl text-foreground mb-4">Regalos</h2>
                  <div className="space-y-4">
                    <Field label="Número de cuenta (IBAN)" value={form.bank_account} onChange={(v) => update("bank_account", v)} placeholder="ES12 3456 7890 1234 5678 9012" />
                    <Field label="Mensaje para los invitados" value={form.gift_message} onChange={(v) => update("gift_message", v)} multiline placeholder="El mejor regalo es vuestra presencia..." />
                  </div>
                </div>
                <div>
                  <h2 className="font-heading text-xl text-foreground mb-4">Código de vestimenta</h2>
                  <Field label="Estilo" value={form.dress_code} onChange={(v) => update("dress_code", v)} placeholder="Elegante / Cóctel / Casual" />
                </div>
                <div>
                  <h2 className="font-heading text-xl text-foreground mb-4">WhatsApp RSVP</h2>
                  <Field label="Número de WhatsApp" value={form.whatsapp_number} onChange={(v) => update("whatsapp_number", v)}
                    placeholder="+34 600 000 000"
                    hint="Los invitados podrán confirmar asistencia directamente por WhatsApp." />
                </div>
              </>
            )}

            {/* HISTORIA */}
            {activeTab === "historia" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-heading text-xl text-foreground">Vuestra historia</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Los hitos de vuestra relación</p>
                  </div>
                  <button onClick={addStory} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">
                    <Plus className="w-3.5 h-3.5" /> Añadir hito
                  </button>
                </div>
                {stories.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
                    <Heart className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-40" />
                    <p className="text-muted-foreground text-sm">Añade los momentos especiales de vuestra historia de amor.</p>
                  </div>
                )}
                {stories.map((s, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Hito {i + 1}</span>
                      <button onClick={() => removeStory(i)} className="text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <input value={s.title} onChange={(e) => updateStory(i, "title", e.target.value)} className={inputClass} placeholder="Título (ej: Nos conocimos)" />
                    <input value={s.story_date} onChange={(e) => updateStory(i, "story_date", e.target.value)} className={inputClass} placeholder="Fecha (ej: Junio 2020)" />
                    <textarea value={s.description} onChange={(e) => updateStory(i, "description", e.target.value)} className={`${inputClass} resize-none`} rows={2} placeholder="Descripción..." />
                  </div>
                ))}
              </>
            )}

            {/* FAQ */}
            {activeTab === "faq" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-heading text-xl text-foreground">Preguntas frecuentes</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Resuelve las dudas de tus invitados</p>
                  </div>
                  <button onClick={addFaqItem} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">
                    <Plus className="w-3.5 h-3.5" /> Añadir
                  </button>
                </div>
                {faqItems.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
                    <HelpCircle className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-40" />
                    <p className="text-muted-foreground text-sm mb-3">¿Hay parking? ¿Se admiten niños? ¿Qué me pongo?</p>
                    <button onClick={() => {
                      setFaqItems([
                        { question: "¿Hay parking?", answer: "Sí, hay parking gratuito en la finca.", sort_order: 0 },
                        { question: "¿Se admiten niños?", answer: "¡Por supuesto! Los niños son bienvenidos.", sort_order: 1 },
                        { question: "¿Cuál es el código de vestimenta?", answer: form.dress_code || "Elegante.", sort_order: 2 },
                        { question: "¿Cómo llego?", answer: "Puedes usar el mapa en la sección de Lugar.", sort_order: 3 },
                      ]);
                    }} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
                      Cargar preguntas predefinidas
                    </button>
                  </div>
                )}
                {faqItems.map((f, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Pregunta {i + 1}</span>
                      <button onClick={() => removeFaqItem(i)} className="text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <input value={f.question} onChange={(e) => updateFaqItem(i, "question", e.target.value)} className={inputClass} placeholder="¿Hay parking?" />
                    <textarea value={f.answer} onChange={(e) => updateFaqItem(i, "answer", e.target.value)} className={`${inputClass} resize-none`} rows={2} placeholder="Sí, hay parking gratuito..." />
                  </div>
                ))}
              </>
            )}

            {/* Navegación entre tabs */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <button onClick={handleSave} disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                <Save className="w-4 h-4" /> {saving ? "Guardando..." : "Guardar cambios"}
              </button>
              {nextTab && (
                <button onClick={() => { handleSave(); setActiveTab(nextTab.id); }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-all">
                  {nextTab.label} <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default EditWedding;
