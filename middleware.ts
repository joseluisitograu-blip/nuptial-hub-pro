const SUPABASE_URL = 'https://bcrymaflkapbfvytcjaq.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjcnltYWZsa2FwYmZ2eXRjamFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMjA0ODUsImV4cCI6MjA5MjU5NjQ4NX0.5Rfl8oJqvoUkoegt7vu_hmmZdEVHzsEVY8y0RGsty6w';

const BASE = 'https://bodasfacil.com';

const BOT_RE =
  /googlebot|bingbot|yandex|baiduspider|twitterbot|facebookexternalhit|linkedinbot|whatsapp|telegrambot|slackbot|discordbot|applebot|duckduckbot|rogerbot|embedly|quora|outbrain|pinterest|vkshare/i;

export const config = {
  matcher: ['/blog/:slug+', '/w/:slug+'],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function esc(s: string): string {
  return (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function safeJson(obj: unknown): string {
  return JSON.stringify(obj).replace(/<\/script>/gi, '<\\/script>');
}

async function supabaseFetch(path: string): Promise<Record<string, string> | null> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  const data = await res.json();
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

// ── HTML builders ─────────────────────────────────────────────────────────────

function blogPostHtml(post: Record<string, string>, slug: string): string {
  const url = `${BASE}/blog/${slug}`;
  const title = `${post.title} — BodasFácil`;
  const image = post.cover_image || `${BASE}/og-image.jpg`;

  const schemaBlogPosting = safeJson({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image,
    author: { '@type': 'Organization', name: 'BodasFácil', url: BASE },
    publisher: {
      '@type': 'Organization',
      name: 'BodasFácil',
      logo: { '@type': 'ImageObject', url: `${BASE}/favicon.png` },
    },
    datePublished: post.created_at,
    dateModified: post.created_at,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    inLanguage: 'es-ES',
  });

  const schemaBreadcrumb = safeJson({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${BASE}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  });

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(post.description)}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(post.description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${esc(image)}">
  <meta property="og:image:alt" content="${esc(post.title)}">
  <meta property="og:locale" content="es_ES">
  <meta property="og:site_name" content="BodasFácil">
  <meta property="article:published_time" content="${esc(post.created_at)}">
  <meta property="article:author" content="BodasFácil">
  <meta property="article:section" content="Bodas">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@bodasfacil">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(post.description)}">
  <meta name="twitter:image" content="${esc(image)}">
  <script type="application/ld+json">${schemaBlogPosting}</script>
  <script type="application/ld+json">${schemaBreadcrumb}</script>
</head>
<body>
  <h1>${esc(post.title)}</h1>
  <p>${esc(post.description)}</p>
  <p>Por ${esc(post.author)} · ${new Date(post.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
</body>
</html>`;
}

function weddingHtml(wedding: Record<string, string>, slug: string): string {
  const isDemo = slug.startsWith('demo-');
  const url = `${BASE}/w/${slug}`;
  const p1 = wedding.partner1_name || '';
  const p2 = wedding.partner2_name || '';
  const title = isDemo
    ? `Demo web de boda ${wedding.theme_preset} — BodasFácil`
    : `Boda de ${p1} & ${p2} — BodasFácil`;
  const description = isDemo
    ? `Explora esta demo de web de boda con tema ${wedding.theme_preset}. RSVP online, plan de mesas, playlist colaborativa y mucho más. Crea la tuya desde 30€.`
    : `Web de boda de ${p1} & ${p2}. Confirma tu asistencia, consulta el menú, el plan de mesas y mucho más.`;
  const image = wedding.hero_image_url || `${BASE}/og-image.jpg`;

  const schemaWebPage = safeJson({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    image,
    isPartOf: { '@type': 'WebSite', name: 'BodasFácil', url: BASE },
  });

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${esc(image)}">
  <meta property="og:image:alt" content="${esc(title)}">
  <meta property="og:locale" content="es_ES">
  <meta property="og:site_name" content="BodasFácil">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@bodasfacil">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${esc(image)}">
  <script type="application/ld+json">${schemaWebPage}</script>
</head>
<body>
  <h1>${esc(title)}</h1>
  <p>${esc(description)}</p>
</body>
</html>`;
}

// ── Entry point ───────────────────────────────────────────────────────────────

export default async function middleware(request: Request): Promise<Response | void> {
  const ua = request.headers.get('user-agent') || '';
  if (!BOT_RE.test(ua)) return; // usuarios normales → SPA sin cambios

  const { pathname } = new URL(request.url);
  const parts = pathname.split('/').filter(Boolean);

  try {
    if (parts[0] === 'blog' && parts[1]) {
      const post = await supabaseFetch(
        `blog_posts?slug=eq.${encodeURIComponent(parts[1])}&published=eq.true&select=title,description,cover_image,author,created_at&limit=1`,
      );
      if (post) {
        return new Response(blogPostHtml(post, parts[1]), {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        });
      }
    }

    if (parts[0] === 'w' && parts[1]) {
      const wedding = await supabaseFetch(
        `weddings?slug=eq.${encodeURIComponent(parts[1])}&select=partner1_name,partner2_name,wedding_date,hero_image_url,theme_preset&limit=1`,
      );
      if (wedding) {
        return new Response(weddingHtml(wedding, parts[1]), {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        });
      }
    }
  } catch {
    // Si falla la consulta a Supabase, el bot recibe la SPA normalmente
  }
}
