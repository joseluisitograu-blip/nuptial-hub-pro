import { Share2, MessageCircle, QrCode } from "lucide-react";
import { useState } from "react";

interface Props {
  slug: string;
  partner1: string;
  partner2: string;
}

const WeddingShare = ({ slug, partner1, partner2 }: Props) => {
  const [showQR, setShowQR] = useState(false);
  const publishedOrigin = "https://clicktuboda.com";
  const url = `${publishedOrigin}/w/${slug}`;
  const text = encodeURIComponent(`¡${partner1} y ${partner2} se casan! 💍 Confirma tu asistencia aquí:`);
  const whatsappUrl = `https://wa.me/?text=${text}%20${encodeURIComponent(url)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;

  return (
    <div className="py-24 bg-secondary">
      <div className="container max-w-md text-center">
        <Share2 className="w-8 h-8 text-sand-accent mx-auto mb-4" />
        <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-3">Compartir</h2>
        <p className="text-muted-foreground font-light mb-8">
          Envía la invitación a tus seres queridos
        </p>

        <div className="flex flex-col gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white font-medium hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="w-5 h-5" /> Enviar por WhatsApp
          </a>

          <button
            onClick={() => setShowQR(!showQR)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-card border border-border text-foreground font-medium hover:bg-secondary transition-colors"
          >
            <QrCode className="w-5 h-5" /> {showQR ? "Ocultar QR" : "Mostrar código QR"}
          </button>
        </div>

        {showQR && (
          <div className="mt-8 animate-fade-in">
            <div className="inline-block bg-white p-4 rounded-xl shadow-lg">
              <img src={qrUrl} alt="Código QR de la boda" className="w-48 h-48" />
            </div>
            <p className="text-sm text-muted-foreground mt-3">Escanea para abrir la invitación</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeddingShare;
