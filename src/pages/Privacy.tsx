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
        <p>José Luis Grau Perales (en adelante, "BodasFacil") es el responsable del tratamiento (controlador de datos) de los datos personales recogidos a través del sitio web bodasfacil.com y sus subdominios.</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Denominación:</strong> José Luis Grau Perales.</li>
          <li><strong>Email de contacto:</strong> <a href="mailto:soporte@bodasfacil.com" className="text-primary hover:underline">soporte@bodasfacil.com</a></li>
          <li><strong>Sitio web:</strong> <a href="https://bodasfacil.com" className="text-primary hover:underline">bodasfacil.com</a></li>
        </ul>

        <h2 className="font-heading text-xl text-foreground mt-8">2. Datos que recogemos</h2>
        <p>Recogemos las siguientes categorías de datos personales:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-medium text-foreground">Categoría</th>
                <th className="text-left p-3 font-medium text-foreground">Datos</th>
                <th className="text-left p-3 font-medium text-foreground">Fuente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-3">Datos de cuenta</td>
                <td className="p-3">Email, contraseña (cifrada)</td>
                <td className="p-3">Facilitado por el usuario al registrarse</td>
              </tr>
              <tr>
                <td className="p-3">Datos de boda</td>
                <td className="p-3">Nombres de la pareja, fecha, lugares, fotos, tema visual, contenido personalizado</td>
                <td className="p-3">Facilitado por el usuario</td>
              </tr>
              <tr>
                <td className="p-3">RSVP de invitados</td>
                <td className="p-3">Nombre, email (opcional), asistencia, número de acompañantes, notas de dieta, mensajes</td>
                <td className="p-3">Facilitado por los invitados</td>
              </tr>
              <tr>
                <td className="p-3">Guestbook</td>
                <td className="p-3">Nombre del autor, mensaje, audio (opcional)</td>
                <td className="p-3">Facilitado por los invitados</td>
              </tr>
              <tr>
                <td className="p-3">Playlist</td>
                <td className="p-3">Nombre del sugeridor, canción propuesta</td>
                <td className="p-3">Facilitado por los invitados</td>
              </tr>
              <tr>
                <td className="p-3">Fotos del evento</td>
                <td className="p-3">Fotografías, nombre del subidor, pie de foto</td>
                <td className="p-3">Facilitado por los invitados</td>
              </tr>
              <tr>
                <td className="p-3">Datos de pago</td>
                <td className="p-3">Gestionados íntegramente por Paddle.com (Merchant of Record). Click Tu Boda no almacena datos de tarjeta ni datos financieros.</td>
                <td className="p-3">Paddle.com</td>
              </tr>
              <tr>
                <td className="p-3">Datos técnicos</td>
                <td className="p-3">Dirección IP, tipo de navegador, sistema operativo, identificadores de dispositivo, páginas visitadas, fecha y hora de acceso</td>
                <td className="p-3">Recogida automática</td>
              </tr>
              <tr>
                <td className="p-3">Mensajes de contacto</td>
                <td className="p-3">Nombre, email, asunto, contenido del mensaje</td>
                <td className="p-3">Facilitado por el usuario a través del formulario de contacto</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="font-heading text-xl text-foreground mt-8">3. Finalidad del tratamiento y base legal</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-medium text-foreground">Finalidad</th>
                <th className="text-left p-3 font-medium text-foreground">Base legal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-3">Crear y gestionar tu cuenta y tu página de boda</td>
                <td className="p-3">Ejecución del contrato (art. 6.1.b RGPD)</td>
              </tr>
              <tr>
                <td className="p-3">Permitir a los invitados confirmar asistencia (RSVP), subir fotos, firmar el guestbook y sugerir canciones</td>
                <td className="p-3">Ejecución del contrato / Interés legítimo (art. 6.1.b/f RGPD)</td>
              </tr>
              <tr>
                <td className="p-3">Procesar pagos y gestionar tu compra</td>
                <td className="p-3">Ejecución del contrato (art. 6.1.b RGPD)</td>
              </tr>
              <tr>
                <td className="p-3">Enviar comunicaciones relativas al servicio (confirmaciones, notificaciones de cambios)</td>
                <td className="p-3">Interés legítimo (art. 6.1.f RGPD)</td>
              </tr>
              <tr>
                <td className="p-3">Responder a mensajes de contacto y solicitudes de soporte</td>
                <td className="p-3">Interés legítimo (art. 6.1.f RGPD)</td>
              </tr>
              <tr>
                <td className="p-3">Mejorar la seguridad, prevenir fraude y mantener el rendimiento de la plataforma</td>
                <td className="p-3">Interés legítimo (art. 6.1.f RGPD)</td>
              </tr>
              <tr>
                <td className="p-3">Análisis de uso agregado mediante cookies analíticas</td>
                <td className="p-3">Consentimiento (art. 6.1.a RGPD)</td>
              </tr>
              <tr>
                <td className="p-3">Cumplir obligaciones fiscales, contables y legales</td>
                <td className="p-3">Cumplimiento legal (art. 6.1.c RGPD)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="font-heading text-xl text-foreground mt-8">4. Compartición de datos</h2>
        <p>Tus datos personales pueden ser compartidos con las siguientes categorías de destinatarios:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Paddle.com</strong> — Actúa como Merchant of Record para la venta del producto, procesamiento de pagos, gestión de compras, cumplimiento fiscal y facturación. Paddle es un controlador de datos independiente para los datos de pago. Consulta la <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Política de Privacidad de Paddle</a>.</li>
          <li><strong>Proveedores de infraestructura (subencargados):</strong> servicios de hosting, base de datos y almacenamiento de archivos necesarios para prestar el servicio.</li>
          <li><strong>Asesores profesionales:</strong> asesoría legal y contable cuando sea necesario para el funcionamiento del negocio.</li>
          <li><strong>Autoridades públicas:</strong> cuando sea requerido por ley, orden judicial o procedimiento legal.</li>
        </ul>
        <p>No vendemos, alquilamos ni compartimos tus datos personales con terceros con fines de marketing.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">5. Transferencias internacionales</h2>
        <p>Tus datos pueden ser procesados fuera del Espacio Económico Europeo (EEE) por nuestros proveedores de infraestructura. En tales casos, nos aseguramos de que existan las garantías adecuadas, incluyendo:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Cláusulas contractuales tipo aprobadas por la Comisión Europea.</li>
          <li>Decisiones de adecuación de la Comisión Europea.</li>
          <li>Otros mecanismos reconocidos por la normativa de protección de datos aplicable.</li>
        </ul>

        <h2 className="font-heading text-xl text-foreground mt-8">6. Conservación de datos</h2>
        <p>Conservamos tus datos personales durante los siguientes períodos:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Datos de cuenta y boda:</strong> mientras mantengas tu cuenta activa. Tras la eliminación de la cuenta, los datos se eliminan o anonimizan en un plazo máximo de 30 días.</li>
          <li><strong>Datos de invitados (RSVP, guestbook, fotos, playlist):</strong> mientras la página de boda esté activa. Se eliminan junto con la cuenta del organizador.</li>
          <li><strong>Datos de facturación:</strong> conservados por Paddle conforme a su política de retención y obligaciones fiscales.</li>
          <li><strong>Mensajes de contacto:</strong> conservados durante un máximo de 2 años desde su recepción.</li>
          <li><strong>Datos técnicos (logs):</strong> conservados durante un máximo de 90 días.</li>
          <li><strong>Obligaciones legales:</strong> cuando la ley exija conservar ciertos datos durante un período determinado, se mantendrán bloqueados durante el tiempo legalmente requerido.</li>
        </ul>

        <h2 className="font-heading text-xl text-foreground mt-8">7. Tus derechos</h2>
        <p>Conforme al Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica de Protección de Datos (LOPDGDD), tienes derecho a:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Acceso:</strong> obtener confirmación de si tratamos tus datos y una copia de los mismos.</li>
          <li><strong>Rectificación:</strong> corregir datos inexactos o completar datos incompletos.</li>
          <li><strong>Supresión ("derecho al olvido"):</strong> solicitar la eliminación de tus datos cuando ya no sean necesarios para la finalidad para la que fueron recogidos.</li>
          <li><strong>Limitación:</strong> solicitar la restricción del tratamiento en determinadas circunstancias (por ejemplo, mientras se verifica la exactitud de los datos).</li>
          <li><strong>Portabilidad:</strong> recibir tus datos en un formato estructurado, de uso común y legible por máquina, y transmitirlos a otro responsable.</li>
          <li><strong>Oposición:</strong> oponerte al tratamiento de tus datos basado en interés legítimo, por motivos relacionados con tu situación particular.</li>
          <li><strong>Retirada del consentimiento:</strong> retirar tu consentimiento en cualquier momento, sin que afecte a la licitud del tratamiento previo basado en dicho consentimiento.</li>
          <li><strong>No ser objeto de decisiones automatizadas:</strong> no tomar decisiones basadas únicamente en el tratamiento automatizado de tus datos que produzcan efectos jurídicos o te afecten significativamente.</li>
        </ul>
        <p><strong>Cómo ejercer tus derechos:</strong> Puedes escribirnos a <a href="mailto:joseluisitograu@gmail.com" className="text-primary hover:underline">joseluisitograu@gmail.com</a> o utilizar el formulario de contacto disponible en nuestra web. Te responderemos en un plazo máximo de un mes desde la recepción de tu solicitud. Este plazo podrá prorrogarse dos meses adicionales en caso de solicitudes complejas o numerosas, informándote de ello.</p>
        <p>Para ejercer tus derechos, podremos solicitarte información adicional para verificar tu identidad.</p>
        <p><strong>Reclamación ante la autoridad de control:</strong> Si consideras que el tratamiento de tus datos no se ajusta a la normativa vigente, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) en <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.aepd.es</a>.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">8. Decisiones automatizadas</h2>
        <p>Click Tu Boda no realiza decisiones basadas únicamente en el tratamiento automatizado de datos, incluyendo la elaboración de perfiles, que produzcan efectos jurídicos sobre el usuario o le afecten significativamente de modo similar.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">9. Cookies y tecnologías similares</h2>
        <p>Utilizamos cookies y almacenamiento local del navegador (localStorage) para el funcionamiento del servicio y, con tu consentimiento, para analítica. Puedes consultar el detalle completo en nuestra <Link to="/cookies" className="text-primary hover:underline">Política de Cookies</Link>.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-medium text-foreground">Cookie / Storage</th>
                <th className="text-left p-3 font-medium text-foreground">Tipo</th>
                <th className="text-left p-3 font-medium text-foreground">Finalidad</th>
                <th className="text-left p-3 font-medium text-foreground">Duración</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-3">sb-*-auth-token</td>
                <td className="p-3">Esencial (cookie)</td>
                <td className="p-3">Sesión de autenticación segura</td>
                <td className="p-3">1 año</td>
              </tr>
              <tr>
                <td className="p-3">ctb_cookie_consent</td>
                <td className="p-3">Esencial (localStorage)</td>
                <td className="p-3">Recordar la preferencia de cookies del usuario</td>
                <td className="p-3">Persistente</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="font-heading text-xl text-foreground mt-8">10. Menores</h2>
        <p>El servicio no está dirigido a menores de 16 años. No recopilamos intencionadamente datos personales de menores de 16 años. Si eres padre, madre o tutor legal y tienes conocimiento de que un menor bajo tu responsabilidad nos ha proporcionado datos personales sin tu consentimiento, contacta con nosotros a <a href="mailto:joseluisitograu@gmail.com" className="text-primary hover:underline">joseluisitograu@gmail.com</a> para su eliminación inmediata.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">11. Seguridad</h2>
        <p>Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos personales contra el acceso no autorizado, la pérdida, destrucción o alteración, incluyendo:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Cifrado en tránsito mediante TLS/SSL.</li>
          <li>Cifrado de contraseñas con algoritmos de hash seguros.</li>
          <li>Control de acceso basado en roles a nivel de base de datos (RLS).</li>
          <li>Políticas de seguridad a nivel de fila para aislar los datos de cada usuario.</li>
          <li>Copias de seguridad periódicas.</li>
          <li>Monitorización y auditoría de accesos.</li>
        </ul>
        <p>Ningún sistema es completamente seguro. Si detectas una vulnerabilidad de seguridad, te rogamos que nos la comuniques de forma responsable a <a href="mailto:joseluisitograu@gmail.com" className="text-primary hover:underline">joseluisitograu@gmail.com</a>.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">12. Modificaciones de esta política</h2>
        <p>Podemos actualizar esta Política de Privacidad periódicamente. Te notificaremos los cambios significativos por email o mediante un aviso visible en la plataforma. La fecha de "última actualización" en la parte superior de esta página indica cuándo se realizó la última revisión.</p>
        <p>Te recomendamos revisar esta política periódicamente para estar informado sobre cómo protegemos tus datos.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">13. Documentos relacionados</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><Link to="/terminos" className="text-primary hover:underline">Términos y Condiciones</Link></li>
          <li><Link to="/cookies" className="text-primary hover:underline">Política de Cookies</Link></li>
          <li><Link to="/reembolso" className="text-primary hover:underline">Política de Reembolso</Link></li>
          <li><a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Política de Privacidad de Paddle</a></li>
        </ul>
      </div>
    </div>
  </div>
);

export default Privacy;
