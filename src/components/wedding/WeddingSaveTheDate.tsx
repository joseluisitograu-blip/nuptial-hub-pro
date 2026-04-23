import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Loader2 } from "lucide-react";

interface Props {
  partner1: string;
  partner2: string;
  weddingDate: string | null;
  ceremonyVenue?: string;
  heroImageUrl?: string;
}

const WeddingSaveTheDate = ({ partner1, partner2, weddingDate, ceremonyVenue, heroImageUrl }: Props) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const formattedDate = weddingDate
    ? new Date(weddingDate).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 3,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `save-the-date-${partner1}-${partner2}.png`.toLowerCase().replace(/\s+/g, "-");
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error generating image:", err);
    }
    setDownloading(false);
  };

  return (
    <div className="py-20 bg-secondary/30" id="save-the-date">
      <div className="container max-w-lg text-center">
        <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-2">
          Descarga tu invitación
        </h2>
        <p className="text-muted-foreground font-light mb-8 text-sm">
          Compártela por WhatsApp, Instagram o imprímela
        </p>

        {/* The card to capture */}
        <div className="mx-auto" style={{ maxWidth: 400 }}>
          <div
            ref={cardRef}
            className="relative overflow-hidden rounded-2xl"
            style={{
              width: 400,
              height: 560,
              background: "linear-gradient(145deg, hsl(var(--primary) / 0.08), hsl(var(--secondary)))",
            }}
          >
            {/* Background image overlay */}
            {heroImageUrl && (
              <div className="absolute inset-0">
                <img
                  src={heroImageUrl}
                  alt=""
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover opacity-20"
                />
              </div>
            )}

            {/* Decorative border */}
            <div
              className="absolute inset-3 rounded-xl"
              style={{
                border: "1px solid hsl(var(--primary) / 0.25)",
              }}
            />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-8">
              <p
                className="uppercase tracking-[0.35em] mb-6"
                style={{
                  fontSize: 10,
                  color: "hsl(var(--muted-foreground))",
                  fontFamily: "Work Sans, sans-serif",
                  fontWeight: 300,
                }}
              >
                Save the date
              </p>

              <div className="mb-6" style={{ lineHeight: 1 }}>
                <p
                  style={{
                    fontFamily: "Instrument Serif, serif",
                    fontSize: 44,
                    color: "hsl(var(--foreground))",
                  }}
                >
                  {partner1}
                </p>
                <p
                  style={{
                    fontFamily: "Work Sans, sans-serif",
                    fontSize: 16,
                    fontWeight: 300,
                    color: "hsl(var(--muted-foreground))",
                    margin: "8px 0",
                    letterSpacing: "0.3em",
                  }}
                >
                  &
                </p>
                <p
                  style={{
                    fontFamily: "Instrument Serif, serif",
                    fontSize: 44,
                    color: "hsl(var(--foreground))",
                  }}
                >
                  {partner2}
                </p>
              </div>

              {/* Divider */}
              <div
                className="mx-auto mb-6"
                style={{
                  width: 60,
                  height: 1,
                  background: "hsl(var(--primary) / 0.4)",
                }}
              />

              {formattedDate && (
                <p
                  style={{
                    fontFamily: "Work Sans, sans-serif",
                    fontSize: 15,
                    fontWeight: 400,
                    color: "hsl(var(--foreground))",
                    letterSpacing: "0.08em",
                  }}
                >
                  {formattedDate}
                </p>
              )}

              {ceremonyVenue && (
                <p
                  className="mt-2"
                  style={{
                    fontFamily: "Work Sans, sans-serif",
                    fontSize: 12,
                    fontWeight: 300,
                    color: "hsl(var(--muted-foreground))",
                  }}
                >
                  {ceremonyVenue}
                </p>
              )}

              {/* Small heart */}
              <div className="mt-8">
                <svg
                  width="16"
                  height="14"
                  viewBox="0 0 16 14"
                  fill="none"
                  style={{ opacity: 0.3 }}
                >
                  <path
                    d="M8 14L6.84 12.958C2.72 9.22 0 6.76 0 3.79C0 1.33 1.936 0 3.6 0C4.576 0 5.52 0.44 8 2.64C10.48 0.44 11.424 0 12.4 0C14.064 0 16 1.33 16 3.79C16 6.76 13.28 9.22 9.16 12.958L8 14Z"
                    fill="hsl(var(--primary))"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
        >
          {downloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {downloading ? "Generando..." : "Descargar imagen"}
        </button>
      </div>
    </div>
  );
};

export default WeddingSaveTheDate;
