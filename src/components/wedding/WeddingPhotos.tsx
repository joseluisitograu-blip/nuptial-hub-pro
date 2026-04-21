import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Camera, Upload, X } from "lucide-react";

interface Photo {
  id: string;
  photo_url: string;
  caption: string;
  uploaded_by: string;
}

const WeddingPhotos = ({ weddingId }: { weddingId: string }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchPhotos = async () => {
    const { data } = await supabase
      .from("wedding_photos")
      .select("*")
      .eq("wedding_id", weddingId)
      .order("created_at", { ascending: false });
    setPhotos((data as Photo[]) || []);
  };

  useEffect(() => {
    fetchPhotos();
  }, [weddingId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const path = `${weddingId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("wedding-photos")
      .upload(path, file);

    if (!uploadError) {
      const { data: urlData } = supabase.storage
        .from("wedding-photos")
        .getPublicUrl(path);

      await supabase.from("wedding_photos").insert({
        wedding_id: weddingId,
        photo_url: urlData.publicUrl,
        caption: "",
        uploaded_by: "",
      });
      fetchPhotos();
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="py-24 bg-secondary">
      <div className="container max-w-5xl">
        <div className="text-center mb-12">
          <Camera className="w-8 h-8 text-sand-accent mx-auto mb-4" />
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-2">Muro de fotos</h2>
          <p className="text-muted-foreground font-light">
            ¡Comparte tus mejores momentos!
          </p>
        </div>

        {photos.length > 0 && (
          <div className="columns-2 md:columns-3 gap-3 mb-8">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="mb-3 break-inside-avoid cursor-pointer group"
                onClick={() => setExpanded(photo.photo_url)}
              >
                <img
                  src={photo.photo_url}
                  alt={photo.caption || "Foto de boda"}
                  className="w-full rounded-xl object-cover group-hover:opacity-90 transition-opacity"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Subiendo..." : "Subir foto"}
          </button>
        </div>

        {/* Lightbox */}
        {expanded && (
          <div
            className="fixed inset-0 bg-foreground/90 z-50 flex items-center justify-center p-4"
            onClick={() => setExpanded(null)}
          >
            <button className="absolute top-6 right-6 text-primary-foreground">
              <X className="w-8 h-8" />
            </button>
            <img
              src={expanded}
              alt="Foto ampliada"
              className="max-w-full max-h-[90vh] rounded-xl object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WeddingPhotos;
