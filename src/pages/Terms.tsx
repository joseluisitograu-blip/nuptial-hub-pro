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
        <p>Email de contacto: <a href="mailto:joseluisitograu@gmail.com" className="text-primary hover:underline">joseluisitograu@gmail.com</a></p>

        <h2 className="font-heading text-xl text-foreground mt-8">2. Aceptación y autoridad</h2>
        <p>El uso continuado del servicio implica la aceptación plena de estos términos. Si no estás de acuerdo, no utilices el servicio.</p>
        <p>Al aceptar estos términos, declaras que eres mayor de 18 años o que tienes la autoridad legal necesaria para vincularte a estos términos. Si actúas en nombre de una organización, declaras tener autoridad para obligar a dicha organización.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">3. Descripción del servicio</h2>
        <p>Click Tu Boda es una plataforma que permite crear páginas web personalizadas para bodas, incluyendo funcionalidades como:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Página de boda con diseño personalizable y múltiples temas visuales.</li>
          <li>RSVP online con gestión de invitados, acompañantes y notas de dieta.</li>
          <li>Playlist colaborativa donde los invitados sugieren y votan canciones.</li>
          <li>Muro de fotos en vivo para compartir recuerdos del evento.</li>
          <li>Agenda del día, mapas con ubicación, plan de mesas y FAQ.</li>
          <li>Guestbook digital, historia de la pareja y lista de regalos.</li>
          <li>Compartición por QR y WhatsApp.</li>
          <li>Panel de control con estadísticas, checklist, presupuesto y regalos (según plan contratado).</li>
        </ul>

        <h2 className="font-heading text-xl text-foreground mt-8">4. Registro, credenciales y veracidad de datos</h2>
        <p>Debes proporcionar información veraz y actualizada al registrarte. Eres responsable de mantener la confidencialidad de tus credenciales de acceso y de toda actividad que se realice bajo tu cuenta. Debes notificarnos de inmediato cualquier uso no autorizado de tu cuenta.</p>
        <p>Te comprometes a mantener tus datos actualizados. Click Tu Boda no se hace responsable de los perjuicios derivados de información inexacta o desactualizada proporcionada por el usuario.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">5. Uso aceptable</h2>
        <p>No está permitido:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Usar el servicio con fines ilícitos, fraudulentos o de spam.</li>
          <li>Infringir derechos de propiedad intelectual de terceros.</li>
          <li>Interferir con la seguridad del servicio (malware, scraping, acceso no autorizado, ingeniería inversa).</li>
          <li>Subir contenido ilegal, ofensivo, difamatorio o que viole derechos de terceros.</li>
          <li>Revender, redistribuir o sublicenciar el acceso al servicio.</li>
          <li>Intentar eludir las limitaciones técnicas del servicio o acceder a funcionalidades no incluidas en tu plan.</li>
          <li>Utilizar el servicio para enviar comunicaciones comerciales no solicitadas a los invitados.</li>
        </ul>

        <h2 className="font-heading text-xl text-foreground mt-8">6. Propiedad intelectual</h2>
        <p>Click Tu Boda es titular de todos los derechos de propiedad intelectual e industrial sobre el software, diseño, código fuente, documentación, marca, logotipos y demás elementos del servicio. Ninguna parte de estos términos te otorga derechos sobre la propiedad intelectual del servicio más allá de la licencia limitada descrita a continuación.</p>
        <p>Todas las marcas, nombres comerciales, logotipos y signos distintivos son propiedad de Click Tu Boda o de sus respectivos titulares, y su uso no autorizado queda prohibido.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">7. Licencia de uso</h2>
        <p>Te otorgamos una licencia limitada, no exclusiva, no transferible, no sublicenciable y revocable para usar el servicio dentro del plan contratado y exclusivamente para su finalidad prevista (la creación y gestión de una página web de boda). No está permitido:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Revender, redistribuir o sublicenciar el acceso.</li>
          <li>Aplicar ingeniería inversa, descompilar o desensamblar el software.</li>
          <li>Eludir las limitaciones técnicas o de funcionalidad.</li>
          <li>Utilizar el servicio para fines distintos a los previstos.</li>
        </ul>

        <h2 className="font-heading text-xl text-foreground mt-8">8. Contenido del usuario</h2>
        <p>Conservas la titularidad de todo el contenido que subas o introduzcas en la plataforma (textos, fotografías, datos de invitados, mensajes del guestbook, etc.). Al utilizar el servicio, otorgas a Click Tu Boda una licencia limitada, no exclusiva, mundial y revocable para alojar, procesar, almacenar en caché y mostrar dicho contenido exclusivamente con el fin de prestar el servicio contratado. Esta licencia se extingue cuando elimines tu contenido o tu cuenta.</p>
        <p>Eres el único responsable de que tu contenido no infrinja derechos de terceros ni vulnere la legislación aplicable. Click Tu Boda se reserva el derecho de eliminar contenido que vulnere estos términos o la legislación vigente, previa notificación al usuario cuando sea posible.</p>
        <p>Declaras que cuentas con los permisos y consentimientos necesarios para subir contenido que incluya datos personales de terceros (como fotos de invitados o datos de RSVP), y que has informado a dichos terceros sobre el tratamiento de sus datos conforme a nuestra <Link to="/privacidad" className="text-primary hover:underline">Política de Privacidad</Link>.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">9. Protección de datos de invitados</h2>
        <p>El usuario que crea una página de boda actúa como responsable del tratamiento de los datos personales de sus invitados (nombres, emails, confirmaciones de asistencia, notas de dieta, mensajes del guestbook y fotos). Click Tu Boda actúa como encargado del tratamiento de dichos datos, procesándolos exclusivamente para prestar el servicio.</p>
        <p>El usuario se compromete a informar a sus invitados sobre el tratamiento de sus datos y a obtener los consentimientos necesarios conforme a la normativa de protección de datos aplicable.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">10. Pagos</h2>
        <p>Nuestro proceso de pago es gestionado por nuestro revendedor online <strong>Paddle.com</strong>. Paddle.com es el Merchant of Record de todos nuestros pedidos. Paddle proporciona toda la atención al cliente relativa a pagos y gestiona las devoluciones.</p>
        <p>Click Tu Boda ofrece planes de pago único (no suscripciones recurrentes). Una vez realizado el pago, obtienes acceso a las funcionalidades del plan contratado sin cargos adicionales ni renovaciones automáticas.</p>
        <p>Para más detalles sobre facturación, impuestos, cancelaciones y reembolsos, consulta los <a href="https://www.paddle.com/legal/checkout-buyer-terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Términos del Comprador de Paddle</a> y nuestra <Link to="/reembolso" className="text-primary hover:underline">Política de Reembolso</Link>.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">11. Disponibilidad del servicio</h2>
        <p>No garantizamos que el servicio funcione de manera ininterrumpida o libre de errores. Nos esforzamos por mantener una alta disponibilidad, pero pueden producirse interrupciones por mantenimiento programado, actualizaciones o causas ajenas a nuestro control.</p>
        <p>Cuando sea posible, notificaremos previamente las interrupciones planificadas. Click Tu Boda no será responsable de las pérdidas derivadas de la indisponibilidad temporal del servicio.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">12. Exención de garantías</h2>
        <p>El servicio se proporciona "tal cual" y "según disponibilidad". En la medida máxima permitida por la legislación aplicable, Click Tu Boda excluye todas las garantías implícitas, incluyendo, sin limitación, las de comerciabilidad, idoneidad para un fin particular, no infracción y calidad satisfactoria.</p>
        <p>En particular, no garantizamos que: (a) el servicio cumpla con tus requisitos específicos; (b) el servicio sea continuo, puntual, seguro o libre de errores; (c) los resultados obtenidos sean precisos o fiables.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">13. Suspensión y terminación</h2>
        <p>Podemos suspender o cancelar el acceso al servicio, con o sin previo aviso, en caso de:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Incumplimiento material de estos términos.</li>
          <li>Impago del servicio contratado.</li>
          <li>Riesgo de seguridad, fraude o actividad sospechosa en la cuenta.</li>
          <li>Violaciones reiteradas o graves de las políticas de uso.</li>
          <li>Requerimiento legal o regulatorio.</li>
        </ul>
        <p>El usuario puede cancelar su cuenta en cualquier momento contactando con nosotros en <a href="mailto:joseluisitograu@gmail.com" className="text-primary hover:underline">joseluisitograu@gmail.com</a>.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">14. Consecuencias de la terminación</h2>
        <p>Tras la cancelación de tu cuenta (ya sea por el usuario o por Click Tu Boda):</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Dispondrás de un plazo de 30 días para solicitar la exportación de tus datos.</li>
          <li>Tu página de boda dejará de ser accesible públicamente de forma inmediata.</li>
          <li>Transcurridos los 30 días, tus datos serán eliminados de forma definitiva de nuestros sistemas.</li>
          <li>No se realizarán reembolsos por períodos ya iniciados, salvo lo previsto en nuestra <Link to="/reembolso" className="text-primary hover:underline">Política de Reembolso</Link>.</li>
        </ul>
        <p>Las cláusulas que por su naturaleza deban sobrevivir a la terminación (propiedad intelectual, limitación de responsabilidad, indemnización, ley aplicable) seguirán vigentes.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">15. Limitación de responsabilidad</h2>
        <p>En la medida permitida por ley, Click Tu Boda no será responsable de daños indirectos, consecuenciales, especiales, incidentales o punitivos, incluyendo, sin limitación: pérdida de beneficios, datos, oportunidades de negocio, reputación o ahorros esperados.</p>
        <p>La responsabilidad total acumulada de Click Tu Boda bajo estos términos se limita a las cantidades efectivamente pagadas por el usuario en los últimos 12 meses.</p>
        <p>Nada en estos términos excluye o limita la responsabilidad por: (a) fallecimiento o lesiones personales causadas por negligencia; (b) fraude o declaración fraudulenta; (c) cualquier responsabilidad que no pueda limitarse o excluirse conforme a la legislación aplicable.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">16. Indemnización</h2>
        <p>El usuario se compromete a indemnizar, defender y mantener indemne a Click Tu Boda, sus directivos, empleados y agentes frente a cualquier reclamación, daño, pérdida, coste o gasto (incluidos honorarios legales razonables) derivados de:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>El contenido que publique en la plataforma.</li>
          <li>Su uso indebido del servicio.</li>
          <li>El incumplimiento de estos términos.</li>
          <li>La infracción de derechos de terceros.</li>
          <li>El incumplimiento de sus obligaciones como responsable de datos de sus invitados.</li>
        </ul>

        <h2 className="font-heading text-xl text-foreground mt-8">17. Cesión</h2>
        <p>El usuario no podrá ceder ni transferir sus derechos u obligaciones bajo estos términos sin el consentimiento previo y por escrito de Click Tu Boda. Cualquier cesión sin consentimiento será nula.</p>
        <p>Click Tu Boda podrá ceder estos términos, en su totalidad o en parte, en caso de fusión, adquisición, reestructuración o venta de activos, notificándolo al usuario con una antelación razonable.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">18. Fuerza mayor</h2>
        <p>Click Tu Boda no será responsable del incumplimiento o retraso en el cumplimiento de sus obligaciones cuando este sea consecuencia de eventos fuera de su control razonable, incluyendo, sin limitación: desastres naturales, interrupciones de servicios de terceros, cortes de energía, ataques informáticos, pandemias, huelgas, acciones gubernamentales o cambios legislativos.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">19. Modificaciones de los términos</h2>
        <p>Click Tu Boda se reserva el derecho de modificar estos términos en cualquier momento. Las modificaciones se comunicarán al usuario por email o mediante un aviso visible en la plataforma con al menos 15 días de antelación antes de su entrada en vigor.</p>
        <p>El uso continuado del servicio tras la entrada en vigor de las modificaciones implica la aceptación de los nuevos términos. Si no estás de acuerdo con las modificaciones, podrás cancelar tu cuenta antes de que entren en vigor.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">20. Comunicaciones</h2>
        <p>Las comunicaciones entre Click Tu Boda y el usuario se realizarán preferentemente por email a la dirección proporcionada durante el registro. El usuario acepta que las notificaciones enviadas por email constituyen un medio de comunicación válido y vinculante.</p>
        <p>Para comunicaciones dirigidas a Click Tu Boda, puedes escribirnos a <a href="mailto:joseluisitograu@gmail.com" className="text-primary hover:underline">joseluisitograu@gmail.com</a>.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">21. Divisibilidad</h2>
        <p>Si alguna cláusula de estos términos fuese declarada nula o inaplicable por un tribunal competente, las demás cláusulas permanecerán plenamente vigentes y eficaces. La cláusula afectada se sustituirá por otra que, siendo válida, cumpla en la mayor medida posible la finalidad original.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">22. Acuerdo completo</h2>
        <p>Estos términos, junto con la <Link to="/privacidad" className="text-primary hover:underline">Política de Privacidad</Link>, la <Link to="/cookies" className="text-primary hover:underline">Política de Cookies</Link> y la <Link to="/reembolso" className="text-primary hover:underline">Política de Reembolso</Link>, constituyen el acuerdo completo entre el usuario y Click Tu Boda en relación con el uso del servicio, y sustituyen cualquier acuerdo, comunicación o propuesta anterior, ya sea oral o escrita.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">23. Renuncia</h2>
        <p>El hecho de que Click Tu Boda no ejerza o demore el ejercicio de cualquier derecho o acción contemplado en estos términos no constituirá una renuncia al mismo, ni impedirá su ejercicio posterior.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">24. Resolución de disputas</h2>
        <p>Antes de acudir a la vía judicial, las partes intentarán resolver cualquier controversia de buena fe mediante negociación directa. Si la disputa no se resuelve en un plazo razonable de 30 días, cualquiera de las partes podrá acudir a los tribunales competentes.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">25. Ley aplicable y jurisdicción</h2>
        <p>Estos términos se rigen e interpretan conforme a la legislación española. Para cualquier controversia derivada de estos términos serán competentes los juzgados y tribunales del domicilio del prestador, salvo que la legislación de consumidores aplicable establezca un fuero distinto.</p>

        <h2 className="font-heading text-xl text-foreground mt-8">26. Documentos relacionados</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><Link to="/privacidad" className="text-primary hover:underline">Política de Privacidad</Link></li>
          <li><Link to="/cookies" className="text-primary hover:underline">Política de Cookies</Link></li>
          <li><Link to="/reembolso" className="text-primary hover:underline">Política de Reembolso</Link></li>
          <li><a href="https://www.paddle.com/legal/checkout-buyer-terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Términos del Comprador de Paddle</a></li>
        </ul>
      </div>
    </div>
  </div>
);

export default Terms;
