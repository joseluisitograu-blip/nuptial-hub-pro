import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ContactModal from "@/components/ContactModal";

const Refund = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState("");

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="container max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>
        <h1 className="font-heading text-4xl text-foreground mb-8">Política de Reembolso</h1>
        <div className="prose prose-neutral max-w-none text-foreground/80 font-light leading-relaxed space-y-6">
          <p><strong>Última actualización:</strong> {new Date().toLocaleDateString("es-ES")}</p>

          <h2 className="font-heading text-xl text-foreground mt-8">Garantía de satisfacción de 30 días</h2>
          <p>Ofrecemos una garantía de devolución de 30 días. Si no estás satisfecho con tu compra, puedes solicitar un reembolso completo dentro de los 30 días naturales siguientes a la fecha original del pedido, sin necesidad de justificación.</p>

          <h2 className="font-heading text-xl text-foreground mt-8">Cómo solicitar un reembolso</h2>
          <p>Los reembolsos son procesados por nuestro proveedor de pagos, <strong>Paddle</strong>. Para solicitar un reembolso:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Visita <a href="https://paddle.net" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">paddle.net</a> e inicia sesión con el email que usaste para la compra.</li>
            <li>O <button onClick={() => { setContactSubject("Solicitud de reembolso"); setContactOpen(true); }} className="text-primary hover:underline">escríbenos desde aquí</button> y gestionaremos el reembolso por ti.</li>
          </ol>

          <h2 className="font-heading text-xl text-foreground mt-8">Plazo de procesamiento</h2>
          <p>Una vez aprobado, el reembolso se procesará en un plazo de 5-10 días hábiles, dependiendo de tu entidad bancaria.</p>

          <h2 className="font-heading text-xl text-foreground mt-8">Excepciones</h2>
          <p>En caso de uso fraudulento o abuso del servicio, nos reservamos el derecho de denegar el reembolso.</p>

          <h2 className="font-heading text-xl text-foreground mt-8">Contacto</h2>
          <p>Para cualquier pregunta sobre reembolsos, <button onClick={() => { setContactSubject("Pregunta sobre reembolso"); setContactOpen(true); }} className="text-primary hover:underline">escríbenos desde aquí</button>.</p>
        </div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} subject={contactSubject} />
    </div>
  );
};

export default Refund;
