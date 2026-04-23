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
        <p>El presente servicio es ofrecido por José Luis Grau Perales (en adelante, "Click Tu Boda"). Al utilizar el servicio, aceptas estos términos y confirmas que estás contratando directamente con Click Tu Boda.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">2. Aceptación y autoridad</h2>
        <p>El uso continuado del servicio implica la aceptación plena de estos términos. Si no estás de acuerdo, no utilices el servicio.</p>
        <p>Al aceptar estos términos, declaras que eres mayor de 18 años o que tienes la autoridad legal necesaria para vincularte a estos términos. Si actúas en nombre de una organización, declaras tener autoridad para obligar a dicha organización.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">3. Descripción del servicio</h2>
        <p>Click Tu Boda es una plataforma que permite crear páginas web personalizadas para bodas, incluyendo RSVP, playlist, muro de fotos, agenda, mapas y otras funcionalidades.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">4. Registro, credenciales y veracidad de datos</h2>
        <p>Debes proporcionar información veraz y actualizada al registrarte. Eres responsable de mantener la confidencialidad de tus credenciales de acceso y de toda actividad que se realice bajo tu cuenta. Debes notificarnos de inmediato cualquier uso no autorizado de tu cuenta.</p>
        <p>Te comprometes a mantener tus datos actualizados. Click Tu Boda no se hace responsable de los perjuicios derivados de información inexacta o desactualizada proporcionada por el usuario.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">5. Uso aceptable</h2>
        <p>No está permitido:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Usar el servicio con fines ilícitos, fraudulentos o de spam.</li>
          <li>Infringir derechos de propiedad intelectual de terceros.</li>
          <li>Interferir con la seguridad del servicio (malware, scraping, acceso no autorizado, ingeniería inversa).</li>
          <li>Subir contenido ilegal, ofensivo o que viole derechos de terceros.</li>
          <li>Revender, redistribuir o sublicenciar el acceso al servicio.</li>
        </ul>

        <h2 className="font-heading text-xl text-foreground mt-8">6. Propiedad intelectual</h2>
        <p>Click Tu Boda es titular de todos los derechos de propiedad intelectual sobre el software, diseño, documentación y marca del servicio. Ninguna parte de estos términos te otorga derechos sobre la propiedad intelectual del servicio más allá de la licencia limitada descrita a continuación.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">7. Licencia de uso</h2>
        <p>Te otorgamos una licencia limitada, no exclusiva, no transferible y revocable para usar el servicio dentro del plan contratado. No está permitido revender, redistribuir, aplicar ingeniería inversa ni eludir las limitaciones técnicas del servicio.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">8. Contenido del usuario</h2>
        <p>Conservas la titularidad de todo el contenido que subas o introduzcas en la plataforma (textos, fotos, datos de invitados, etc.). Al utilizar el servicio, otorgas a Click Tu Boda una licencia limitada, no exclusiva y revocable para alojar, procesar y mostrar dicho contenido exclusivamente con el fin de prestar el servicio contratado.</p>
        <p>Eres el único responsable de que tu contenido no infrinja derechos de terceros ni vulnere la legislación aplicable.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">9. Pagos y suscripciones</h2>
        <p>Nuestro proceso de pago es gestionado por nuestro revendedor online <strong>Paddle.com</strong>. Paddle.com es el Merchant of Record de todos nuestros pedidos. Paddle proporciona toda la atención al cliente relativa a pagos y gestiona las devoluciones.</p>
        <p>Para más detalles sobre facturación, impuestos, cancelaciones y reembolsos, consulta los <a href="https://www.paddle.com/legal/checkout-buyer-terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Términos del Comprador de Paddle</a>.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">10. Disponibilidad del servicio</h2>
        <p>No garantizamos que el servicio funcione de manera ininterrumpida o libre de errores. Nos esforzamos por mantener una alta disponibilidad, pero pueden producirse interrupciones por mantenimiento o causas ajenas.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">11. Exención de garantías</h2>
        <p>El servicio se proporciona "tal cual" y "según disponibilidad". En la medida máxima permitida por la legislación aplicable, Click Tu Boda excluye todas las garantías implícitas, incluyendo, sin limitación, las de comerciabilidad, idoneidad para un fin particular y no infracción.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">12. Suspensión y terminación</h2>
        <p>Podemos suspender o cancelar el acceso en caso de: incumplimiento material de estos términos, impago, riesgo de seguridad o fraude, o violaciones reiteradas de las políticas.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">13. Consecuencias de la terminación</h2>
        <p>Tras la cancelación de tu cuenta, dispondrás de un plazo de 30 días para solicitar la exportación de tus datos. Transcurrido dicho plazo, tus datos serán eliminados de forma definitiva de nuestros sistemas, salvo que exista una obligación legal de conservación.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">14. Limitación de responsabilidad</h2>
        <p>En la medida permitida por ley, Click Tu Boda no será responsable de daños indirectos, consecuenciales o especiales (pérdida de beneficios, datos o reputación). La responsabilidad total acumulada se limita a las cantidades efectivamente pagadas por el usuario en los últimos 12 meses.</p>
        <p>Nada en estos términos excluye o limita la responsabilidad por fallecimiento, lesiones personales o fraude.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">15. Indemnización</h2>
        <p>El usuario se compromete a indemnizar y mantener indemne a Click Tu Boda frente a cualquier reclamación, daño, coste o gasto (incluidos honorarios legales razonables) derivados de: (a) el contenido que publique en la plataforma, (b) su uso indebido del servicio, o (c) el incumplimiento de estos términos.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">16. Cesión</h2>
        <p>El usuario no podrá ceder ni transferir sus derechos u obligaciones bajo estos términos sin el consentimiento previo y por escrito de Click Tu Boda. Click Tu Boda podrá ceder estos términos en caso de fusión, adquisición o venta de activos, notificándolo al usuario.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">17. Fuerza mayor</h2>
        <p>Click Tu Boda no será responsable del incumplimiento de sus obligaciones cuando este sea consecuencia de eventos fuera de su control razonable, incluyendo, sin limitación: desastres naturales, interrupciones de servicios de terceros, cortes de energía, ataques informáticos, pandemias o acciones gubernamentales.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">18. Ley aplicable y jurisdicción</h2>
        <p>Estos términos se rigen por la legislación española. Para cualquier controversia serán competentes los juzgados y tribunales del domicilio del prestador.</p>
      </div>
    </div>
  </div>
);

export default Terms;
