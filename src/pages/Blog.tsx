import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Heart, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_image: string;
  author: string;
  created_at: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Blog de bodas — Guías, ideas y consejos para tu boda | BodasFácil";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Guías y consejos para organizar tu boda perfecta: cómo crear una web de boda, RSVP online, plan de mesas, playlist colaborativa, presupuesto y mucho más.");
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", "https://bodasfacil.com/blog");
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", "Blog de bodas — Guías, ideas y consejos | BodasFácil");
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", "Guías y consejos para organizar tu boda perfecta: web de boda, RSVP online, plan de mesas, playlist colaborativa y presupuesto.");
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", "https://bodasfacil.com/blog");

    const fetchPosts = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, slug, title, description, cover_image, author, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });
      const fetched = (data as BlogPost[]) || [];
      setPosts(fetched);
      setLoading(false);

      if (fetched.length > 0) {
        const existingList = document.getElementById("schema-blog-list");
        if (existingList) existingList.remove();
        const listSchema = document.createElement("script");
        listSchema.id = "schema-blog-list";
        listSchema.type = "application/ld+json";
        listSchema.text = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Blog de bodas — BodasFácil",
          "url": "https://bodasfacil.com/blog",
          "itemListElement": fetched.map((p, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "url": `https://bodasfacil.com/blog/${p.slug}`,
            "name": p.title
          }))
        });
        document.head.appendChild(listSchema);
      }
    };
    fetchPosts();

    return () => {
      document.title = "BodasFácil — Web de boda online desde 30€ | RSVP, Playlist y Plan de Mesas";
      document.querySelector('meta[name="description"]')?.setAttribute("content", "Crea la web de tu boda perfecta en minutos. RSVP online, playlist colaborativa, muro de fotos en vivo, plan de mesas, agenda del día, mapa y 18 temas visuales. Pago único desde 30€.");
      document.querySelector('link[rel="canonical"]')?.setAttribute("href", "https://bodasfacil.com/");
      document.querySelector('meta[property="og:title"]')?.setAttribute("content", "BodasFácil — Crea la web de tu boda perfecta desde 30€");
      document.querySelector('meta[property="og:description"]')?.setAttribute("content", "RSVP online, playlist colaborativa, muro de fotos en vivo, plan de mesas, agenda y 18 temas visuales. Pago único, sin suscripciones.");
      document.querySelector('meta[property="og:url"]')?.setAttribute("content", "https://bodasfacil.com/");
      document.getElementById("schema-blog-list")?.remove();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Heart className="w-8 h-8 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/95 backdrop-blur-md">
        <div className="container max-w-5xl flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <Heart className="w-5 h-5 text-primary" />
            <span className="font-heading text-lg sm:text-xl text-foreground">BodasFácil</span>
          </Link>
          <Link to="/auth" className="text-sm font-medium px-5 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            Crear mi boda
          </Link>
        </div>
      </nav>

      <div className="container max-w-4xl px-5 sm:px-8 py-12 sm:py-20">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>

        <div className="text-center mb-12 sm:mb-16">
          <BookOpen className="w-8 h-8 text-primary mx-auto mb-4 opacity-60" />
          <h1 className="font-heading text-4xl sm:text-5xl text-foreground mb-3">Blog de bodas</h1>
          <p className="text-muted-foreground font-light text-base sm:text-lg max-w-lg mx-auto">
            Guías, consejos e ideas para organizar tu boda perfecta: web de boda, RSVP, plan de mesas, playlist y más
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-light">Próximamente...</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {post.cover_image && (
                  <div className="h-48 sm:h-56 overflow-hidden">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span>{post.author}</span>
                    <span>·</span>
                    <time dateTime={post.created_at}>
                      {new Date(post.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                    </time>
                  </div>
                  <h2 className="font-heading text-xl sm:text-2xl text-foreground mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground font-light text-sm leading-relaxed mb-4">
                    {post.description}
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium group-hover:gap-3 gap-1.5 transition-all duration-300">
                    Leer artículo <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <footer className="py-8 border-t border-border bg-background">
        <div className="container max-w-4xl px-5 sm:px-8 text-center">
          <p className="text-muted-foreground text-xs font-light">
            © {new Date().getFullYear()} BodasFácil. Hecho con <Heart className="w-3 h-3 inline text-primary" /> en España.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Blog;
