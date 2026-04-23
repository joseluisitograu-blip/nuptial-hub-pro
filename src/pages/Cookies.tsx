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

        <h2 className="font-heading text-xl text-foreground mt-8">¿Qué son las cookies?</h2>
        <p>Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo (ordenador, móvil o tablet) cuando los visitas. Se utilizan para recordar tus preferencias, mantener tu sesión iniciada y, en algunos casos, analizar el uso del sitio.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">¿Qué cookies utilizamos?</h2>

        <h3 className="font-heading text-lg text-foreground mt-6">Cookies esenciales</h3>
        <p>Son necesarias para el funcionamiento básico del sitio web. No pueden desactivarse.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-medium text-foreground">Nombre</th>
                <th className="text-left p-3 font-medium text-foreground">Finalidad</th>
                <th className="text-left p-3 font-medium text-foreground">Duración</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-3">sb-*-auth-token</td>
                <td className="p-3">Mantener la sesión de usuario iniciada de forma segura.</td>
                <td className="p-3">1 año</td>
              </tr>
              <tr>
                <td className="p-3">ctb_cookie_consent</td>
                <td className="p-3">Recordar tu elección sobre el uso de cookies.</td>
                <td className="p-3">Persistente</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-heading text-lg text-foreground mt-6">Cookies analíticas (opcionales)</h3>
        <p>Solo se activan si aceptas "todas las cookies" en el banner. Nos ayudan a entender cómo se usa el sitio para mejorarlo.</p>
        <p className="text-sm text-muted-foreground">Actualmente no utilizamos cookies analíticas de terceros. Si en el futuro las implementamos, esta sección se actualizará con el detalle de cada cookie.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">¿Cómo gestionar las cookies?</h2>
        <p>Puedes gestionar tus preferencias de cookies de las siguientes formas:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Banner de cookies:</strong> Al visitar el sitio por primera vez, puedes aceptar todas las cookies o solo las esenciales.</li>
          <li><strong>Configuración del navegador:</strong> Puedes configurar tu navegador para bloquear o eliminar cookies. Ten en cuenta que esto puede afectar al funcionamiento del sitio.</li>
        </ul>
        <p>Instrucciones por navegador:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mozilla Firefox</a></li>
          <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Safari</a></li>
          <li><a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft Edge</a></li>
        </ul>

        <h2 className="font-heading text-xl text-foreground mt-8">Más información</h2>
        <p>Para más información sobre cómo tratamos tus datos personales, consulta nuestra <Link to="/privacidad" className="text-primary hover:underline">Política de Privacidad</Link>.</p>
        <p>Si tienes cualquier pregunta, puedes escribirnos a <a href="mailto:joseluisitograu@gmail.com" className="text-primary hover:underline">joseluisitograu@gmail.com</a>.</p>
      </div>
    </div>
  </div>
);

export default Cookies;
