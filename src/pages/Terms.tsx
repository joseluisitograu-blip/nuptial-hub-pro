import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Terms = () => (
  <div className="min-h-screen bg-background py-16 px-4">
    <div className="container max-w-3xl">
      <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 text-sm">
        <ArrowLeft className="w-4 h-4" /> Volver
      </Link>
      <h1 className="font-heading text-4xl text-foreground mb-8">Términos y Condiciones</h1>
      <div className="prose prose-neutral max-w-none text-foreground/80 font-light leading-relaxed space-y-6">
        <p><strong>Última actualización:</strong> {new Date().toLocaleDateString("es-ES")}</p>

        <h2 className="font-heading text-xl text-foreground mt-8">1. Identificación del prestador</h2>
        <p>El presente servicio es ofrecido por [NOMBRE LEGAL O RAZÓN SOCIAL] (en adelante, "Click Tu Boda"). Al utilizar el servicio, aceptas estos términos.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">2. Aceptación</h2>
        <p>El uso continuado del servicio implica la aceptación plena de estos términos. Si no estás de acuerdo, no utilices el servicio.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">3. Descripción del servicio</h2>
        <p>Click Tu Boda es una plataforma que permite crear páginas web personalizadas para bodas, incluyendo RSVP, playlist, muro de fotos, agenda, mapas y otras funcionalidades.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">4. Registro y credenciales</h2>
        <p>Debes proporcionar información veraz al registrarte. Eres responsable de mantener la confidencialidad de tus credenciales y de toda actividad bajo tu cuenta.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">5. Uso aceptable</h2>
        <p>No está permitido:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Usar el servicio con fines ilícitos, fraudulentos o de spam.</li>
          <li>Infringir derechos de propiedad intelectual de terceros.</li>
          <li>Interferir con la seguridad del servicio (malware, scraping, acceso no autorizado).</li>
          <li>Subir contenido ilegal, ofensivo o que viole derechos de terceros.</li>
        </ul>

        <h2 className="font-heading text-xl text-foreground mt-8">6. Propiedad intelectual</h2>
        <p>Click Tu Boda es titular de todos los derechos de propiedad intelectual sobre el software, diseño, documentación y marca del servicio. El usuario conserva la titularidad de su contenido y otorga a Click Tu Boda una licencia limitada para alojarlo y mostrarlo únicamente para prestar el servicio.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">7. Licencia de uso</h2>
        <p>Te otorgamos una licencia limitada, no exclusiva, no transferible y revocable para usar el servicio dentro del plan contratado. No está permitido revender, redistribuir ni aplicar ingeniería inversa.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">8. Pagos y suscripciones</h2>
        <p>Nuestro proceso de pago es gestionado por nuestro revendedor online <strong>Paddle.com</strong>. Paddle.com es el Merchant of Record de todos nuestros pedidos. Paddle proporciona toda la atención al cliente y gestiona las devoluciones.</p>
        <p>Para más detalles sobre facturación, impuestos, cancelaciones y reembolsos, consulta los <a href="https://www.paddle.com/legal/checkout-buyer-terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Términos del Comprador de Paddle</a>.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">9. Disponibilidad del servicio</h2>
        <p>No garantizamos que el servicio funcione de manera ininterrumpida o libre de errores. Nos esforzamos por mantener una alta disponibilidad, pero pueden producirse interrupciones por mantenimiento o causas ajenas.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">10. Suspensión y terminación</h2>
        <p>Podemos suspender o cancelar el acceso en caso de: incumplimiento material de estos términos, impago, riesgo de seguridad o fraude, o violaciones reiteradas de las políticas.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">11. Limitación de responsabilidad</h2>
        <p>En la medida permitida por ley, Click Tu Boda no será responsable de daños indirectos, consecuenciales o especiales (pérdida de beneficios, datos o reputación). La responsabilidad total se limita a las cantidades pagadas en los últimos 12 meses.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">12. Ley aplicable y jurisdicción</h2>
        <p>Estos términos se rigen por la legislación española. Para cualquier controversia serán competentes los juzgados y tribunales del domicilio del prestador.</p>
      </div>
    </div>
  </div>
);

export default Terms;
