import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Privacy = () => (
  <div className="min-h-screen bg-background py-16 px-4">
    <div className="container max-w-3xl">
      <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 text-sm">
        <ArrowLeft className="w-4 h-4" /> Volver
      </Link>
      <h1 className="font-heading text-4xl text-foreground mb-8">Política de Privacidad</h1>
      <div className="prose prose-neutral max-w-none text-foreground/80 font-light leading-relaxed space-y-6">
        <p><strong>Última actualización:</strong> {new Date().toLocaleDateString("es-ES")}</p>

        <h2 className="font-heading text-xl text-foreground mt-8">1. Responsable del tratamiento</h2>
        <p>José Luis Grau Perales (en adelante, "Click Tu Boda") es el responsable del tratamiento de los datos personales recogidos a través de esta web.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">2. Datos que recogemos</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Datos de cuenta:</strong> email y contraseña al registrarte.</li>
          <li><strong>Datos de boda:</strong> nombres, fechas, lugares, fotos y contenido que introduzcas.</li>
          <li><strong>RSVP de invitados:</strong> nombre, email (opcional), asistencia, notas de dieta.</li>
          <li><strong>Guestbook:</strong> nombre y mensaje de los firmantes.</li>
          <li><strong>Datos técnicos:</strong> dirección IP, tipo de navegador, cookies técnicas.</li>
        </ul>

        <h2 className="font-heading text-xl text-foreground mt-8">3. Finalidad del tratamiento</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Crear y gestionar tu página de boda.</li>
          <li>Permitir a tus invitados confirmar asistencia, subir fotos y firmar el guestbook.</li>
          <li>Procesar pagos y gestionar tu suscripción.</li>
          <li>Enviar comunicaciones relativas al servicio.</li>
          <li>Mejorar la seguridad y el rendimiento de la plataforma.</li>
        </ul>

        <h2 className="font-heading text-xl text-foreground mt-8">4. Base legal</h2>
        <p>El tratamiento se basa en: ejecución del contrato (prestación del servicio), interés legítimo (seguridad y mejora), consentimiento (cookies analíticas) y cumplimiento legal (obligaciones fiscales).</p>

        <h2 className="font-heading text-xl text-foreground mt-8">5. Compartición de datos</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Paddle.com</strong> — Actúa como Merchant of Record para el procesamiento de pagos, gestión de suscripciones, cumplimiento fiscal y facturación.</li>
          <li><strong>Proveedores de infraestructura:</strong> hosting y base de datos para prestar el servicio.</li>
          <li><strong>Autoridades:</strong> cuando sea requerido por ley.</li>
        </ul>

        <h2 className="font-heading text-xl text-foreground mt-8">6. Transferencias internacionales</h2>
        <p>Tus datos pueden ser procesados fuera del EEE por nuestros proveedores de infraestructura, con las garantías adecuadas (cláusulas contractuales tipo o decisiones de adecuación).</p>

        <h2 className="font-heading text-xl text-foreground mt-8">7. Conservación</h2>
        <p>Conservamos tus datos mientras mantengas tu cuenta activa. Tras la eliminación de la cuenta, los datos se eliminan en un plazo máximo de 30 días, salvo obligación legal.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">8. Tus derechos</h2>
        <p>Puedes ejercer tus derechos de acceso, rectificación, supresión, limitación, portabilidad y oposición escribiendo a <a href="mailto:hola@clicktuboda.com" className="text-primary hover:underline">hola@clicktuboda.com</a>. Responderemos en un plazo máximo de un mes. También puedes presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD).</p>

        <h2 className="font-heading text-xl text-foreground mt-8">9. Cookies</h2>
        <p>Utilizamos cookies técnicas esenciales para el funcionamiento del servicio. No utilizamos cookies de seguimiento o publicitarias de terceros.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">10. Seguridad</h2>
        <p>Aplicamos medidas técnicas y organizativas adecuadas, incluyendo cifrado en tránsito (TLS), control de acceso y políticas de seguridad a nivel de base de datos.</p>
      </div>
    </div>
  </div>
);

export default Privacy;
