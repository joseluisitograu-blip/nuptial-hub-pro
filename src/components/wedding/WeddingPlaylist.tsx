import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Music, ThumbsUp, Plus } from "lucide-react";

interface Song {
  id: string;
  song_title: string;
  artist: string;
  suggested_by: string;
  votes: number;
}

const WeddingPlaylist = ({ weddingId }: { weddingId: string }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ song_title: "", artist: "", suggested_by: "" });
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  const fetchSongs = async () => {
    const { data } = await supabase
      .from("playlist_songs")
      .select("*")
      .eq("wedding_id", weddingId)
      .order("votes", { ascending: false });
    setSongs((data as Song[]) || []);
  };

  useEffect(() => {
    fetchSongs();
  }, [weddingId]);

  const addSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.song_title.trim()) return;
    await supabase.from("playlist_songs").insert({
      wedding_id: weddingId,
      song_title: form.song_title,
      artist: form.artist,
      suggested_by: form.suggested_by,
    });
    setForm({ song_title: "", artist: "", suggested_by: "" });
    setShowForm(false);
    fetchSongs();
  };

  const vote = async (id: string, currentVotes: number) => {
    if (votedIds.has(id)) return;
    setVotedIds((prev) => new Set(prev).add(id));
    await supabase.rpc("vote_for_song", { song_id: id });
    fetchSongs();
  };

  return (
    <div className="py-24 bg-background">
      <div className="container max-w-2xl">
        <div className="text-center mb-12">
          <Music className="w-8 h-8 text-sand-accent mx-auto mb-4" />
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-2">Playlist</h2>
          <p className="text-muted-foreground font-light">
            ¡Sugiere canciones para la fiesta!
          </p>
        </div>

        {songs.length > 0 && (
          <div className="space-y-3 mb-8">
            {songs.map((song, i) => (
              <div
                key={song.id}
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-sm transition-shadow"
              >
                <span className="text-muted-foreground text-sm font-mono w-6 text-right">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{song.song_title}</p>
                  <p className="text-sm text-muted-foreground font-light truncate">
                    {song.artist}
                    {song.suggested_by && ` · sugerida por ${song.suggested_by}`}
                  </p>
                </div>
                <button
                  onClick={() => vote(song.id, song.votes)}
                  disabled={votedIds.has(song.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                    votedIds.has(song.id)
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary text-secondary-foreground hover:bg-primary/10"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  {song.votes}
                </button>
              </div>
            ))}
          </div>
        )}

        {showForm ? (
          <form onSubmit={addSong} className="bg-card border border-border rounded-xl p-6 space-y-4">
            <input
              type="text"
              required
              value={form.song_title}
              onChange={(e) => setForm({ ...form, song_title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-light"
              placeholder="Nombre de la canción"
            />
            <input
              type="text"
              value={form.artist}
              onChange={(e) => setForm({ ...form, artist: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-light"
              placeholder="Artista"
            />
            <input
              type="text"
              value={form.suggested_by}
              onChange={(e) => setForm({ ...form, suggested_by: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-light"
              placeholder="Tu nombre"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                Añadir
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" /> Sugerir canción
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeddingPlaylist;
