import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft, Save, ExternalLink, Plus, Trash2, Upload, Sparkles,
  Heart, MapPin, UtensilsCrossed, Hotel, Clock, Users, HelpCircle,
  Gift, Palette, ChevronRight, Eye, EyeOff, Check
} from "lucide-react";
import { toast } from "sonner";
import { usePurchase } from "@/hooks/usePurchase";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";

declare global {
  interface Window { gtag?: (...args: any[]) => void; }
}

const inputClass = "w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-light text-sm transition-all";

const Field = ({ label, value, onChange, type = "text", placeholder = "", multiline = false, hint }: {
  label: string; value: string; onChange: (val: string) => void;
  type?: string; placeholder?: string; multiline?: boolean; hint?: string;
}) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
    {multiline ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
        className={`${inputClass} resize-none`} placeholder={placeholder} />
    ) : (
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className={inputClass} placeholder={placeholder} />
    )}
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
);

const THEMES = [
  { id: "elegant", label: "Elegante", bg: "#8a6d3b", accent: "#f5f0e8" },
  { id: "romantic", label: "Romántico", bg: "#c45c7a", accent: "#fdf0f3" },
  { id: "rustic", label: "Rústico", bg: "#6b4423", accent: "#f5ede4" },
  { id: "modern", label: "Moderno", bg: "#1e2a3a", accent: "#f0f3f8" },
  { id: "garden", label: "Jardín", bg: "#3a7a52", accent: "#f0f8f2" },
  { id: "bohemian", label: "Bohemio", bg: "#c4603a", accent: "#fdf3ee" },
  { id: "minimal", label: "Minimal", bg: "#1a1a1a", accent: "#f8f8f8" },
  { id: "tropical", label: "Tropical", bg: "#2a8a72", accent: "#f0faf6" },
  { id: "lavender", label: "Lavanda", bg: "#7a52a8", accent: "#f5f0fc" },
  { id: "mediterranean", label: "Mediterráneo", bg: "#2a5a8a", accent: "#f0f5fc" },
  { id: "autumn", label: "Otoñal", bg: "#8a3a1a", accent: "#fdf2ee" },
  { id: "nocturnal", label: "Nocturno", bg: "#c8a84a", accent: "#0f1220" },
];

const TABS = [
  { id: "diseno", label: "Diseño", icon: Palette },
  { id: "pareja", label: "Pareja", icon: Heart },
  { id: "lugar", label: "Lugar", icon: MapPin },
  { id: "menu", label: "Menú", icon: UtensilsCrossed },
  { id: "agenda", label: "Agenda", icon: Clock },
  { id: "mesas", label: "Mesas", icon: Users },
  { id: "alojamiento", label: "Alojamiento", icon: Hotel },
  { id: "extras", label: "Extras", icon: Gift },
  { id: "historia", label: "Historia", icon: Heart },
  { id: "faq", label: "FAQ", icon: HelpCircle },
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [activeTab, setActiveTab] = useState("diseno");
  const [showPreview, setShowPreview] = useState(true);
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

  const completionPct = Math.round(
    ([form.partner1_name, form.partner2_name, form.wedding_date, form.ceremony_venue,
      form.ceremony_address, form.reception_venue, form.hero_image_url].filter(Boolean).length / 7) * 100
  );

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user || !id) return;
    const fetchData = async () => {
      const [{ data: wedding }, { data: storyData }, { data: accommData }, { data: agendaData },
        { data: tablesData }, { data: assignData }, { data: faqData }] = await Promise.all([
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
          slug: wedding.slug || "", partner1_name: wedding.partner1_name || "",
          partner2_name: wedding.partner2_name || "",
          wedding_date: wedding.wedding_date ? wedding.wedding_date.split("T")[0] : "",
          ceremony_venue: wedding.ceremony_venue || "", ceremony_address: wedding.ceremony_address || "",
          ceremony_time: wedding.ceremony_time || "", reception_venue: wedding.reception_venue || "",
          reception_address: wedding.reception_address || "", reception_time: wedding.reception_time || "",
          bank_account: wedding.bank_account || "", gift_message: wedding.gift_message || "",
          dress_code: wedding.dress_code || "", menu_starters: wedding.menu_starters || "",
          menu_mains: wedding.menu_mains || "", menu_desserts: wedding.menu_desserts || "",
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
    };
    fetchData();
  }, [user, id]);

  const handleSave = async () => {
    setSaving(true);
    window.gtag?.("event", "guardar_boda", {});
    await supabase.from("weddings").update({
      slug: form.slug, partner1_name: form.partner1_name, partner2_name: form.partner2_name,
      wedding_date: form.wedding_date ? new Date(form.wedding_date + "T12:00:00").toISOString() : null,
      ceremony_venue: form.ceremony_venue, ceremony_address: form.ceremony_address,
      ceremony_time: form.ceremony_time, reception_venue: form.reception_venue,
      reception_address: form.reception_address, reception_time: form.reception_time,
      bank_account: form.bank_account, gift_message: form.gift_message, dress_code: form.dress_code,
      menu_starters: form.menu_starters, menu_mains: form.menu_mains, menu_desserts: form.menu_desserts,
      theme_preset: form.theme_preset, whatsapp_number: form.whatsapp_number,
      hero_image_url: form.hero_image_url,
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

    toast.success("¡Cambios guardados! ✓");
    setSaving(false);
  };

  const handleBuy = (priceId: string) => {
    window.gtag?.("event", "clic_publicar_editor", { plan: priceId });
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

  // Lista helpers
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

  // Preview del tema actual
  const currentTheme = THEMES.find(t => t.id === form.theme_preset) || THEMES[0];

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
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">

      {/* Header compacto */}
      <header className="border-b border-border px-4 py-2.5 flex items-center justify-between bg-background/95 backdrop-blur-md z-50 shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="p-1.5 rounded-md hover:bg-secondary transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="font-heading text-base block leading-tight">
              {form.partner1_name && form.partner2_name ? `${form.partner1_name} & ${form.partner2_name}` : "Editar boda"}
            </span>
            <div className="flex items-center gap-2">
              <div className="h-1 w-16 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${completionPct}%` }} />
              </div>
              <span className="text-[10px] text-muted-foreground">{completionPct}%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {!hasPurchase && (
            <button onClick={() => handleBuy("completo_one_time")} disabled={checkoutLoading}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">
              <Sparkles className="w-3 h-3" /> Publicar
            </button>
          )}
          <button onClick={() => setShowPreview(!showPreview)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"
            title={showPreview ? "Ocultar preview" : "Mostrar preview"}>
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <Link to={`/w/${form.slug}`} target="_blank"
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 disabled:opacity-50">
            <Save className="w-3.5 h-3.5" /> {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </header>

      {/* Banner preview */}
      {!hasPurchase && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between gap-4 shrink-0">
          <p className="text-amber-700 text-xs">Tu boda está en modo preview</p>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => handleBuy("basico_one_time")} disabled={checkoutLoading}
              className="px-2.5 py-1 rounded border border-amber-400 text-amber-700 text-xs font-medium hover:bg-amber-100">30€</button>
            <button onClick={() => handleBuy("completo_one_time")} disabled={checkoutLoading}
              className="px-2.5 py-1 rounded bg-amber-500 text-white text-xs font-medium hover:opacity-90">60€ ⭐</button>
          </div>
        </div>
      )}

      {/* Layout principal — editor + preview */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Panel izquierdo — editor */}
        <div className={`flex flex-col border-r border-border transition-all duration-300 ${showPreview ? "w-full md:w-[380px] lg:w-[420px]" : "w-full"} shrink-0`}>

          {/* Tabs de navegación */}
          <div className="flex overflow-x-auto scrollbar-hide border-b border-border bg-secondary/30 shrink-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-xs whitespace-nowrap transition-all border-b-2 flex-shrink-0 ${
                    activeTab === tab.id ? "border-primary text-primary font-medium bg-background" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}>
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Contenido del tab */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">

            {/* DISEÑO */}
            {activeTab === "diseno" && (
              <>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Tema visual</p>
                  <div className="grid grid-cols-4 gap-2">
                    {THEMES.map((t) => (
                      <button key={t.id} onClick={() => update("theme_preset", t.id)}
                        className={`relative p-2 rounded-xl border-2 transition-all text-center group ${form.theme_preset === t.id ? "border-primary shadow-md" : "border-border hover:border-muted-foreground"}`}>
                        <div className="w-full aspect-square rounded-lg mb-1.5 overflow-hidden flex"
                          style={{ background: t.bg }}>
                          <div className="w-1/2 h-full" style={{ background: t.bg }} />
                          <div className="w-1/2 h-full" style={{ background: t.accent }} />
                        </div>
                        <span className="text-[10px] font-medium text-foreground leading-tight block">{t.label}</span>
                        {form.theme_preset === t.id && (
                          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-primary-foreground" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Imagen de portada</p>
                  {form.hero_image_url && (
                    <div className="mb-2 rounded-xl overflow-hidden h-32 border border-border">
                      <img src={form.hero_image_url} alt="Hero" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className={`flex items-center gap-2 px-3 py-3 rounded-lg border-2 border-dashed border-border cursor-pointer hover:border-primary hover:bg-primary/5 transition-all justify-center text-sm text-muted-foreground ${uploadingHero ? "opacity-50 pointer-events-none" : ""}`}>
                    <Upload className="w-4 h-4" />
                    {uploadingHero ? "Subiendo..." : form.hero_image_url ? "Cambiar imagen" : "Subir imagen de portada"}
                    <input type="file" accept="image/*" onChange={handleHeroUpload} className="hidden" />
                  </label>
                  <p className="text-xs text-muted-foreground mt-1.5">JPG o PNG · Recomendado: 1600x900px</p>
                </div>
              </>
            )}

            {/* PAREJA */}
            {activeTab === "pareja" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Nombre 1" value={form.partner1_name} onChange={(v) => update("partner1_name", v)} placeholder="María" />
                  <Field label="Nombre 2" value={form.partner2_name} onChange={(v) => update("partner2_name", v)} placeholder="Carlos" />
                </div>
                <Field label="Fecha de la boda" value={form.wedding_date} onChange={(v) => update("wedding_date", v)} type="date" />
                <Field label="URL personalizada" value={form.slug}
                  onChange={(v) => update("slug", v.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"))}
                  placeholder="maria-y-carlos"
                  hint={`bodasfacil.com/w/${form.slug || "tu-slug"}`} />
              </>
            )}

            {/* LUGAR */}
            {activeTab === "lugar" && (
              <>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Ceremonia</p>
                  <div className="space-y-3">
                    <Field label="Lugar" value={form.ceremony_venue} onChange={(v) => update("ceremony_venue", v)} placeholder="Iglesia de Santa María" />
                    <Field label="Dirección" value={form.ceremony_address} onChange={(v) => update("ceremony_address", v)} placeholder="Calle Mayor, 12, Valencia" />
                    <Field label="Hora" value={form.ceremony_time} onChange={(v) => update("ceremony_time", v)} placeholder="17:00" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Celebración</p>
                  <div className="space-y-3">
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
                <Field label="Entrantes" value={form.menu_starters} onChange={(v) => update("menu_starters", v)} multiline placeholder="Un plato por línea..." />
                <Field label="Platos principales" value={form.menu_mains} onChange={(v) => update("menu_mains", v)} multiline placeholder="Un plato por línea..." />
                <Field label="Postres" value={form.menu_desserts} onChange={(v) => update("menu_desserts", v)} multiline placeholder="Un plato por línea..." />
              </>
            )}

            {/* AGENDA */}
            {activeTab === "agenda" && (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Eventos del día</p>
                  <button onClick={addAgendaItem} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">
                    <Plus className="w-3 h-3" /> Añadir
                  </button>
                </div>
                {agendaItems.length === 0 && (
                  <div className="text-center py-6 border-2 border-dashed border-border rounded-xl">
                    <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
                    <p className="text-muted-foreground text-sm">Añade ceremonia, cóctel, banquete...</p>
                  </div>
                )}
                {agendaItems.map((a, i) => (
                  <div key={i} className="bg-secondary/50 rounded-xl p-3 space-y-2.5 border border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-medium">Evento {i + 1}</span>
                      <button onClick={() => removeAgendaItem(i)} className="text-muted-foreground hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <input value={a.title} onChange={(e) => updateAgendaItem(i, "title", e.target.value)} className={inputClass} placeholder="Ceremonia" />
                    <div className="grid grid-cols-2 gap-2">
                      <input value={a.start_time} onChange={(e) => updateAgendaItem(i, "start_time", e.target.value)} className={inputClass} placeholder="17:00" />
                      <input value={a.end_time} onChange={(e) => updateAgendaItem(i, "end_time", e.target.value)} className={inputClass} placeholder="18:00" />
                    </div>
                    <input value={a.location} onChange={(e) => updateAgendaItem(i, "location", e.target.value)} className={inputClass} placeholder="Lugar" />
                    <select value={a.icon} onChange={(e) => updateAgendaItem(i, "icon", e.target.value)} className={inputClass}>
                      <option value="clock">⏰ Reloj</option><option value="church">⛪ Ceremonia</option>
                      <option value="wine">🍷 Cóctel</option><option value="food">🍽️ Banquete</option>
                      <option value="music">🎵 Música</option><option value="party">🎉 Fiesta</option>
                    </select>
                  </div>
                ))}
              </>
            )}

            {/* MESAS */}
            {activeTab === "mesas" && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Plan de mesas</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Visible 24h antes de la boda</p>
                  </div>
                  <button onClick={addSeatingTable} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">
                    <Plus className="w-3 h-3" /> Mesa
                  </button>
                </div>
                {seatingTables.map((t, i) => (
                  <div key={i} className="bg-secondary/50 rounded-xl p-3 space-y-2.5 border border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Mesa {i + 1} · {t.guests.filter(g => g.trim()).length} invitados</span>
                      <button onClick={() => removeSeatingTable(i)} className="text-muted-foreground hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input value={t.table_name} onChange={(e) => updateSeatingTable(i, "table_name", e.target.value)} className={inputClass} placeholder="Mesa 1" />
                      <input type="number" value={t.capacity} onChange={(e) => updateSeatingTable(i, "capacity", parseInt(e.target.value) || 8)} className={inputClass} placeholder="8" />
                    </div>
                    <textarea value={t.guests.join("\n")} onChange={(e) => updateSeatingGuests(i, e.target.value)} className={`${inputClass} resize-none`} rows={3} placeholder="Un invitado por línea..." />
                  </div>
                ))}
              </>
            )}

            {/* ALOJAMIENTO */}
            {activeTab === "alojamiento" && (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Hoteles recomendados</p>
                  <button onClick={addAccommodation} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">
                    <Plus className="w-3 h-3" /> Añadir
                  </button>
                </div>
                {accommodations.map((a, i) => (
                  <div key={i} className="bg-secondary/50 rounded-xl p-3 space-y-2.5 border border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Hotel {i + 1}</span>
                      <button onClick={() => removeAccommodation(i)} className="text-muted-foreground hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <input value={a.name} onChange={(e) => updateAccommodation(i, "name", e.target.value)} className={inputClass} placeholder="Nombre del hotel" />
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
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Regalos</p>
                  <div className="space-y-3">
                    <Field label="IBAN" value={form.bank_account} onChange={(v) => update("bank_account", v)} placeholder="ES12 3456 7890..." />
                    <Field label="Mensaje" value={form.gift_message} onChange={(v) => update("gift_message", v)} multiline placeholder="El mejor regalo es vuestra presencia..." />
                  </div>
                </div>
                <Field label="Código de vestimenta" value={form.dress_code} onChange={(v) => update("dress_code", v)} placeholder="Elegante / Cóctel" />
                <Field label="WhatsApp RSVP" value={form.whatsapp_number} onChange={(v) => update("whatsapp_number", v)} placeholder="+34 600 000 000"
                  hint="Los invitados confirman directamente por WhatsApp" />
              </>
            )}

            {/* HISTORIA */}
            {activeTab === "historia" && (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Vuestra historia</p>
                  <button onClick={addStory} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">
                    <Plus className="w-3 h-3" /> Hito
                  </button>
                </div>
                {stories.map((s, i) => (
                  <div key={i} className="bg-secondary/50 rounded-xl p-3 space-y-2.5 border border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Hito {i + 1}</span>
                      <button onClick={() => removeStory(i)} className="text-muted-foreground hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <input value={s.title} onChange={(e) => updateStory(i, "title", e.target.value)} className={inputClass} placeholder="Nos conocimos" />
                    <input value={s.story_date} onChange={(e) => updateStory(i, "story_date", e.target.value)} className={inputClass} placeholder="Junio 2020" />
                    <textarea value={s.description} onChange={(e) => updateStory(i, "description", e.target.value)} className={`${inputClass} resize-none`} rows={2} placeholder="Descripción..." />
                  </div>
                ))}
              </>
            )}

            {/* FAQ */}
            {activeTab === "faq" && (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Preguntas frecuentes</p>
                  <button onClick={addFaqItem} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">
                    <Plus className="w-3 h-3" /> Añadir
                  </button>
                </div>
                {faqItems.length === 0 && (
                  <button onClick={() => setFaqItems([
                    { question: "¿Hay parking?", answer: "Sí, hay parking gratuito.", sort_order: 0 },
                    { question: "¿Se admiten niños?", answer: "¡Por supuesto! Los niños son bienvenidos.", sort_order: 1 },
                    { question: "¿Cuál es el dress code?", answer: form.dress_code || "Elegante.", sort_order: 2 },
                    { question: "¿Cómo llego?", answer: "Usa el mapa en la sección de Lugar.", sort_order: 3 },
                  ])} className="w-full py-3 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-primary hover:text-foreground transition-all">
                    Cargar preguntas predefinidas
                  </button>
                )}
                {faqItems.map((f, i) => (
                  <div key={i} className="bg-secondary/50 rounded-xl p-3 space-y-2.5 border border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Pregunta {i + 1}</span>
                      <button onClick={() => removeFaqItem(i)} className="text-muted-foreground hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <input value={f.question} onChange={(e) => updateFaqItem(i, "question", e.target.value)} className={inputClass} placeholder="¿Hay parking?" />
                    <textarea value={f.answer} onChange={(e) => updateFaqItem(i, "answer", e.target.value)} className={`${inputClass} resize-none`} rows={2} placeholder="Sí, hay parking gratuito..." />
                  </div>
                ))}
              </>
            )}

            {/* Navegación siguiente */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">
                <Save className="w-3.5 h-3.5" /> {saving ? "Guardando..." : "Guardar"}
              </button>
              {nextTab && (
                <button onClick={() => { handleSave(); setActiveTab(nextTab.id); }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-all">
                  {nextTab.label} <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Panel derecho — Preview en vivo */}
        {showPreview && (
          <div className="hidden md:flex flex-1 min-w-0 bg-secondary/20 flex-col">
            {/* Barra de preview */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-background/50 shrink-0">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-2 bg-secondary rounded-md px-3 py-1 text-xs text-muted-foreground font-mono">
                bodasfacil.com/w/{form.slug || "tu-boda"}
              </div>
              <Link to={`/w/${form.slug}`} target="_blank"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <ExternalLink className="w-3 h-3" /> Abrir
              </Link>
            </div>

            {/* Preview del hero */}
            <div className="flex-1 overflow-auto p-4">
              <div className="max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl border border-border">
                {/* Hero simulado */}
                <div className="relative h-64 flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: currentTheme.bg }}>
                  {form.hero_image_url && (
                    <img src={form.hero_image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  )}
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${currentTheme.bg}44, ${currentTheme.bg}cc)` }} />
                  <div className="relative text-center px-6">
                    <p className="text-white/60 text-[10px] tracking-[0.3em] uppercase mb-3">¡Nos casamos!</p>
                    <h2 className="text-white text-3xl font-serif leading-tight">
                      {form.partner1_name || "Nombre"}
                    </h2>
                    <p className="text-white/50 text-lg my-1">&</p>
                    <h2 className="text-white text-3xl font-serif leading-tight">
                      {form.partner2_name || "Nombre"}
                    </h2>
                    {form.wedding_date && (
                      <p className="text-white/70 text-sm mt-3 font-light">
                        {new Date(form.wedding_date + "T12:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contenido del preview */}
                <div style={{ backgroundColor: currentTheme.accent }} className="p-4 space-y-3">
                  {/* Nav simulada */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {["Inicio", "Lugar", "RSVP", "Menú", "Playlist"].map((s) => (
                      <span key={s} className="px-2 py-1 rounded-full text-[10px] whitespace-nowrap font-medium"
                        style={{ backgroundColor: currentTheme.bg, color: currentTheme.accent }}>
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Info boda */}
                  {(form.ceremony_venue || form.wedding_date) && (
                    <div className="rounded-xl p-3 border" style={{ borderColor: `${currentTheme.bg}33`, backgroundColor: `${currentTheme.bg}11` }}>
                      {form.ceremony_venue && (
                        <p className="text-xs font-medium mb-1" style={{ color: currentTheme.bg }}>{form.ceremony_venue}</p>
                      )}
                      {form.ceremony_address && (
                        <p className="text-[11px] opacity-60" style={{ color: currentTheme.bg }}>{form.ceremony_address}</p>
                      )}
                      {form.ceremony_time && (
                        <p className="text-[11px] opacity-60 mt-0.5" style={{ color: currentTheme.bg }}>🕐 {form.ceremony_time}</p>
                      )}
                    </div>
                  )}

                  {/* Dress code */}
                  {form.dress_code && (
                    <div className="text-center">
                      <p className="text-[10px] opacity-50 uppercase tracking-wider mb-0.5" style={{ color: currentTheme.bg }}>Código de vestimenta</p>
                      <p className="text-xs font-medium" style={{ color: currentTheme.bg }}>{form.dress_code}</p>
                    </div>
                  )}

                  {/* Menú preview */}
                  {form.menu_starters && (
                    <div className="rounded-xl p-3 border" style={{ borderColor: `${currentTheme.bg}33`, backgroundColor: `${currentTheme.bg}11` }}>
                      <p className="text-[10px] uppercase tracking-wider opacity-50 mb-1.5" style={{ color: currentTheme.bg }}>Entrantes</p>
                      {form.menu_starters.split("·").slice(0, 2).map((item, i) => (
                        <p key={i} className="text-[11px] opacity-70 leading-relaxed" style={{ color: currentTheme.bg }}>· {item.trim()}</p>
                      ))}
                    </div>
                  )}

                  {/* Tema seleccionado */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] opacity-40" style={{ color: currentTheme.bg }}>Tema: {currentTheme.label}</span>
                    <div className="flex gap-1">
                      {THEMES.slice(0, 5).map(t => (
                        <div key={t.id} className={`w-4 h-4 rounded-full cursor-pointer transition-transform ${form.theme_preset === t.id ? "scale-125 ring-2 ring-offset-1" : ""}`}
                          style={{ backgroundColor: t.bg }}
                          onClick={() => update("theme_preset", t.id)} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-center text-xs text-muted-foreground mt-4">
                Vista previa · Los cambios se guardan al pulsar "Guardar"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditWedding;
