import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Send, Mic, MicOff, Play, Pause, Trash2 } from "lucide-react";

interface Entry {
  id: string;
  author_name: string;
  message: string;
  audio_url: string | null;
  created_at: string;
}

const WeddingGuestbook = ({ weddingId }: { weddingId: string }) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  // Audio recording
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Audio playback
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioPreviewUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      alert("No se pudo acceder al micrófono.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const clearAudio = () => {
    setAudioBlob(null);
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    setAudioPreviewUrl(null);
  };

  const togglePlay = (url: string, id: string) => {
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(url);
    audio.onended = () => setPlayingId(null);
    audio.play();
    audioRef.current = audio;
    setPlayingId(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || (!message.trim() && !audioBlob)) return;
    setSending(true);

    let uploadedAudioUrl = "";

    if (audioBlob) {
      const fileName = `${weddingId}/${Date.now()}.webm`;
      const { error: uploadError } = await supabase.storage
        .from("wedding-photos")
        .upload(`audio/${fileName}`, audioBlob, { contentType: "audio/webm" });

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("wedding-photos")
          .getPublicUrl(`audio/${fileName}`);
        uploadedAudioUrl = urlData.publicUrl;
      }
    }

    await supabase.from("guestbook").insert({
      wedding_id: weddingId,
      author_name: name.trim(),
      message: message.trim() || "🎤 Mensaje de voz",
      audio_url: uploadedAudioUrl || null,
    });

    setName("");
    setMessage("");
    clearAudio();
    setSending(false);
    fetchEntries();
  };

  return (
    <div className="py-24 bg-background">
      <div className="container max-w-2xl">
        <div className="text-center mb-12">
          <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-2">Libro de firmas</h2>
          <p className="text-muted-foreground font-light">Deja un mensaje o nota de voz a los novios</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 mb-8 space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            maxLength={100}
            className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-light text-sm"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tu mensaje para los novios ✨"
            maxLength={500}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-light resize-none text-sm"
          />

          {/* Audio recorder */}
          <div className="flex items-center gap-3">
            {!audioPreviewUrl ? (
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isRecording
                    ? "bg-destructive text-destructive-foreground animate-pulse"
                    : "bg-secondary text-foreground hover:bg-muted"
                }`}
              >
                {isRecording ? (
                  <><MicOff className="w-4 h-4" /> Parar</>
                ) : (
                  <><Mic className="w-4 h-4" /> Grabar audio</>
                )}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <audio src={audioPreviewUrl} controls className="h-8" />
                <button type="button" onClick={clearAudio} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={sending || !name.trim() || (!message.trim() && !audioBlob)}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> {sending ? "Enviando..." : "Firmar"}
          </button>
        </form>

        {entries.length > 0 && (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-heading text-base text-foreground">{entry.author_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(entry.created_at).toLocaleDateString("es-ES")}
                  </p>
                </div>
                {entry.message && entry.message !== "🎤 Mensaje de voz" && (
                  <p className="text-foreground/80 text-sm font-light leading-relaxed">"{entry.message}"</p>
                )}
                {entry.audio_url && (
                  <button
                    onClick={() => togglePlay(entry.audio_url!, entry.id)}
                    className="mt-2 flex items-center gap-2 text-sm text-primary hover:opacity-80 transition-opacity"
                  >
                    {playingId === entry.id ? (
                      <><Pause className="w-4 h-4" /> Pausar audio</>
                    ) : (
                      <><Play className="w-4 h-4" /> Escuchar mensaje de voz</>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeddingGuestbook;
