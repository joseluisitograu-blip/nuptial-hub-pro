

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Heart, ArrowLeft, ArrowRight } from "lucide-react";

interface Post {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  cover_image: string;
  author: string;
  created_at: string;
}

const renderMarkdown = (text: string) => {
  return text
    .replace(/^### (.+)$/gm, '<h3 class="font-heading text-xl text-foreground mt-10 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="font-heading text-2xl text-foreground mt-12 mb-4">$1</h2>')
    .replace(/\*\*(\d+)\. (.+?)\*\*/g, '<strong class="text-foreground">$1. $2</strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
    .replace(/^---$/gm, '<hr class="border-border my-10">')
    .replace(/^(?!<[hHaA]|<s|<hr)(.+)$/gm, '<p class="text-foreground/80 font-light leading-relaxed mb-4">$1</p>')
    .replace(/<p class="text-foreground\/80 font-light leading-relaxed mb-4"><\/p>/g, '');
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();
      setPost(data as Post | null);
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} — BodasFácil`;

      document.querySelector('meta[name="description"]')?.setAttribute("content", post.description);
      document.querySelector('link[rel="canonical"]')?.setAttribute("href", `https://bodasfacil.com/blog/${post.slug}`);

      document.querySelector('meta[property="og:type"]')?.setAttribute("content", "article");
      document.querySelector('meta[property="og:title"]')?.setAttribute("content", `${post.title} — BodasFácil`);
      document.querySelector('meta[property="og:description"]')?.setAttribute("content", post.description);
      document.querySelector('meta[property="og:url"]')?.setAttribute("content", `https://bodasfacil.com/blog/${post.slug}`);
      if (post.cover_image) {
        document.querySelector('meta[property="og:image"]')?.setAttribute("content", post.cover_image);
        document.querySelector('meta[property="og:image:alt"]')?.setAttribute("content", post.title);
        document.querySelector('meta[name="twitter:image"]')?.setAttribute("content", post.cover_image);
      }
      document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", `${post.title} — BodasFácil`);
      document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", post.description);

      // Open Graph article tags
      const setOgArticleMeta = (property: string, content: string) => {
        let el = document.querySelector(`meta[property="${property}"]`);
        if (!el) { el = document.createElement("meta"); el.setAttribute("property", property); document.head.appendChild(el); }
        el.setAttribute("content", content);
      };
      setOgArticleMeta("article:published_time", post.created_at);
      setOgArticleMeta("article:modified_time", post.created_at);
      setOgArticleMeta("article:author", "BodasFácil");
      setOgArticleMeta("article:section", "Bodas");

      // Schema BlogPosting dinámico
      const existingSchema = document.getElementById("schema-article");
      if (existingSchema) existingSchema.remove();

      const schema = document.createElement("script");
      schema.id = "schema-article";
      schema.type = "application/ld+json";
      schema.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.description,
        "image": post.cover_image || "https://bodasfacil.com/og-image.jpg",
        "author": {
          "@type": "Organization",
          "name": "BodasFácil",
          "url": "https://bodasfacil.com"
        },
        "publisher": {
          "@type": "Organization",
          "name": "BodasFácil",
          "logo": {
            "@type": "ImageObject",
            "url": "https://bodasfacil.com/favicon.png"
          }
        },
        "datePublished": post.created_at,
        "dateModified": post.created_at,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://bodasfacil.com/blog/${post.slug}`
        },
        "url": `https://bodasfacil.com/blog/${post.slug}`,
        "inLanguage": "es-ES"
      });
      document.head.appendChild(schema);
    }

    return () => {
      document.title = "BodasFácil — Crea la web de tu boda en minutos | Desde 30€";
      document.querySelector('meta[name="description"]')?.setAttribute("content", "Crea la web de tu boda perfecta en minutos. RSVP online, playlist colaborativa, muro de fotos en vivo, plan de mesas, agenda del día, mapa y 12 temas visuales. Pago único desde 30€.");
      document.querySelector('link[rel="canonical"]')?.setAttribute("href", "https://bodasfacil.com/");
      document.querySelector('meta[property="og:type"]')?.setAttribute("content", "website");
      document.querySelector('meta[property="og:title"]')?.setAttribute("content", "BodasFácil — Crea la web de tu boda perfecta desde 30€");
      document.querySelector('meta[property="og:description"]')?.setAttribute("content", "RSVP online, playlist colaborativa, muro de fotos en vivo, plan de mesas, agenda y 12 temas visuales. Pago único, sin suscripciones.");
      document.querySelector('meta[property="og:url"]')?.setAttribute("content", "https://bodasfacil.com/");
      document.querySelector('meta[property="og:image"]')?.setAttribute("content", "https://bodasfacil.com/og-image.jpg");
      document.querySelector('meta[property="og:image:alt"]')?.setAttribute("content", "BodasFácil — Crea la web de tu boda perfecta");
      document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", "BodasFácil — Crea la web de tu boda perfecta desde 30€");
      document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", "RSVP online, playlist colaborativa, muro de fotos en vivo, plan de mesas, agenda y 12 temas visuales. Pago único, sin suscripciones.");
      document.querySelector('meta[name="twitter:image"]')?.setAttribute("content", "https://bodasfacil.com/og-image.jpg");
      document.getElementById("schema-article")?.remove();
      ["article:published_time", "article:modified_time", "article:author", "article:section"].forEach((p) => {
        document.querySelector(`meta[property="${p}"]`)?.remove();
      });
    };
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Heart className="w-8 h-8 text-primary animate-pulse" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl text-foreground mb-2">Artículo no encontrado</h1>
          <Link to="/blog" className="text-primary hover:underline text-sm">Volver al blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-50">
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

      <article className="container max-w-3xl px-5 sm:px-8 py-12 sm:py-16">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Volver al blog
        </Link>

        {post.cover_image && (
          <div className="rounded-xl overflow-hidden mb-8 h-64 sm:h-80">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
          <span>{post.author}</span>
          <span>·</span>
          <span>{new Date(post.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-4 leading-tight">
          {post.title}
        </h1>

        <p className="text-muted-foreground font-light text-lg mb-10 leading-relaxed">
          {post.description}
        </p>

        <div
          className="prose-custom"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />

        {/* CTA al final */}
        <div className="mt-16 bg-secondary rounded-xl p-8 sm:p-10 text-center">
          <Heart className="w-7 h-7 text-primary mx-auto mb-4 opacity-60" />
          <h3 className="font-heading text-2xl text-foreground mb-2">
            ¿Preparando vuestra boda?
          </h3>
          <p className="text-muted-foreground font-light mb-6 max-w-md mx-auto">
            Cread vuestra web de boda en minutos. RSVP, playlist, fotos en vivo, agenda y mucho más. Desde 30€, pago único.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Crear mi boda gratis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </article>

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

export default BlogPost;
