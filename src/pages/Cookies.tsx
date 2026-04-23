import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Cookies = () => (
  <div className="min-h-screen bg-background py-16 px-4">
    <div className="container max-w-3xl">
      <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 text-sm">
        <ArrowLeft className="w-4 h-4" /> Volver
      </Link>
      <h1 className="font-heading text-4xl text-foreground mb-8">Política de Cookies</h1>
      <div className="prose prose-neutral max-w-none text-foreground/80 font-light leading-relaxed space-y-6">
        <p><strong>Última actualización:</strong> {new Date().toLocaleDateString("es-ES")}</p>

        <h2 className="font-heading text-xl text-foreground mt-8">1. ¿Qué son las cookies?</h2>
        <p>Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo (ordenador, móvil o tablet) cuando los visitas. Se utilizan para recordar tus preferencias, mantener tu sesión iniciada y, en algunos casos, analizar el uso del sitio.</p>
        <p>Además de las cookies, también utilizamos tecnologías similares como el almacenamiento local del navegador (localStorage), que cumple funciones equivalentes.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">2. ¿Quién es el responsable?</h2>
        <p>El responsable del uso de cookies en este sitio web es José Luis Grau Perales ("Click Tu Boda"). Para más información, consulta nuestra <Link to="/privacidad" className="text-primary hover:underline">Política de Privacidad</Link>.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">3. ¿Qué cookies utilizamos?</h2>

        <h3 className="font-heading text-lg text-foreground mt-6">3.1 Cookies esenciales (técnicas)</h3>
        <p>Son estrictamente necesarias para el funcionamiento básico del sitio web. No requieren consentimiento y no pueden desactivarse sin afectar al servicio.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-medium text-foreground">Nombre</th>
                <th className="text-left p-3 font-medium text-foreground">Tipo</th>
                <th className="text-left p-3 font-medium text-foreground">Proveedor</th>
                <th className="text-left p-3 font-medium text-foreground">Finalidad</th>
                <th className="text-left p-3 font-medium text-foreground">Duración</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-3 font-mono text-xs">sb-*-auth-token</td>
                <td className="p-3">Cookie</td>
                <td className="p-3">Infraestructura de autenticación</td>
                <td className="p-3">Mantener la sesión del usuario iniciada de forma segura. Contiene un token cifrado que identifica la sesión.</td>
                <td className="p-3">1 año</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">ctb_cookie_consent</td>
                <td className="p-3">localStorage</td>
                <td className="p-3">Click Tu Boda</td>
                <td className="p-3">Recordar la elección del usuario sobre el uso de cookies (aceptar todas o solo esenciales).</td>
                <td className="p-3">Persistente (hasta que el usuario lo elimine)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-heading text-lg text-foreground mt-6">3.2 Cookies analíticas (opcionales)</h3>
        <p>Solo se activan si el usuario acepta "todas las cookies" en el banner de cookies. Nos ayudan a entender cómo se usa el sitio para mejorarlo.</p>
        <p className="text-sm text-muted-foreground italic">Actualmente no utilizamos cookies analíticas de terceros. Si en el futuro las implementamos, esta sección se actualizará con el detalle de cada cookie antes de su activación, y solo se instalarán tras obtener tu consentimiento.</p>

        <h3 className="font-heading text-lg text-foreground mt-6">3.3 Cookies de terceros</h3>
        <p>Durante el proceso de pago, Paddle.com (nuestro Merchant of Record) puede establecer sus propias cookies necesarias para procesar la transacción de forma segura. Estas cookies están sujetas a la <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Política de Privacidad de Paddle</a> y no están bajo nuestro control directo.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">4. Base legal para el uso de cookies</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Cookies esenciales:</strong> su uso se basa en el interés legítimo del responsable y la necesidad técnica para prestar el servicio solicitado (art. 6.1.f RGPD, art. 22.2 LSSI).</li>
          <li><strong>Cookies analíticas:</strong> su uso se basa en el consentimiento del usuario (art. 6.1.a RGPD, art. 22.1 LSSI), obtenido a través del banner de cookies.</li>
        </ul>

        <h2 className="font-heading text-xl text-foreground mt-8">5. ¿Cómo gestionar las cookies?</h2>
        <p>Puedes gestionar tus preferencias de cookies de las siguientes formas:</p>

        <h3 className="font-heading text-lg text-foreground mt-6">5.1 Banner de cookies</h3>
        <p>Al visitar el sitio por primera vez, se muestra un banner que te permite:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Aceptar todas:</strong> se activarán las cookies esenciales y analíticas.</li>
          <li><strong>Solo esenciales:</strong> solo se utilizarán las cookies estrictamente necesarias.</li>
        </ul>
        <p>Tu elección se guarda y no se volverá a mostrar el banner en visitas posteriores, salvo que borres tus datos de navegación.</p>

        <h3 className="font-heading text-lg text-foreground mt-6">5.2 Configuración del navegador</h3>
        <p>Puedes configurar tu navegador para bloquear, eliminar o recibir un aviso cuando se instalen cookies. Ten en cuenta que desactivar las cookies esenciales puede afectar al funcionamiento del sitio (por ejemplo, no podrás mantener tu sesión iniciada).</p>
        <p>Instrucciones por navegador:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mozilla Firefox</a></li>
          <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Safari</a></li>
          <li><a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft Edge</a></li>
        </ul>

        <h3 className="font-heading text-lg text-foreground mt-6">5.3 Revocar el consentimiento</h3>
        <p>Si deseas cambiar tu elección sobre las cookies, puedes borrar los datos del sitio en la configuración de tu navegador. La próxima vez que visites la web se mostrará de nuevo el banner de cookies.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">6. Actualizaciones de esta política</h2>
        <p>Podemos actualizar esta Política de Cookies para reflejar cambios en las cookies que utilizamos o por motivos legales. Te recomendamos revisarla periódicamente. La fecha de "última actualización" en la parte superior indica la última revisión.</p>
        <p>Si añadimos nuevas cookies no esenciales, solicitaremos tu consentimiento antes de activarlas.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">7. Más información</h2>
        <p>Para más información sobre cómo tratamos tus datos personales, consulta nuestra <Link to="/privacidad" className="text-primary hover:underline">Política de Privacidad</Link>.</p>
        <p>Si tienes cualquier pregunta sobre el uso de cookies, puedes escribirnos a <a href="mailto:joseluisitograu@gmail.com" className="text-primary hover:underline">joseluisitograu@gmail.com</a>.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">8. Documentos relacionados</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><Link to="/privacidad" className="text-primary hover:underline">Política de Privacidad</Link></li>
          <li><Link to="/terminos" className="text-primary hover:underline">Términos y Condiciones</Link></li>
          <li><Link to="/reembolso" className="text-primary hover:underline">Política de Reembolso</Link></li>
        </ul>
      </div>
    </div>
  </div>
);

export default Cookies;
