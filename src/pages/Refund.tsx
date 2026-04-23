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
          <p>Ofrecemos una garantía de devolución de 30 días naturales. Si no estás satisfecho con tu compra, puedes solicitar un reembolso completo dentro de los 30 días naturales siguientes a la <strong>fecha original del pedido</strong>, sin necesidad de justificación.</p>
          <p>El período de 30 días comienza en la fecha de la transacción original, independientemente de cuándo comiences a usar el servicio.</p>

          <h2 className="font-heading text-xl text-foreground mt-8">Cómo solicitar un reembolso</h2>
          <p>Los reembolsos son procesados por nuestro proveedor de pagos, <strong>Paddle</strong> (Merchant of Record). Para solicitar un reembolso tienes dos opciones:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Visita <a href="https://paddle.net" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">paddle.net</a> e inicia sesión con el email que usaste para la compra. Desde allí podrás gestionar tu pedido y solicitar el reembolso directamente.</li>
            <li>O <button onClick={() => { setContactSubject("Solicitud de reembolso"); setContactOpen(true); }} className="text-primary hover:underline font-medium">escríbenos desde aquí</button> indicando tu email de compra y gestionaremos el reembolso por ti lo antes posible.</li>
          </ol>

          <h2 className="font-heading text-xl text-foreground mt-8">Plazo de procesamiento</h2>
          <p>Una vez aprobado el reembolso, el importe se devolverá al método de pago original en un plazo de 5-10 días hábiles, dependiendo de tu entidad bancaria o proveedor de pago.</p>

          <h2 className="font-heading text-xl text-foreground mt-8">Efectos del reembolso</h2>
          <p>Tras la aprobación del reembolso:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Tu página de boda dejará de estar accesible públicamente.</li>
            <li>Perderás el acceso a las funcionalidades premium del plan contratado.</li>
            <li>Los datos de tu boda se conservarán durante 30 días adicionales por si cambias de opinión. Transcurrido ese plazo, serán eliminados de forma definitiva.</li>
            <li>Tu cuenta de usuario permanecerá activa, permitiéndote adquirir un nuevo plan en el futuro si lo deseas.</li>
          </ul>

          <h2 className="font-heading text-xl text-foreground mt-8">Excepciones</h2>
          <p>Nos reservamos el derecho de denegar el reembolso en los siguientes casos:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Uso fraudulento o abuso del servicio.</li>
            <li>Solicitudes realizadas fuera del período de 30 días desde la fecha del pedido.</li>
            <li>Solicitudes reiteradas que evidencien un patrón de abuso de la política de reembolso.</li>
          </ul>

          <h2 className="font-heading text-xl text-foreground mt-8">Política de Paddle</h2>
          <p>Para más información sobre el proceso de reembolso, puedes consultar la <a href="https://www.paddle.com/legal/refund-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Política de Reembolso de Paddle</a>.</p>

          <h2 className="font-heading text-xl text-foreground mt-8">Contacto</h2>
          <p>Para cualquier pregunta sobre reembolsos, <button onClick={() => { setContactSubject("Pregunta sobre reembolso"); setContactOpen(true); }} className="text-primary hover:underline font-medium">escríbenos desde aquí</button> o envía un email a <a href="mailto:joseluisitograu@gmail.com" className="text-primary hover:underline">joseluisitograu@gmail.com</a>.</p>

          <h2 className="font-heading text-xl text-foreground mt-8">Documentos relacionados</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><Link to="/terminos" className="text-primary hover:underline">Términos y Condiciones</Link></li>
            <li><Link to="/privacidad" className="text-primary hover:underline">Política de Privacidad</Link></li>
            <li><a href="https://www.paddle.com/legal/checkout-buyer-terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Términos del Comprador de Paddle</a></li>
          </ul>
        </div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} subject={contactSubject} />
    </div>
  );
};

export default Refund;
