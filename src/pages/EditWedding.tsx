import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePurchase } from "@/hooks/usePurchase";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import { track, trackBeginCheckout } from "@/lib/analytics";
import SeatingMapEditor from "@/components/wedding/SeatingMapEditor";
import {
  ArrowLeft, Save, ExternalLink, Plus, Trash2, Upload, Sparkles,
  Heart, MapPin, UtensilsCrossed, Hotel, Clock, Users, HelpCircle,
  Gift, Palette, ChevronRight, Eye, EyeOff, Check, LayoutDashboard,
  Camera, Music, QrCode, Globe, BarChart3, Bell, Undo2
} from "lucide-react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  bg: "#f4efe7", card: "#fffdf9", cream: "#faf6f0", creamAlt: "#f1eadc",
  ink: "#1b1714", ink2: "#2a241f", inkSoft: "#6b5f53", inkMute: "#9b8f80",
  sand: "#e8dfd2", line: "#e2d9ca", lineSoft: "#ece4d6",
  gold: "#8a6d3b", goldLite: "#c9a86a",
  green: "#5b7a52", greenLite: "#e4ecdf",
  rose: "#b06a5e", roseLite: "#f3e3df",
};

// ─── Themes ───────────────────────────────────────────────────────────────────
const THEMES: Record<string, { accent: string; paper: string; ink: string; label: string; mood: string; dark?: boolean }> = {
  elegant:  { accent: "#8a6d3b", paper: "#faf6f0", ink: "#221c16", label: "Elegant",   mood: "Sobrio · oro viejo" },
  botanic:  { accent: "#5b7a52", paper: "#f4f6ef", ink: "#1f2a1c", label: "Botanic",   mood: "Verde · natural" },
  blush:    { accent: "#c08497", paper: "#fbf2f3", ink: "#2c1f24", label: "Blush",     mood: "Rosa empolvado" },
  midnight: { accent: "#c9a86a", paper: "#1c1d26", ink: "#f3eee4", label: "Midnight",  mood: "Noche · dorado", dark: true },
  coastal:  { accent: "#3f6f86", paper: "#eef4f6", ink: "#16252c", label: "Coastal",   mood: "Azul costa" },
  terra:    { accent: "#b06a4a", paper: "#f8efe7", ink: "#2a1c14", label: "Terra",     mood: "Tierra cálida" },
  lavender: { accent: "#7d6aa0", paper: "#f3f0f8", ink: "#241f2c", label: "Lavender",  mood: "Lavanda suave" },
  ivory:    { accent: "#9a8c6d", paper: "#fbf9f3", ink: "#26221a", label: "Ivory",     mood: "Marfil minimal" },
  burgundy: { accent: "#7c3b46", paper: "#f6eeee", ink: "#2a151a", label: "Burgundy",  mood: "Borgoña intenso" },
  sage:     { accent: "#8a9a7b", paper: "#f2f4ee", ink: "#222820", label: "Sage",      mood: "Salvia tenue" },
  noir:     { accent: "#d8c4a0", paper: "#161412", ink: "#f1e9da", label: "Noir",      mood: "Negro editorial", dark: true },
  peach:    { accent: "#d98a5e", paper: "#fcf2ea", ink: "#2c1d13", label: "Peach",     mood: "Melocotón cálido" },
};

const SECTIONS = [
  { id: "dashboard", label: "Resumen",      icon: LayoutDashboard },
  { id: "portada",   label: "Portada",      icon: Heart },
  { id: "rsvp",      label: "RSVP",         icon: Users,     badge: "7" },
  { id: "agenda",    label: "Agenda",       icon: Clock },
  { id: "mesas",     label: "Plan de mesas",icon: Users },
  { id: "fotos",     label: "Fotos",        icon: Camera,    dot: true },
  { id: "playlist",  label: "Playlist",     icon: Music },
  { id: "mapa",      label: "Mapa",         icon: MapPin },
  { id: "regalos",   label: "Regalos",      icon: Gift },
  { id: "tema",      label: "Tema visual",  icon: Palette },
  { id: "qr",        label: "QR y compartir",icon: QrCode },
];

const SECTION_TO_SCREEN: Record<string, string> = {
  dashboard: "home", portada: "home", tema: "home",
  rsvp: "rsvp", agenda: "agenda", mesas: "mesas",
  fotos: "fotos", playlist: "playlist", mapa: "mapa",
  regalos: "regalos", qr: "qr",
};

interface StoryItem { id?: string; title: string; description: string; story_date: string; sort_order: number; }
interface AccommodationItem { id?: string; name: string; address: string; phone: string; website: string; notes: string; sort_order: number; }
interface AgendaItem { id?: string; title: string; start_time: string; end_time: string; location: string; description: string; icon: string; sort_order: number; }
interface SeatingTableItem { id?: string; table_name: string; capacity: number; sort_order: number; guests: string[]; }
interface FaqItem { id?: string; question: string; answer: string; sort_order: number; }

const inputCls = "w-full px-3 py-2.5 rounded-[10px] border text-sm font-sans outline-none transition-all focus:ring-2"
  + " bg-[#fffdf9] border-[#e2d9ca] text-[#1b1714] placeholder:text-[#9b8f80] focus:ring-[#8a6d3b]/20 focus:border-[#c9a86a]";

const Field = ({ label, value, onChange, type = "text", placeholder = "", multiline = false, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; multiline?: boolean; hint?: string;
}) => (
  <div className="space-y-1.5">
    <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, letterSpacing: "1.2px", textTransform: "uppercase", color: T.gold, fontWeight: 500 }}>{label}</label>
    {multiline
      ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} placeholder={placeholder} className={inputCls + " resize-none"} />
      : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
    }
    {hint && <p style={{ fontSize: 11.5, color: T.inkMute }}>{hint}</p>}
  </div>
);

const Panel = ({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
  <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, padding: 24, ...style }} className={className}>
    {children}
  </div>
);

const Kicker = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, letterSpacing: "1.4px", textTransform: "uppercase", color: T.gold, fontWeight: 500, marginBottom: 6 }}>{children}</p>
);

const Head = ({ kicker, title, desc }: { kicker: string; title: string; desc?: string }) => (
  <div style={{ marginBottom: 28 }}>
    <Kicker>{kicker}</Kicker>
    <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, letterSpacing: "-0.015em", lineHeight: 1.04, color: T.ink, margin: "0 0 10px" }}>{title}</h2>
    {desc && <p style={{ fontSize: 14.5, color: T.inkSoft, maxWidth: 560, lineHeight: 1.6, margin: 0 }}>{desc}</p>}
  </div>
);

// ─── Phone Preview ─────────────────────────────────────────────────────────────
function PhonePreview({ theme, screen, form }: { theme: typeof THEMES[string]; screen: string; form: any }) {
  const bg = theme.paper;
  const ac = theme.accent;
  const tx = theme.ink;

  return (
    <div style={{ width: 300, height: 620, borderRadius: 44, background: "#0c0a08", padding: 9, boxShadow: "0 40px 80px -30px rgba(27,23,20,.6)", position: "relative", flexShrink: 0 }}>
      {/* Notch */}
      <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", width: 86, height: 24, background: "#0c0a08", borderRadius: 12, zIndex: 10 }} />
      {/* Screen */}
      <div style={{ width: "100%", height: "100%", borderRadius: 36, overflow: "hidden", background: bg, display: "flex", flexDirection: "column" }}>
        {/* Status bar */}
        <div style={{ padding: "14px 20px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: tx }}>9:41</span>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <div style={{ width: 15, height: 10, border: `1.5px solid ${tx}`, borderRadius: 2, opacity: 0.6, position: "relative" }}>
              <div style={{ position: "absolute", right: -4, top: "50%", transform: "translateY(-50%)", width: 2, height: 5, background: tx, borderRadius: 1 }} />
              <div style={{ position: "absolute", inset: 1, background: ac, borderRadius: 1, width: "70%" }} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          {screen === "home" && (
            <div style={{ padding: "20px 20px 0" }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "1.4px", textTransform: "uppercase", color: ac, marginBottom: 8 }}>¡Nos casamos!</p>
              <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, lineHeight: 1.05, color: tx, margin: "0 0 6px" }}>
                {form.partner1_name || "Nombre"}<br />&amp; {form.partner2_name || "Nombre"}
              </h3>
              {form.wedding_date && <p style={{ fontSize: 12, color: tx, opacity: 0.6, marginBottom: 16 }}>
                {new Date(form.wedding_date + "T12:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
              </p>}
              {form.ceremony_venue && <div style={{ background: ac + "18", borderRadius: 10, padding: "10px 12px", marginBottom: 10 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: ac, margin: "0 0 2px" }}>{form.ceremony_venue}</p>
                {form.ceremony_address && <p style={{ fontSize: 10, color: tx, opacity: 0.5, margin: 0 }}>{form.ceremony_address}</p>}
              </div>}
              {form.hero_image_url && <div style={{ height: 120, borderRadius: 12, overflow: "hidden", marginTop: 12 }}>
                <img src={form.hero_image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>}
            </div>
          )}
          {screen === "rsvp" && (
            <div style={{ padding: "20px 20px 0" }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "1.4px", textTransform: "uppercase", color: ac, marginBottom: 8 }}>Confirma tu asistencia</p>
              <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: tx, margin: "0 0 16px" }}>¿Vendrás a nuestra boda?</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["Sí, allí estaré 🎉", "No podré asistir", "Aún no lo sé"].map((opt, i) => (
                  <div key={i} style={{ padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${i === 0 ? ac : T.line}`, background: i === 0 ? ac + "15" : "transparent", display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${i === 0 ? ac : T.line}`, background: i === 0 ? ac : "transparent", flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: tx, fontWeight: i === 0 ? 600 : 400 }}>{opt}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 10, background: ac, textAlign: "center" }}>
                <span style={{ fontSize: 12, color: theme.dark ? T.ink : "#fff", fontWeight: 600 }}>Confirmar asistencia</span>
              </div>
            </div>
          )}
          {screen === "agenda" && (
            <div style={{ padding: "20px 20px 0" }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "1.4px", textTransform: "uppercase", color: ac, marginBottom: 8 }}>Agenda del día</p>
              <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: tx, margin: "0 0 16px" }}>El gran día</h3>
              {[["17:00", "Ceremonia", "Iglesia"], ["19:00", "Cóctel", "Jardines"], ["21:00", "Banquete", "Salón"]].map(([h, t, l], i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: ac, flexShrink: 0, marginTop: 2 }} />
                    {i < 2 && <div style={{ width: 1, flex: 1, background: ac + "40", minHeight: 28 }} />}
                  </div>
                  <div style={{ paddingBottom: 8 }}>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ac, margin: "0 0 2px", fontWeight: 600 }}>{h}</p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: tx, margin: "0 0 1px" }}>{t}</p>
                    <p style={{ fontSize: 10, color: tx, opacity: 0.5, margin: 0 }}>{l}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {(screen === "mesas" || screen === "fotos" || screen === "playlist" || screen === "mapa" || screen === "regalos" || screen === "qr") && (
            <div style={{ padding: "20px 20px 0", textAlign: "center" }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "1.4px", textTransform: "uppercase", color: ac, marginBottom: 16 }}>
                {screen === "mesas" ? "Plan de mesas" : screen === "fotos" ? "Fotos" : screen === "playlist" ? "Playlist" : screen === "mapa" ? "Cómo llegar" : screen === "regalos" ? "Lista de regalos" : "Compartir"}
              </p>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: ac + "20", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: ac }} />
              </div>
              <p style={{ fontSize: 12, color: tx, opacity: 0.5 }}>Vista disponible en la web publicada</p>
            </div>
          )}
        </div>

        {/* Bottom nav */}
        <div style={{ display: "flex", justifyContent: "space-around", padding: "8px 0 12px", borderTop: `1px solid ${tx}15`, backdropFilter: "blur(10px)" }}>
          {["Inicio", "RSVP", "Agenda", "Lugar", "Fotos"].map((label, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: i === 0 ? ac : "transparent", border: `1.5px solid ${i === 0 ? ac : tx + "30"}` }} />
              <span style={{ fontSize: 8, color: i === 0 ? ac : tx, opacity: i === 0 ? 1 : 0.4, fontWeight: i === 0 ? 600 : 400 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function EditWedding() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { hasPurchase } = usePurchase();
  const { openCheckout, loading: checkoutLoading } = usePaddleCheckout();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(true);
  const [section, setSection] = useState("portada");
  const [previewScreen, setPreviewScreen] = useState("home");
  const [userToggledPreview, setUserToggledPreview] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const theme = THEMES[form.theme_preset] || THEMES.elegant;

  const completionPct = Math.round(
    [form.partner1_name, form.partner2_name, form.wedding_date, form.ceremony_venue,
     form.ceremony_address, form.reception_venue, form.hero_image_url].filter(Boolean).length / 7 * 100
  );

  // Auto-hide preview for heavy sections
  useEffect(() => {
    if (userToggledPreview) return;
    setShowPreview(!["mesas", "agenda"].includes(section));
  }, [section, userToggledPreview]);

  // Sync preview screen to section
  useEffect(() => {
    setPreviewScreen(SECTION_TO_SCREEN[section] || "home");
  }, [section]);

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
      setSeatingTables(tables.map(t => ({
        id: t.id, table_name: t.table_name, capacity: t.capacity, sort_order: t.sort_order,
        guests: assigns.filter((a: any) => a.table_id === t.id).map((a: any) => a.guest_name),
      })));
      setLoading(false);
      const tabFromUrl = searchParams.get("tab");
      if (tabFromUrl && SECTIONS.some(s => s.id === tabFromUrl)) setSection(tabFromUrl);
      else if (wedding && !wedding.partner1_name) setSection("pareja");
    };
    fetchData();
  }, [user, id]);

  const triggerSave = useCallback(() => {
    setSaved(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaved(true), 1200);
  }, []);

  const update = (key: string, value: string) => {
    setForm(f => ({ ...f, [key]: value }));
    triggerSave();
  };

  const handleSave = async () => {
    setSaving(true);
    track("guardar_boda");
    await supabase.from("weddings").update({
      slug: form.slug, partner1_name: form.partner1_name, partner2_name: form.partner2_name,
      wedding_date: form.wedding_date ? new Date(form.wedding_date + "T12:00:00").toISOString() : null,
      ceremony_venue: form.ceremony_venue, ceremony_address: form.ceremony_address,
      ceremony_time: form.ceremony_time, reception_venue: form.reception_venue,
      reception_address: form.reception_address, reception_time: form.reception_time,
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

    toast.success("¡Cambios guardados! ✓");
    setSaving(false);
    setSaved(true);
  };

  const handleBuy = (priceId: string) => {
    const planKey = priceId.includes("basico") ? "basico" : "completo" as "basico" | "completo";
    trackBeginCheckout(planKey);
    openCheckout({ priceId, customerEmail: user?.email || undefined, customData: { userId: user?.id || "" }, successUrl: `${window.location.origin}/dashboard?checkout=success` });
  };

  const [uploadingHero, setUploadingHero] = useState(false);
  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;
    setUploadingHero(true);
    const ext = file.name.split(".").pop();
    const path = `${id}/hero.${ext}`;
    const { error } = await supabase.storage.from("wedding-photos").upload(path, file, { upsert: true });
    if (error) { toast.error("Error al subir"); setUploadingHero(false); return; }
    const { data } = supabase.storage.from("wedding-photos").getPublicUrl(path);
    update("hero_image_url", data.publicUrl);
    setUploadingHero(false);
    toast.success("Imagen subida ✓");
  };

  const addSeatingTable = () => setSeatingTables(p => [...p, { table_name: "", capacity: 8, sort_order: p.length, guests: [] }]);
  const removeSeatingTable = (i: number) => setSeatingTables(p => p.filter((_, idx) => idx !== i));
  const updateSeatingTable = (i: number, k: string, v: any) => setSeatingTables(p => p.map((t, idx) => idx === i ? { ...t, [k]: v } : t));
  const addGuestToTable = (i: number, name: string) => setSeatingTables(p => p.map((t, idx) => idx === i ? { ...t, guests: [...t.guests, name] } : t));
  const removeGuestFromTable = (i: number, gi: number) => setSeatingTables(p => p.map((t, idx) => idx === i ? { ...t, guests: t.guests.filter((_, gidx) => gidx !== gi) } : t));
  const addAgendaItem = () => setAgendaItems(p => [...p, { title: "", start_time: "", end_time: "", location: "", description: "", icon: "clock", sort_order: p.length }]);
  const removeAgendaItem = (i: number) => setAgendaItems(p => p.filter((_, idx) => idx !== i));
  const updateAgendaItem = (i: number, k: keyof AgendaItem, v: string) => setAgendaItems(p => p.map((a, idx) => idx === i ? { ...a, [k]: v } : a));
  const addAccommodation = () => setAccommodations(p => [...p, { name: "", address: "", phone: "", website: "", notes: "", sort_order: p.length }]);
  const removeAccommodation = (i: number) => setAccommodations(p => p.filter((_, idx) => idx !== i));
  const updateAccommodation = (i: number, k: keyof AccommodationItem, v: string) => setAccommodations(p => p.map((a, idx) => idx === i ? { ...a, [k]: v } : a));
  const addStory = () => setStories(p => [...p, { title: "", description: "", story_date: "", sort_order: p.length }]);
  const removeStory = (i: number) => setStories(p => p.filter((_, idx) => idx !== i));
  const updateStory = (i: number, k: keyof StoryItem, v: string) => setStories(p => p.map((s, idx) => idx === i ? { ...s, [k]: v } : s));
  const addFaqItem = () => setFaqItems(p => [...p, { question: "", answer: "", sort_order: p.length }]);
  const removeFaqItem = (i: number) => setFaqItems(p => p.filter((_, idx) => idx !== i));
  const updateFaqItem = (i: number, k: keyof FaqItem, v: string) => setFaqItems(p => p.map((f, idx) => idx === i ? { ...f, [k]: v } : f));

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: T.bg }}>
        <Heart className="w-8 h-8 animate-pulse" style={{ color: T.gold }} />
      </div>
    );
  }

  const currentSection = SECTIONS.find(s => s.id === section);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "248px 1fr", height: "100vh", background: T.bg, overflow: "hidden" }}>

      {/* ── Sidebar ── */}
      <aside style={{ background: T.ink, display: "flex", flexDirection: "column", padding: "26px 18px", overflow: "hidden" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: T.gold, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: "#fff" }}>B</span>
          </div>
          <div>
            <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 21, color: T.cream, margin: 0, lineHeight: 1.1 }}>BodasFácil</p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(250,246,240,.45)", margin: 0 }}>Panel de novios</p>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto" }} className="bf-nav">
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {SECTIONS.map(s => {
              const Icon = s.icon;
              const active = section === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSection(s.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 13,
                    padding: "11px 12px", borderRadius: 11, border: "none",
                    background: active ? "rgba(255,255,255,.08)" : "transparent",
                    cursor: "pointer", width: "100%", textAlign: "left",
                    transition: "background .15s", position: "relative",
                  }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.04)"; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  {active && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 20, borderRadius: 999, background: T.goldLite }} />}
                  <Icon size={19} color={active ? T.goldLite : "rgba(250,246,240,.62)"} strokeWidth={1.6} />
                  <span style={{ fontSize: 13.5, color: active ? T.cream : "rgba(250,246,240,.62)", fontWeight: active ? 600 : 400, flex: 1 }}>{s.label}</span>
                  {s.badge && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, background: T.gold, color: "#fff", padding: "1px 6px", borderRadius: 999, fontWeight: 600 }}>{s.badge}</span>}
                  {s.dot && <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.green, flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User card */}
        <div style={{ marginTop: 16, borderRadius: 14, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", padding: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.gold, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 13, color: "#fff" }}>
              {(form.partner1_name?.[0] || "?") + (form.partner2_name?.[0] || "?")}
            </span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12.5, color: T.cream, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {form.partner1_name && form.partner2_name ? `${form.partner1_name} & ${form.partner2_name}` : "Tu boda"}
            </p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "rgba(250,246,240,.5)", margin: 0, letterSpacing: "0.5px" }}>Plan Premium</p>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ display: "grid", gridTemplateRows: "auto 1fr", overflow: "hidden" }}>

        {/* Topbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px", borderBottom: `1px solid ${T.line}`, background: "rgba(250,246,240,.85)", backdropFilter: "blur(8px)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link to="/dashboard" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 10, border: `1px solid ${T.line}`, color: T.inkSoft, textDecoration: "none" }}>
              <ArrowLeft size={16} />
            </Link>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: T.ink, margin: 0 }}>{currentSection?.label || "Editor"}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: saved ? T.green : T.gold, transition: "background .3s" }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: T.inkMute }}>
                  {saved ? "Todos los cambios guardados" : "Guardando…"}
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {!hasPurchase && (
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => handleBuy("basico_one_time")} disabled={checkoutLoading}
                  style={{ padding: "7px 14px", borderRadius: 999, border: `1px solid ${T.line}`, background: "transparent", fontSize: 12.5, color: T.inkSoft, cursor: "pointer" }}>
                  Básico · 30€
                </button>
                <button onClick={() => handleBuy("completo_one_time")} disabled={checkoutLoading}
                  style={{ padding: "7px 14px", borderRadius: 999, background: T.ink, border: "none", fontSize: 12.5, color: T.cream, cursor: "pointer", fontWeight: 600 }}>
                  Publicar · 60€ ⭐
                </button>
              </div>
            )}
            <button
              onClick={() => { setUserToggledPreview(true); setShowPreview(p => !p); }}
              title={showPreview ? "Ocultar preview" : "Mostrar preview"}
              style={{ width: 36, height: 36, borderRadius: 999, border: `1px solid ${T.line}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.inkSoft }}>
              {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <Link to={`/w/${form.slug}`}
              style={{ padding: "7px 14px", borderRadius: 999, border: `1px solid ${T.line}`, background: "transparent", fontSize: 12.5, color: T.inkSoft, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              <Globe size={13} /> Ver web
            </Link>
            <button onClick={handleSave} disabled={saving}
              style={{ padding: "7px 16px", borderRadius: 999, background: T.ink, border: "none", fontSize: 12.5, color: T.cream, cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 6, opacity: saving ? 0.6 : 1 }}>
              <Save size={13} /> {saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </div>

        {/* Workspace */}
        <div style={{ display: "grid", gridTemplateColumns: showPreview && section !== "dashboard" ? "1fr 392px" : "1fr", overflow: "hidden" }}>

          {/* Editor */}
          <div className="bf-editor" style={{ overflowY: "auto", padding: "30px 34px 60px" }}>
            <div style={{ maxWidth: section === "dashboard" ? 1080 : 720, margin: "0 auto" }}>

              {/* DASHBOARD */}
              {section === "dashboard" && (
                <div style={{ animation: "bfFade .42s cubic-bezier(.2,.7,.2,1)" }}>
                  <Panel style={{ marginBottom: 18, padding: 0, overflow: "hidden" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr" }}>
                      <div style={{ padding: 32 }}>
                        <Kicker>Tu boda · {form.ceremony_venue || "Sin ubicación"}</Kicker>
                        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 42, letterSpacing: "-0.015em", lineHeight: 1.04, color: T.ink, margin: "0 0 8px" }}>
                          {form.partner1_name || "Novio"} &amp; {form.partner2_name || "Novia"}
                        </h2>
                        {form.wedding_date && <p style={{ fontSize: 14, color: T.inkSoft, marginBottom: 20 }}>
                          {new Date(form.wedding_date + "T12:00:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                        </p>}
                        <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
                          {[
                            { label: "Días restantes", value: form.wedding_date ? Math.ceil((new Date(form.wedding_date).getTime() - Date.now()) / 86400000) : "—" },
                            { label: "Completado", value: `${completionPct}%` },
                          ].map((s, i) => (
                            <div key={i}>
                              <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, color: T.ink, margin: 0, lineHeight: 1 }}>{s.value}</p>
                              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.inkMute, letterSpacing: "1px", textTransform: "uppercase", margin: "4px 0 0" }}>{s.label}</p>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                          <button onClick={() => setSection("portada")}
                            style={{ padding: "10px 20px", borderRadius: 10, background: T.ink, border: "none", fontSize: 13, color: T.cream, cursor: "pointer", fontWeight: 600 }}>
                            Seguir editando →
                          </button>
                          <Link to={`/w/${form.slug}`}
                            style={{ padding: "10px 20px", borderRadius: 10, border: `1px solid ${T.line}`, fontSize: 13, color: T.inkSoft, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                            <Globe size={13} /> Ver web publicada
                          </Link>
                        </div>
                      </div>
                      {form.hero_image_url && (
                        <div style={{ position: "relative", overflow: "hidden" }}>
                          <img src={form.hero_image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(255,253,249,.95) 0%, transparent 40%)" }} />
                        </div>
                      )}
                    </div>
                  </Panel>
                  <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 18 }}>
                    <Panel>
                      <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: T.ink, margin: "0 0 16px" }}>Progreso de configuración</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                        <svg width={80} height={80} viewBox="0 0 80 80">
                          <circle cx={40} cy={40} r={30} fill="none" stroke={T.lineSoft} strokeWidth={6} />
                          <circle cx={40} cy={40} r={30} fill="none" stroke={T.gold} strokeWidth={6}
                            strokeDasharray={`${188.5 * completionPct / 100} 188.5`}
                            strokeLinecap="round" transform="rotate(-90 40 40)"
                            style={{ transition: "stroke-dasharray 1s ease" }} />
                          <text x={40} y={44} textAnchor="middle" style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, fill: T.ink, fontWeight: "bold" }}>{completionPct}%</text>
                        </svg>
                        <div>
                          <p style={{ fontSize: 13, color: T.inkSoft, margin: 0 }}>Completa tu perfil para publicar</p>
                        </div>
                      </div>
                      {[
                        { label: "Nombres y fecha", done: !!(form.partner1_name && form.partner2_name && form.wedding_date), section: "portada" },
                        { label: "Foto de portada", done: !!form.hero_image_url, section: "portada" },
                        { label: "Lugar de ceremonia", done: !!form.ceremony_venue, section: "lugar" },
                        { label: "Dirección de ceremonia", done: !!form.ceremony_address, section: "lugar" },
                        { label: "Lugar de celebración", done: !!form.reception_venue, section: "lugar" },
                        { label: "Tema visual", done: form.theme_preset !== "elegant" || true, section: "tema" },
                      ].map((item, i) => (
                        <button key={i} onClick={() => setSection(item.section)}
                          style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "8px 0", border: "none", background: "transparent", cursor: "pointer", textAlign: "left", borderBottom: i < 5 ? `1px solid ${T.lineSoft}` : "none" }}>
                          <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${item.done ? T.green : T.line}`, background: item.done ? T.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {item.done && <Check size={12} color="#fff" strokeWidth={2.5} />}
                          </div>
                          <span style={{ fontSize: 13, color: T.ink, flex: 1 }}>{item.label}</span>
                          {!item.done && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: T.gold, letterSpacing: "0.8px", textTransform: "uppercase" }}>Pendiente</span>}
                          <ChevronRight size={14} color={T.inkMute} />
                        </button>
                      ))}
                    </Panel>
                    <Panel>
                      <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: T.ink, margin: "0 0 16px" }}>Accesos rápidos</p>
                      {[
                        { label: "Editar portada", desc: "Nombres, fecha y foto", section: "portada" },
                        { label: "Gestionar RSVP", desc: "Ver confirmaciones", section: "rsvp" },
                        { label: "Cambiar tema", desc: "12 estilos disponibles", section: "tema" },
                        { label: "Plan de mesas", desc: "Organiza los asientos", section: "mesas" },
                      ].map((item, i) => (
                        <button key={i} onClick={() => setSection(item.section)}
                          style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "12px", borderRadius: 12, border: `1px solid ${T.line}`, background: T.card, cursor: "pointer", textAlign: "left", marginBottom: 8, transition: "all .18s" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.bg; (e.currentTarget as HTMLElement).style.borderColor = T.goldLite; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = T.card; (e.currentTarget as HTMLElement).style.borderColor = T.line; }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: T.gold + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <div style={{ width: 16, height: 16, borderRadius: "50%", background: T.gold }} />
                          </div>
                          <div>
                            <p style={{ fontSize: 13.5, fontWeight: 600, color: T.ink, margin: 0 }}>{item.label}</p>
                            <p style={{ fontSize: 12, color: T.inkSoft, margin: 0 }}>{item.desc}</p>
                          </div>
                          <ChevronRight size={14} color={T.inkMute} style={{ marginLeft: "auto" }} />
                        </button>
                      ))}
                    </Panel>
                  </div>
                </div>
              )}

              {/* PORTADA */}
              {section === "portada" && (
                <div style={{ animation: "bfFade .42s cubic-bezier(.2,.7,.2,1)" }}>
                  <Head kicker="01 · Portada" title="Portada e historia" desc="El primer vistazo que tendrán tus invitados. Cuéntales vuestra historia." />
                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <Panel>
                      <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, color: T.ink, margin: "0 0 16px" }}>Nombres y fecha</p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                        <Field label="Nombre 1" value={form.partner1_name} onChange={v => update("partner1_name", v)} placeholder="María" />
                        <Field label="Nombre 2" value={form.partner2_name} onChange={v => update("partner2_name", v)} placeholder="Carlos" />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <Field label="Fecha del enlace" value={form.wedding_date} onChange={v => update("wedding_date", v)} type="date" />
                        <Field label="URL personalizada" value={form.slug}
                          onChange={v => update("slug", v.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"))}
                          placeholder="maria-y-carlos"
                          hint={`bodasfacil.com/w/${form.slug || "tu-slug"}`} />
                      </div>
                    </Panel>
                    <Panel>
                      <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, color: T.ink, margin: "0 0 16px" }}>Foto de portada</p>
                      {form.hero_image_url && (
                        <div style={{ height: 160, borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
                          <img src={form.hero_image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      )}
                      <label style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        padding: "12px 20px", borderRadius: 10, border: `2px dashed ${T.line}`,
                        cursor: "pointer", fontSize: 13.5, color: T.inkSoft,
                        transition: "all .18s",
                      }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = T.goldLite; (e.currentTarget as HTMLElement).style.color = T.gold; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = T.line; (e.currentTarget as HTMLElement).style.color = T.inkSoft; }}>
                        <Upload size={16} />
                        {uploadingHero ? "Subiendo…" : form.hero_image_url ? "Cambiar imagen" : "Subir foto de portada"}
                        <input type="file" accept="image/*" onChange={handleHeroUpload} style={{ display: "none" }} />
                      </label>
                    </Panel>
                    <Panel>
                      <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, color: T.ink, margin: "0 0 16px" }}>Cómo nos conocimos</p>
                      <div style={{ marginBottom: 14 }}>
                        <Field label="Vuestra historia" value={form.gift_message} onChange={v => update("gift_message", v)} multiline placeholder="Nos conocimos en..." />
                      </div>
                    </Panel>
                  </div>
                </div>
              )}

              {/* LUGAR */}
              {section === "lugar" && (
                <div style={{ animation: "bfFade .42s cubic-bezier(.2,.7,.2,1)" }}>
                  <Head kicker="02 · Lugar" title="Ceremonia y celebración" desc="Los detalles del lugar para que tus invitados lleguen sin problemas." />
                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <Panel>
                      <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, color: T.ink, margin: "0 0 16px" }}>Ceremonia</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <Field label="Lugar" value={form.ceremony_venue} onChange={v => update("ceremony_venue", v)} placeholder="Iglesia de Santa María" />
                        <Field label="Dirección" value={form.ceremony_address} onChange={v => update("ceremony_address", v)} placeholder="Calle Mayor, 12, Valencia" />
                        <Field label="Hora" value={form.ceremony_time} onChange={v => update("ceremony_time", v)} placeholder="17:00" />
                      </div>
                    </Panel>
                    <Panel>
                      <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, color: T.ink, margin: "0 0 16px" }}>Celebración</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <Field label="Lugar" value={form.reception_venue} onChange={v => update("reception_venue", v)} placeholder="Finca Los Olivos" />
                        <Field label="Dirección" value={form.reception_address} onChange={v => update("reception_address", v)} placeholder="Camino Rural s/n" />
                        <Field label="Hora" value={form.reception_time} onChange={v => update("reception_time", v)} placeholder="19:30" />
                      </div>
                    </Panel>
                  </div>
                </div>
              )}

              {/* MENÚ */}
              {section === "rsvp" && (
                <div style={{ animation: "bfFade .42s cubic-bezier(.2,.7,.2,1)" }}>
                  <Head kicker="03 · RSVP" title="Confirmaciones" desc="Gestiona quién asiste a tu boda. Los invitados confirman directamente desde la web." />
                  <Panel>
                    <p style={{ fontSize: 13.5, color: T.inkSoft }}>Las confirmaciones aparecerán aquí cuando tus invitados respondan a través de la web de la boda. Comparte el enlace para empezar a recibir respuestas.</p>
                    <div style={{ marginTop: 16, padding: "14px 18px", borderRadius: 12, background: T.bg, border: `1px solid ${T.line}` }}>
                      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: T.inkSoft, margin: 0 }}>bodasfacil.com/w/{form.slug || "tu-slug"}</p>
                    </div>
                  </Panel>
                </div>
              )}

              {/* AGENDA */}
              {section === "agenda" && (
                <div style={{ animation: "bfFade .42s cubic-bezier(.2,.7,.2,1)" }}>
                  <Head kicker="04 · Agenda" title="Agenda del día" desc="El programa que verán tus invitados. Puedes editarlo hasta el último momento." />
                  <Panel>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                      <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, color: T.ink, margin: 0 }}>Momentos del día</p>
                      <button onClick={addAgendaItem}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 999, background: T.gold, border: "none", fontSize: 12.5, color: "#fff", cursor: "pointer", fontWeight: 600 }}>
                        <Plus size={13} /> Añadir momento
                      </button>
                    </div>
                    {agendaItems.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "32px 0" }}>
                        <Clock size={32} color={T.sand} style={{ margin: "0 auto 12px" }} />
                        <p style={{ fontSize: 13.5, color: T.inkMute }}>Añade la ceremonia, el cóctel, el banquete...</p>
                      </div>
                    ) : (
                      <div style={{ position: "relative" }}>
                        <div style={{ position: "absolute", left: 42, top: 0, bottom: 0, width: 1, background: T.gold + "30" }} />
                        {agendaItems.map((a, i) => (
                          <div key={i} style={{ display: "flex", gap: 16, marginBottom: 16, position: "relative", alignItems: "flex-start" }}>
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: T.gold, flexShrink: 0, marginTop: 14, zIndex: 1, marginLeft: 38 }} />
                            <div style={{ flex: 1, display: "flex", gap: 10 }}>
                              <input value={a.start_time} onChange={e => updateAgendaItem(i, "start_time", e.target.value)}
                                placeholder="17:00"
                                style={{ width: 60, padding: "8px 10px", borderRadius: 8, border: `1px solid ${T.line}`, background: T.card, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: T.gold, outline: "none", flexShrink: 0 }} />
                              <input value={a.title} onChange={e => updateAgendaItem(i, "title", e.target.value)}
                                placeholder="Ceremonia"
                                style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.line}`, background: T.card, fontSize: 13.5, color: T.ink, fontWeight: 600, outline: "none" }} />
                              <input value={a.location} onChange={e => updateAgendaItem(i, "location", e.target.value)}
                                placeholder="Lugar"
                                style={{ width: 140, padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.line}`, background: T.card, fontSize: 12.5, color: T.inkSoft, outline: "none", flexShrink: 0 }} />
                              <button onClick={() => removeAgendaItem(i)}
                                style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${T.line}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.rose, flexShrink: 0 }}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Panel>
                </div>
              )}

              {/* MESAS */}
              {section === "mesas" && (
                <div style={{ animation: "bfFade .42s cubic-bezier(.2,.7,.2,1)" }}>
                  <Head kicker="05 · Plan de mesas" title="Plan de mesas" desc="Organiza dónde se sienta cada invitado. Lo verán 24h antes de la boda." />
                  <SeatingMapEditor
                    tables={seatingTables}
                    onAdd={addSeatingTable}
                    onRemove={removeSeatingTable}
                    onUpdateName={(i, name) => updateSeatingTable(i, "table_name", name)}
                    onUpdateCapacity={(i, cap) => updateSeatingTable(i, "capacity", cap)}
                    onAddGuest={addGuestToTable}
                    onRemoveGuest={removeGuestFromTable}
                  />
                </div>
              )}

              {/* FOTOS */}
              {section === "fotos" && (
                <div style={{ animation: "bfFade .42s cubic-bezier(.2,.7,.2,1)" }}>
                  <Head kicker="06 · Fotos" title="Muro de fotos" desc="Tus invitados pueden subir sus fotos el día de la boda en tiempo real." />
                  <Panel>
                    <p style={{ fontSize: 13.5, color: T.inkSoft }}>El muro de fotos se activa automáticamente cuando publicas tu boda. Tus invitados podrán subir fotos directamente desde su móvil sin necesidad de app.</p>
                    <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                      {[1,2,3,4,5,6].map(i => (
                        <div key={i} style={{ aspectRatio: "1", borderRadius: 12, background: T.bg, border: `2px dashed ${T.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Camera size={20} color={T.sand} />
                        </div>
                      ))}
                    </div>
                  </Panel>
                </div>
              )}

              {/* PLAYLIST */}
              {section === "playlist" && (
                <div style={{ animation: "bfFade .42s cubic-bezier(.2,.7,.2,1)" }}>
                  <Head kicker="07 · Playlist" title="Playlist colaborativa" desc="Tus invitados sugieren y votan las canciones de la fiesta." />
                  <Panel>
                    <p style={{ fontSize: 13.5, color: T.inkSoft }}>La playlist colaborativa se activa cuando publicas la boda. Tus invitados podrán sugerir canciones y votar sus favoritas antes del gran día.</p>
                    <div style={{ marginTop: 16 }}>
                      {[
                        { rank: 1, title: "Perfect", artist: "Ed Sheeran", votes: 24 },
                        { rank: 2, title: "La Vie en Rose", artist: "Édith Piaf", votes: 18 },
                        { rank: 3, title: "All of Me", artist: "John Legend", votes: 15 },
                      ].map((s, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < 2 ? `1px solid ${T.lineSoft}` : "none" }}>
                          <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, color: i === 0 ? T.gold : T.inkMute, width: 28, textAlign: "center", flexShrink: 0 }}>{s.rank}</span>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 13.5, fontWeight: 600, color: T.ink, margin: 0 }}>{s.title}</p>
                            <p style={{ fontSize: 12, color: T.inkSoft, margin: 0 }}>{s.artist}</p>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 999, background: T.greenLite }}>
                            <Heart size={11} color={T.green} />
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: T.green, fontWeight: 600 }}>{s.votes}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Panel>
                </div>
              )}

              {/* MAPA */}
              {section === "mapa" && (
                <div style={{ animation: "bfFade .42s cubic-bezier(.2,.7,.2,1)" }}>
                  <Head kicker="08 · Mapa" title="Mapa y lugares" desc="El mapa se genera automáticamente con las direcciones que has introducido." />
                  <Panel>
                    <div style={{ height: 200, borderRadius: 12, background: T.bg, border: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                      <div style={{ textAlign: "center" }}>
                        <MapPin size={32} color={T.gold} style={{ margin: "0 auto 8px" }} />
                        <p style={{ fontSize: 13, color: T.inkSoft }}>
                          {form.ceremony_address || "Introduce una dirección en la sección Lugar"}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {[
                        { icon: "⛪", label: "Ceremonia", desc: form.ceremony_venue || "—" },
                        { icon: "🏰", label: "Celebración", desc: form.reception_venue || "—" },
                      ].map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, border: `1px solid ${T.line}`, background: T.card }}>
                          <span style={{ fontSize: 20 }}>{item.icon}</span>
                          <div>
                            <p style={{ fontSize: 12.5, fontWeight: 600, color: T.ink, margin: 0 }}>{item.label}</p>
                            <p style={{ fontSize: 12, color: T.inkSoft, margin: 0 }}>{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Panel>
                </div>
              )}

              {/* REGALOS */}
              {section === "regalos" && (
                <div style={{ animation: "bfFade .42s cubic-bezier(.2,.7,.2,1)" }}>
                  <Head kicker="09 · Regalos" title="Lista de regalos" desc="Comparte tu número de cuenta o una lista de deseos con tus invitados." />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                    <Panel>
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <Field label="IBAN / Número de cuenta" value={form.bank_account} onChange={v => update("bank_account", v)} placeholder="ES12 3456 7890..." />
                        <Field label="Mensaje para los invitados" value={form.gift_message} onChange={v => update("gift_message", v)} multiline placeholder="El mejor regalo es vuestra presencia..." />
                      </div>
                    </Panel>
                    <div style={{ borderRadius: 16, background: T.ink, padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <Kicker>Vista previa</Kicker>
                        <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, color: T.goldLite, margin: "8px 0 12px" }}>Lista de regalos</p>
                        <p style={{ fontSize: 12.5, color: "rgba(250,246,240,.6)", lineHeight: 1.6 }}>{form.gift_message || "El mejor regalo es vuestra presencia."}</p>
                      </div>
                      {form.bank_account && (
                        <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(255,255,255,.08)", marginTop: 16 }}>
                          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: T.goldLite, margin: 0 }}>{form.bank_account}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* EXTRAS */}
              {section === "extras" && (
                <div style={{ animation: "bfFade .42s cubic-bezier(.2,.7,.2,1)" }}>
                  <Head kicker="· Extras" title="Configuración adicional" desc="Dress code, WhatsApp y más detalles para tus invitados." />
                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <Panel>
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <Field label="Código de vestimenta" value={form.dress_code} onChange={v => update("dress_code", v)} placeholder="Elegante / Cóctel" />
                        <Field label="WhatsApp RSVP" value={form.whatsapp_number} onChange={v => update("whatsapp_number", v)} placeholder="+34 600 000 000" hint="Los invitados confirman directamente por WhatsApp" />
                      </div>
                    </Panel>
                    <Panel>
                      <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, color: T.ink, margin: "0 0 16px" }}>Menú del banquete</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <Field label="Entrantes" value={form.menu_starters} onChange={v => update("menu_starters", v)} multiline placeholder="Un plato por línea..." />
                        <Field label="Platos principales" value={form.menu_mains} onChange={v => update("menu_mains", v)} multiline placeholder="Un plato por línea..." />
                        <Field label="Postres" value={form.menu_desserts} onChange={v => update("menu_desserts", v)} multiline placeholder="Un plato por línea..." />
                      </div>
                    </Panel>
                  </div>
                </div>
              )}

              {/* ALOJAMIENTO */}
              {section === "alojamiento" && (
                <div style={{ animation: "bfFade .42s cubic-bezier(.2,.7,.2,1)" }}>
                  <Head kicker="· Alojamiento" title="Hoteles recomendados" desc="Sugiere hoteles cercanos a tus invitados que vienen de fuera." />
                  <Panel>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                      <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, color: T.ink, margin: 0 }}>Hoteles recomendados</p>
                      <button onClick={addAccommodation}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 999, background: T.gold, border: "none", fontSize: 12.5, color: "#fff", cursor: "pointer", fontWeight: 600 }}>
                        <Plus size={13} /> Añadir hotel
                      </button>
                    </div>
                    {accommodations.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "32px 0" }}>
                        <Hotel size={32} color={T.sand} style={{ margin: "0 auto 12px" }} />
                        <p style={{ fontSize: 13.5, color: T.inkMute }}>Añade hoteles cercanos para tus invitados</p>
                      </div>
                    ) : accommodations.map((a, i) => (
                      <div key={i} style={{ border: `1px solid ${T.line}`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                          <span style={{ fontSize: 12, color: T.inkMute }}>Hotel {i + 1}</span>
                          <button onClick={() => removeAccommodation(i)} style={{ border: "none", background: "transparent", cursor: "pointer", color: T.rose }}><Trash2 size={14} /></button>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <Field label="Nombre" value={a.name} onChange={v => updateAccommodation(i, "name", v)} placeholder="Hotel Nombre" />
                          <Field label="Teléfono" value={a.phone} onChange={v => updateAccommodation(i, "phone", v)} placeholder="+34 900 000 000" />
                          <Field label="Dirección" value={a.address} onChange={v => updateAccommodation(i, "address", v)} placeholder="Calle..." />
                          <Field label="Web" value={a.website} onChange={v => updateAccommodation(i, "website", v)} placeholder="hotel.com" />
                        </div>
                        <div style={{ marginTop: 10 }}>
                          <Field label="Notas" value={a.notes} onChange={v => updateAccommodation(i, "notes", v)} multiline placeholder="Precio orientativo, distancia..." />
                        </div>
                      </div>
                    ))}
                  </Panel>
                </div>
              )}

              {/* HISTORIA */}
              {section === "historia" && (
                <div style={{ animation: "bfFade .42s cubic-bezier(.2,.7,.2,1)" }}>
                  <Head kicker="· Historia" title="Vuestra historia" desc="Los hitos de vuestra relación que compartirás con los invitados." />
                  <Panel>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                      <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, color: T.ink, margin: 0 }}>Hitos de vuestra historia</p>
                      <button onClick={addStory}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 999, background: T.gold, border: "none", fontSize: 12.5, color: "#fff", cursor: "pointer", fontWeight: 600 }}>
                        <Plus size={13} /> Añadir hito
                      </button>
                    </div>
                    {stories.map((s, i) => (
                      <div key={i} style={{ border: `1px solid ${T.line}`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                          <span style={{ fontSize: 12, color: T.inkMute }}>Hito {i + 1}</span>
                          <button onClick={() => removeStory(i)} style={{ border: "none", background: "transparent", cursor: "pointer", color: T.rose }}><Trash2 size={14} /></button>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                          <Field label="Título" value={s.title} onChange={v => updateStory(i, "title", v)} placeholder="Nos conocimos" />
                          <Field label="Fecha" value={s.story_date} onChange={v => updateStory(i, "story_date", v)} placeholder="Junio 2020" />
                        </div>
                        <Field label="Descripción" value={s.description} onChange={v => updateStory(i, "description", v)} multiline placeholder="Fue en..." />
                      </div>
                    ))}
                  </Panel>
                </div>
              )}

              {/* FAQ */}
              {section === "faq" && (
                <div style={{ animation: "bfFade .42s cubic-bezier(.2,.7,.2,1)" }}>
                  <Head kicker="· FAQ" title="Preguntas frecuentes" desc="Resuelve las dudas más comunes de tus invitados." />
                  <Panel>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                      <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, color: T.ink, margin: 0 }}>Preguntas y respuestas</p>
                      <button onClick={addFaqItem}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 999, background: T.gold, border: "none", fontSize: 12.5, color: "#fff", cursor: "pointer", fontWeight: 600 }}>
                        <Plus size={13} /> Añadir pregunta
                      </button>
                    </div>
                    {faqItems.length === 0 && (
                      <button onClick={() => setFaqItems([
                        { question: "¿Hay parking?", answer: "Sí, hay parking gratuito.", sort_order: 0 },
                        { question: "¿Se admiten niños?", answer: "¡Por supuesto!", sort_order: 1 },
                        { question: "¿Cuál es el dress code?", answer: form.dress_code || "Elegante.", sort_order: 2 },
                      ])}
                        style={{ width: "100%", padding: "14px", borderRadius: 10, border: `2px dashed ${T.line}`, background: "transparent", cursor: "pointer", fontSize: 13.5, color: T.inkSoft }}>
                        Cargar preguntas predefinidas
                      </button>
                    )}
                    {faqItems.map((f, i) => (
                      <div key={i} style={{ border: `1px solid ${T.line}`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                          <span style={{ fontSize: 12, color: T.inkMute }}>Pregunta {i + 1}</span>
                          <button onClick={() => removeFaqItem(i)} style={{ border: "none", background: "transparent", cursor: "pointer", color: T.rose }}><Trash2 size={14} /></button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          <Field label="Pregunta" value={f.question} onChange={v => updateFaqItem(i, "question", v)} placeholder="¿Hay parking?" />
                          <Field label="Respuesta" value={f.answer} onChange={v => updateFaqItem(i, "answer", v)} multiline placeholder="Sí, hay parking gratuito..." />
                        </div>
                      </div>
                    ))}
                  </Panel>
                </div>
              )}

              {/* TEMA */}
              {section === "tema" && (
                <div style={{ animation: "bfFade .42s cubic-bezier(.2,.7,.2,1)" }}>
                  <Head kicker="10 · Tema visual" title="Tema visual" desc="Elige el estilo de vuestra web de boda. El preview se actualiza al instante." />
                  <Panel>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                      {Object.entries(THEMES).map(([id, t]) => {
                        const active = form.theme_preset === id;
                        return (
                          <button key={id} onClick={() => update("theme_preset", id)}
                            style={{
                              border: active ? `2px solid ${T.gold}` : `1px solid ${T.line}`,
                              borderRadius: 14, overflow: "hidden", cursor: "pointer",
                              background: "transparent", padding: 0, textAlign: "left",
                              transform: active ? "translateY(-2px)" : "none",
                              transition: "all .18s", outline: active ? `2px solid ${T.gold}40` : "none",
                              outlineOffset: 2,
                            }}>
                            <div style={{ height: 72, background: t.paper, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                              <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: t.ink }}>Aa</span>
                              <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4 }}>
                                {[t.accent, t.ink, t.paper].map((c, ci) => (
                                  <div key={ci} style={{ width: 12, height: 12, borderRadius: "50%", background: c, border: `1px solid ${T.line}` }} />
                                ))}
                              </div>
                              {active && (
                                <div style={{ position: "absolute", top: 6, right: 6, width: 20, height: 20, borderRadius: "50%", background: T.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <Check size={11} color="#fff" strokeWidth={2.5} />
                                </div>
                              )}
                            </div>
                            <div style={{ padding: "8px 10px", borderTop: `1px solid ${T.line}`, background: T.card }}>
                              <p style={{ fontSize: 12.5, fontWeight: 600, color: T.ink, margin: "0 0 2px" }}>{t.label}</p>
                              <p style={{ fontSize: 10.5, color: T.inkMute, margin: 0 }}>{t.mood}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </Panel>
                </div>
              )}

              {/* QR */}
              {section === "qr" && (
                <div style={{ animation: "bfFade .42s cubic-bezier(.2,.7,.2,1)" }}>
                  <Head kicker="11 · QR" title="QR y compartir" desc="Comparte la web de vuestra boda con vuestros invitados." />
                  <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 18 }}>
                    <Panel style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: 220 }}>
                      <div style={{ width: 170, height: 170, background: "#fff", borderRadius: 12, padding: 12, border: `1px solid ${T.line}`, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 3 }}>
                        {Array(25).fill(0).map((_, i) => (
                          <div key={i} style={{ borderRadius: 2, background: [0,1,2,5,6,7,10,15,16,17,18,20,21,22,24].includes(i) ? T.ink : "transparent" }} />
                        ))}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
                        <button style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${T.line}`, background: T.card, fontSize: 12.5, color: T.ink, cursor: "pointer", fontWeight: 500 }}>Descargar PNG</button>
                        <button style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${T.line}`, background: T.card, fontSize: 12.5, color: T.ink, cursor: "pointer", fontWeight: 500 }}>PDF imprenta</button>
                      </div>
                    </Panel>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      <Panel>
                        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, letterSpacing: "1.2px", textTransform: "uppercase", color: T.inkMute, margin: "0 0 10px" }}>Dirección de tu web</p>
                        <div style={{ display: "flex", gap: 8 }}>
                          <div style={{ flex: 1, padding: "10px 14px", borderRadius: 10, background: T.bg, border: `1px solid ${T.line}` }}>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: T.inkSoft }}>bodasfacil.com/w/{form.slug || "tu-boda"}</span>
                          </div>
                          <button
                            onClick={() => { navigator.clipboard.writeText(`https://bodasfacil.com/w/${form.slug}`); toast.success("Enlace copiado ✓"); }}
                            style={{ padding: "10px 16px", borderRadius: 10, border: `1px solid ${T.line}`, background: T.card, fontSize: 12.5, color: T.ink, cursor: "pointer", fontWeight: 500, whiteSpace: "nowrap" }}>
                            Copiar
                          </button>
                        </div>
                      </Panel>
                      <Panel>
                        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, letterSpacing: "1.2px", textTransform: "uppercase", color: T.inkMute, margin: "0 0 12px" }}>Compartir directo</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {[
                            { label: "WhatsApp", color: "#25D366", href: `https://wa.me/?text=${encodeURIComponent(`¡Nuestra web de boda! 💍 https://bodasfacil.com/w/${form.slug}`)}` },
                            { label: "Email", color: T.gold, href: `mailto:?subject=Nuestra boda&body=https://bodasfacil.com/w/${form.slug}` },
                          ].map((s, i) => (
                            <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                              style={{ padding: "8px 16px", borderRadius: 999, background: s.color, color: "#fff", fontSize: 12.5, fontWeight: 600, textDecoration: "none", display: "inline-block" }}>
                              {s.label}
                            </a>
                          ))}
                        </div>
                      </Panel>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Phone Preview */}
          {showPreview && section !== "dashboard" && (
            <div style={{ borderLeft: `1px solid ${T.line}`, background: `linear-gradient(180deg, ${T.creamAlt} 0%, #f4efe7 100%)`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {/* Header */}
              <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${T.line}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.green, boxShadow: `0 0 0 3px ${T.green}30` }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, letterSpacing: "1.2px", textTransform: "uppercase", color: T.inkMute }}>Vista en vivo</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12, color: T.inkSoft }}>{theme.label}</span>
                  <Palette size={13} color={theme.accent} />
                </div>
              </div>

              {/* Phone */}
              <div className="bf-preview-scroll" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px 16px" }}>
                <PhonePreview theme={theme} screen={previewScreen} form={form} />
              </div>

              {/* Screen pills */}
              <div style={{ padding: "12px 16px", borderTop: `1px solid ${T.line}`, display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                {["home", "rsvp", "agenda", "mesas", "fotos"].map(sc => (
                  <button key={sc} onClick={() => setPreviewScreen(sc)}
                    style={{
                      padding: "5px 12px", borderRadius: 999, border: "none", fontSize: 11, cursor: "pointer", fontWeight: 500,
                      background: previewScreen === sc ? theme.accent : T.bg,
                      color: previewScreen === sc ? (theme.dark ? T.ink : "#fff") : T.inkSoft,
                      transition: "all .18s",
                    }}>
                    {sc === "home" ? "Inicio" : sc === "rsvp" ? "RSVP" : sc === "agenda" ? "Agenda" : sc === "mesas" ? "Mesas" : "Fotos"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
