import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, X, Save, Palette, Check, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface WeddingEdits {
  partner1_name?: string;
  partner2_name?: string;
  dress_code?: string;
  gift_message?: string;
  theme_preset?: string;
  hero_image_url?: string;
  ceremony_venue?: string;
  ceremony_address?: string;
  ceremony_time?: string;
  reception_venue?: string;
  reception_address?: string;
  reception_time?: string;
  menu_starters?: string;
  menu_mains?: string;
  menu_desserts?: string;
  bank_account?: string;
  whatsapp_number?: string;
}

interface Props {
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  weddingId: string;
  currentTheme: string;
  edits: WeddingEdits;
  onThemeChange: (theme: string) => void;
  onSave: () => Promise<void>;
  hasChanges: boolean;
}

const themes = [
  { id: "elegant", label: "Elegante", color: "hsl(33, 30%, 40%)" },
  { id: "romantic", label: "Romántico", color: "hsl(340, 45%, 55%)" },
  { id: "rustic", label: "Rústico", color: "hsl(25, 50%, 32%)" },
  { id: "modern", label: "Moderno", color: "hsl(220, 25%, 18%)" },
];

const WeddingEditToolbar = ({
  editMode,
  setEditMode,
  weddingId,
  currentTheme,
  edits,
  onThemeChange,
  onSave,
  hasChanges,
}: Props) => {
  const [showThemes, setShowThemes] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave();
      toast({ title: "¡Cambios guardados!", description: "Tu web se ha actualizado." });
    } catch {
      toast({ title: "Error al guardar", variant: "destructive" });
    }
    setSaving(false);
  };

  // Floating edit button (when NOT in edit mode)
  if (!editMode) {
    return (
      <button
        onClick={() => setEditMode(true)}
        className="fixed bottom-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground shadow-xl hover:opacity-90 transition-all hover:scale-105 animate-fade-in"
        title="Editar página"
      >
        <Pencil className="w-4 h-4" />
        <span className="text-sm font-medium">Editar</span>
      </button>
    );
  }

  return (
    <>
      {/* Top edit bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-foreground/95 backdrop-blur-md text-background border-b border-background/10 shadow-2xl animate-fade-in">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditMode(false)}
              className="p-1.5 rounded-lg hover:bg-background/10 transition-colors"
              title="Salir del editor"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <p className="text-sm font-medium">Modo edición</p>
              <p className="text-[10px] text-background/60">Haz clic en cualquier texto para editarlo</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme picker */}
            <div className="relative">
              <button
                onClick={() => setShowThemes(!showThemes)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-background/10 transition-colors"
              >
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Tema</span>
              </button>
              {showThemes && (
                <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-2xl p-3 min-w-[180px] animate-fade-in">
                  <p className="text-foreground text-xs font-medium mb-2">Elige un tema</p>
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onThemeChange(t.id);
                        setShowThemes(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        currentTheme === t.id
                          ? "bg-secondary text-foreground font-medium"
                          : "text-muted-foreground hover:bg-secondary/50"
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: t.color }}
                      />
                      {t.label}
                      {currentTheme === t.id && <Check className="w-3.5 h-3.5 ml-auto" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Full editor link */}
            <Link
              to={`/dashboard/edit/${weddingId}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-background/10 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Editor completo</span>
            </Link>

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-background text-foreground hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Guardar
            </button>
          </div>
        </div>
      </div>

      {/* Overlay to catch clicks outside theme picker */}
      {showThemes && (
        <div className="fixed inset-0 z-[59]" onClick={() => setShowThemes(false)} />
      )}
    </>
  );
};

export default WeddingEditToolbar;
