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
        <p>José Luis Grau Perales (en adelante, "Click Tu Boda") es el responsable del tratamiento (controlador de datos) de los datos personales recogidos a través de esta web.</p>
        <p>Email de contacto para cuestiones de privacidad: <a href="mailto:joseluisitograu@gmail.com" className="text-primary hover:underline">joseluisitograu@gmail.com</a></p>

        <h2 className="font-heading text-xl text-foreground mt-8">2. Datos que recogemos</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Datos de cuenta:</strong> email y contraseña al registrarte.</li>
          <li><strong>Datos de boda:</strong> nombres, fechas, lugares, fotos y contenido que introduzcas.</li>
          <li><strong>RSVP de invitados:</strong> nombre, email (opcional), asistencia, notas de dieta.</li>
          <li><strong>Guestbook:</strong> nombre y mensaje de los firmantes.</li>
          <li><strong>Datos técnicos:</strong> dirección IP, tipo de navegador, identificadores de dispositivo, cookies técnicas.</li>
        </ul>

        <h2 className="font-heading text-xl text-foreground mt-8">3. Finalidad del tratamiento</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Crear y gestionar tu página de boda (ejecución del contrato).</li>
          <li>Permitir a tus invitados confirmar asistencia, subir fotos y firmar el guestbook (ejecución del contrato).</li>
          <li>Procesar pagos y gestionar tu compra (ejecución del contrato).</li>
          <li>Enviar comunicaciones relativas al servicio (interés legítimo).</li>
          <li>Mejorar la seguridad y el rendimiento de la plataforma (interés legítimo).</li>
          <li>Análisis de uso agregado mediante cookies analíticas (consentimiento).</li>
          <li>Cumplir obligaciones fiscales y legales (cumplimiento legal).</li>
        </ul>

        <h2 className="font-heading text-xl text-foreground mt-8">4. Base legal</h2>
        <p>El tratamiento se basa en: ejecución del contrato (prestación del servicio), interés legítimo (seguridad y mejora), consentimiento (cookies analíticas) y cumplimiento legal (obligaciones fiscales).</p>

        <h2 className="font-heading text-xl text-foreground mt-8">5. Compartición de datos</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Paddle.com</strong> — Actúa como Merchant of Record para la venta del producto, procesamiento de pagos, gestión de compras, cumplimiento fiscal y facturación.</li>
          <li><strong>Proveedores de infraestructura:</strong> hosting y base de datos para prestar el servicio (subencargados del tratamiento).</li>
          <li><strong>Asesores profesionales:</strong> asesoría legal y contable cuando sea necesario.</li>
          <li><strong>Autoridades:</strong> cuando sea requerido por ley.</li>
        </ul>

        <h2 className="font-heading text-xl text-foreground mt-8">6. Transferencias internacionales</h2>
        <p>Tus datos pueden ser procesados fuera del EEE por nuestros proveedores de infraestructura, con las garantías adecuadas (cláusulas contractuales tipo o decisiones de adecuación).</p>

        <h2 className="font-heading text-xl text-foreground mt-8">7. Conservación</h2>
        <p>Conservamos tus datos mientras mantengas tu cuenta activa. Tras la eliminación de la cuenta, los datos se eliminan o anonimizan en un plazo máximo de 30 días, salvo obligación legal de conservación.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">8. Tus derechos</h2>
        <p>Como usuario, tienes derecho a:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Acceso:</strong> obtener una copia de tus datos personales.</li>
          <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
          <li><strong>Supresión:</strong> solicitar la eliminación de tus datos.</li>
          <li><strong>Limitación:</strong> restringir el tratamiento en determinadas circunstancias.</li>
          <li><strong>Portabilidad:</strong> recibir tus datos en un formato estructurado y legible por máquina.</li>
          <li><strong>Oposición:</strong> oponerte al tratamiento basado en interés legítimo.</li>
          <li><strong>Retirada del consentimiento:</strong> retirar tu consentimiento en cualquier momento sin que afecte a la licitud del tratamiento previo.</li>
        </ul>
        <p>Para ejercer estos derechos, puedes escribirnos a <a href="mailto:joseluisitograu@gmail.com" className="text-primary hover:underline">joseluisitograu@gmail.com</a> o utilizar el formulario de contacto disponible en nuestra web. Responderemos en un plazo máximo de un mes.</p>
        <p>También puedes presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) en <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.aepd.es</a>.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">9. Cookies</h2>
        <p>Utilizamos cookies para el funcionamiento del servicio y, con tu consentimiento, para analítica. Puedes consultar el detalle completo en nuestra <Link to="/cookies" className="text-primary hover:underline">Política de Cookies</Link>.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-medium text-foreground">Cookie</th>
                <th className="text-left p-3 font-medium text-foreground">Tipo</th>
                <th className="text-left p-3 font-medium text-foreground">Finalidad</th>
                <th className="text-left p-3 font-medium text-foreground">Duración</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-3">sb-*</td>
                <td className="p-3">Esencial</td>
                <td className="p-3">Sesión de autenticación</td>
                <td className="p-3">1 año</td>
              </tr>
              <tr>
                <td className="p-3">ctb_cookie_consent</td>
                <td className="p-3">Esencial</td>
                <td className="p-3">Preferencia de cookies</td>
                <td className="p-3">Persistente</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="font-heading text-xl text-foreground mt-8">10. Menores</h2>
        <p>El servicio no está dirigido a menores de 16 años. No recopilamos intencionadamente datos de menores de 16 años. Si tienes conocimiento de que un menor nos ha proporcionado datos personales, contacta con nosotros para su eliminación.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">11. Seguridad</h2>
        <p>Aplicamos medidas técnicas y organizativas adecuadas, incluyendo cifrado en tránsito (TLS), control de acceso y políticas de seguridad a nivel de base de datos.</p>
      </div>
    </div>
  </div>
);

export default Privacy;
