// Política de privacidad, traducción al español. Versión vinculante: de.js (alemán)
import Link from "next/link";
import { PRIVACY_VERSION, PRIVACY_DATE } from "@/lib/privacy";

// Marcadores para datos que la operadora debe completar antes del lanzamiento
const P = ({ children }) => <span className="ph">{children}</span>;

const TOC = [
  ["kurz", "Lo más importante en resumen"],
  ["verantwortlich", "Responsable del tratamiento"],
  ["recht", "Legislación aplicable"],
  ["daten", "Qué datos tratamos"],
  ["zwecke", "Finalidades y bases jurídicas"],
  ["einwilligung", "Consentimiento y revocación"],
  ["gesundheit", "Datos de salud"],
  ["geraete", "Relojes y anillos conectados"],
  ["ki", "Funciones de IA"],
  ["videos", "Vídeos de ejercicios (YouTube)"],
  ["auswertung", "Evaluaciones automáticas"],
  ["empfaenger", "Destinatarios y encargados del tratamiento"],
  ["drittland", "Transferencias a terceros países"],
  ["dauer", "Plazo de conservación"],
  ["cookies", "Cookies y almacenamiento local"],
  ["demo", "Demo sin cuenta"],
  ["warteliste", "Lista de espera"],
  ["sicherheit", "Seguridad de los datos"],
  ["rechte", "Tus derechos"],
  ["beschwerde", "Reclamación ante una autoridad de control"],
  ["pflicht", "Obligación de facilitar datos"],
  ["alter", "Edad mínima"],
  ["werbung", "Sin publicidad, sin venta, sin seguimiento"],
  ["medizin", "No es un producto sanitario"],
  ["aenderungen", "Cambios en esta política"],
];

export default function PrivacyES() {
  return (
      <div className="doc">
        <nav className="doc-toc" aria-label="Contenido">
          <span className="eyebrow">Contenido</span>
          <ol style={{ marginTop: 12 }}>{TOC.map(([id, t], i) => <li key={id}><a href={`#${id}`}>{i + 1}. {t}</a></li>)}</ol>
        </nav>
        <article className="doc-body">
          <div className="stack" style={{ gap: 6 }}>
            <span className="eyebrow">Versión {PRIVACY_VERSION}</span>
            <h1>Política de <em>privacidad</em></h1>
            <p className="muted small">Fecha: {PRIVACY_DATE}. Esta política te informa, conforme a los arts. 13 y 14 del Reglamento General de Protección de Datos (RGPD), a los arts. 19 y ss. de la Ley Federal suiza de Protección de Datos (LPD) y a la Ley de Protección de Datos de Liechtenstein, sobre cómo Second Bloom trata tus datos personales.</p>
            <p className="small"><b>Traducción:</b> esta versión en español se ofrece para facilitar la lectura. En caso de discrepancia, prevalece la <a href="/api/lang?l=de">versión alemana</a>.</p>
          </div>

          <h2 id="kurz">1. Lo más importante en resumen</h2>
          <div className="card flat">
            <ul>
              <li>Second Bloom trata <b>datos de salud</b>. Solo lo hacemos con tu <b>consentimiento explícito</b> y únicamente para darte recomendaciones personales.</li>
              <li>Los servidores y el almacenamiento de datos se encuentran en la <b>UE (Fráncfort del Meno)</b>. La infraestructura la gestiona una empresa estadounidense; consulta los apartados 12 y 13.</li>
              <li>Las <b>funciones de IA</b> están activadas por defecto y puedes desactivarlas en cualquier momento en Cuenta. Al usarlas, se envía a Anthropic un extracto breve sin nombre ni correo electrónico.</li>
              <li><b>Sin publicidad, sin venta de datos, sin seguimiento</b> y sin herramientas de análisis de terceros.</li>
              <li>Puedes <b>descargar todos tus datos</b> en cualquier momento y <b>eliminar tu cuenta con todos los datos de forma inmediata</b> (en <Link href="/konto">Cuenta</Link>).</li>
            </ul>
          </div>

          <h2 id="verantwortlich">2. Responsable del tratamiento</h2>
          <p>El responsable del tratamiento de datos en el sentido del art. 4, punto 7, del RGPD y del art. 5, letra j), de la LPD es:</p>
          <p><P>Nombre o razón social</P><br /><P>Calle y número</P><br /><P>Código postal, localidad, país</P><br />Correo electrónico: <P>datenschutz@…</P></p>
          <p>Para cualquier pregunta sobre protección de datos y para ejercer tus derechos, puedes contactarnos en la dirección de correo electrónico indicada arriba. <P>Si se ha designado un delegado de protección de datos: añadir nombre y contacto.</P> <P>Si el responsable del tratamiento tiene su sede fuera del EEE y se dirige a personas en el EEE: añadir el representante en la UE conforme al art. 27 del RGPD.</P></p>

          <h2 id="recht">3. Legislación aplicable</h2>
          <p>Nos regimos por el <b>RGPD</b>, que se aplica en todo el Espacio Económico Europeo, y por tanto también en Liechtenstein, así como por la <b>Ley de Protección de Datos de Liechtenstein</b>. Para las personas en Suiza se aplica además la <b>Ley Federal suiza de Protección de Datos (LPD)</b> junto con la Ordenanza de Protección de Datos (OPDa). Utilizamos como equivalentes los términos con los que la LPD («Personendaten») y el RGPD («personenbezogene Daten») designan los datos personales.</p>

          <h2 id="daten">4. Qué datos tratamos</h2>
          <div className="scroll-x"><table className="t"><thead><tr><th>Categoría</th><th>Ejemplos</th><th>Origen</th></tr></thead><tbody>
            <tr><td>Datos de la cuenta</td><td>Nombre, apellidos (opcional), dirección de correo electrónico, contraseña (solo como hash bcrypt, nunca en texto claro), rol, fecha de creación</td><td>facilitados por ti al registrarte</td></tr>
            <tr><td>Consentimientos</td><td>Fecha y hora, tipo y versión de tus consentimientos y de tu aceptación de la política de privacidad, confirmación del aviso de que la app no sustituye el consejo médico</td><td>facilitados por ti</td></tr>
            <tr><td>Datos del perfil</td><td>Fecha de nacimiento (a partir de ella se calculan la edad y la comprobación de la edad mínima), país, idioma, estatura, peso, perímetro de cintura e indicación de entrenamiento de fuerza regular (opcionales), fase (perimenopausia, menopausia…), objetivos, tamaño del hogar, tipo de alimentación, preferencias y aversiones alimentarias</td><td>facilitados por ti al registrarte y en la app</td></tr>
            <tr><td><b>Datos de salud</b></td><td>Registros diarios (check-ins) sobre estado de ánimo, energía, sueño y concentración, síntomas como sofocos o sudores nocturnos, menstruación y sangrados, intolerancias (p. ej., lactosa, gluten, histamina), suplementos alimenticios que tomas, entrenamientos, registro de proteínas y agua, entradas del diario, ejercicios y sesiones de coaching completados</td><td>facilitados por ti en la app</td></tr>
            <tr><td><b>Valores del dispositivo</b> (datos de salud)</td><td>Duración y puntuación del sueño, VFC (HRV), frecuencia cardiaca en reposo, frecuencia cardiaca durante el sueño, SpO2, frecuencia respiratoria, estrés, pasos, peso, minutos y calorías de actividad, fase del ciclo</td><td>de intervals.icu, solo si conectas un reloj</td></tr>
            <tr><td>Credenciales de acceso a intervals.icu</td><td>ID de atleta y clave API personal (cifrada)</td><td>facilitados por ti</td></tr>
            <tr><td>Solicitudes a la IA</td><td>Lista de ingredientes, comida, número de personas, tipo de alimentación, foto de la nevera, deseos para el plan semanal, resumen del check-in y de los valores del dispositivo</td><td>facilitados por ti, solo con la IA activada</td></tr>
            <tr><td>Datos de uso y de seguridad</td><td>Número de llamadas a la IA por día, costes por mes (sin contenidos), registros técnicos de nuestro proveedor de alojamiento (p. ej., dirección IP, fecha y hora, dirección consultada, mensajes de error)</td><td>se generan con el uso</td></tr>
          </tbody></table></div>

          <h2 id="zwecke">5. Finalidades y bases jurídicas</h2>
          <div className="scroll-x"><table className="t"><thead><tr><th>Finalidad</th><th>Datos</th><th>Base jurídica</th></tr></thead><tbody>
            <tr><td>Proporcionar la cuenta, inicio de sesión, cambio de contraseña</td><td>Datos de la cuenta</td><td>Contrato, art. 6, apdo. 1, letra b) del RGPD</td></tr>
            <tr><td>Recomendaciones personales: plan diario, entrenamiento, alimentación, ejercicios, evolución, informe para la consulta médica</td><td>Perfil, datos de salud, valores del dispositivo</td><td>consentimiento explícito, art. 9, apdo. 2, letra a) y art. 6, apdo. 1, letra a) del RGPD, art. 6, apdo. 7, letra a) de la LPD</td></tr>
            <tr><td>Conectar el reloj y sincronizarlo a diario</td><td>Credenciales de acceso, valores del dispositivo</td><td>consentimiento explícito como arriba, contrato para la función</td></tr>
            <tr><td>Propuestas de la IA</td><td>Solicitudes a la IA</td><td>Consentimiento al registrarte, que puedes desactivar por separado en cualquier momento, art. 9, apdo. 2, letra a) y art. 49, apdo. 1, letra a) del RGPD, en la medida necesaria para la transferencia</td></tr>
            <tr><td>Acreditación de los consentimientos</td><td>Registro de consentimientos</td><td>obligación legal, art. 6, apdo. 1, letra c) en relación con el art. 7, apdo. 1 del RGPD</td></tr>
            <tr><td>Seguridad, protección contra abusos, limitación de costes de la IA, corrección de errores</td><td>Datos de uso y de seguridad</td><td>interés legítimo en un funcionamiento seguro y asequible, art. 6, apdo. 1, letra f) del RGPD</td></tr>
            <tr><td>Cumplimiento de obligaciones legales, ejercicio de reclamaciones</td><td>en la medida necesaria</td><td>art. 6, apdo. 1, letras c) y f) del RGPD, art. 9, apdo. 2, letra f) del RGPD</td></tr>
          </tbody></table></div>
          <p>No utilizamos tus datos para otras finalidades. Si fuéramos a tratarlos con una nueva finalidad, te lo comunicaríamos previamente y, cuando sea necesario, solicitaríamos tu consentimiento.</p>

          <h2 id="einwilligung">6. Consentimiento y revocación</h2>
          <p>Al registrarte te pedimos un <b>consentimiento explícito para el tratamiento de los datos de salud</b>, sin el cual la app no puede cumplir su función. Este consentimiento incluye expresamente también las funciones de IA y la transferencia a Anthropic necesaria para ellas. Puedes desactivar las funciones de IA por separado en cualquier momento en Cuenta, sin perder el resto de la app. Guardamos la fecha y hora, el tipo y la versión de cada consentimiento para poder acreditarlo.</p>
          <p>Puedes <b>revocar cualquier consentimiento en cualquier momento con efectos para el futuro</b> (art. 7, apdo. 3 del RGPD). La IA la desactivas con un clic en <Link href="/konto">Cuenta</Link>. El consentimiento para los datos de salud lo revocas eliminando tu cuenta o escribiéndonos. En ese caso, eliminamos tus datos de salud. La licitud del tratamiento realizado hasta ese momento no se ve afectada.</p>

          <h2 id="gesundheit">7. Datos de salud</h2>
          <p>Los datos de salud pertenecen a las categorías especiales de datos personales (art. 9 del RGPD) o, según la LPD, a los datos personales sensibles (art. 5, letra c) de la LPD). Los tratamos en consecuencia: solo se evalúan para tus propias recomendaciones, no se vinculan con otras cuentas, no se ceden a terceros para fines propios de estos y no se utilizan con fines publicitarios. Las administradoras de la app (admin) solo ven en la interfaz de administración el nombre, el correo electrónico, el rol y la fecha de creación, no tus entradas. Solo se accede a los contenidos cuando es estrictamente necesario para el funcionamiento, la seguridad o la corrección de errores, o cuando tú lo solicitas.</p>

          <h2 id="geraete">8. Relojes y anillos conectados</h2>
          <p>Si conectas un reloj o un anillo, Second Bloom obtiene los valores diarios a través del servicio <b>intervals.icu</b>. intervals.icu es un servicio independiente en el que tú misma tienes una cuenta y con el que conectas Garmin, Oura, WHOOP, Polar u otros fabricantes. Al tratamiento de datos por parte de intervals.icu y del fabricante de tu dispositivo se aplican sus propias políticas de privacidad.</p>
          <p>Guardamos tu clave API <b>cifrada (AES-256-GCM)</b> y con ella obtenemos una vez al día, así como cuando tú lo solicitas, los valores de los últimos días; en la primera conexión, los de los últimos 120 días. Solo incorporamos los valores de salud indicados en el apartado 4, sin datos GPS, recorridos ni detalles de los entrenamientos. Puedes desconectar la conexión en cualquier momento en Cuenta y eliminar al mismo tiempo todos los valores del dispositivo almacenados.</p>

          <p><b>Apple Health:</b> Apple no ofrece una interfaz en línea para los datos de salud. Por eso puedes seleccionar la exportación de la app Salud (export.zip) en Cuenta. El archivo se lee únicamente en tu navegador y no se sube. Solo se nos envían valores diarios de los últimos 180 días (duración del sueño, VFC, frecuencia cardiaca en reposo, pasos, saturación de oxígeno, frecuencia respiratoria, peso y días de regla). Se guardan como el resto de datos de dispositivos y puedes eliminarlos en Cuenta.</p>

          <h2 id="ki">9. Funciones de IA</h2>
          <p>Mientras no hayas desactivado las funciones de IA (por defecto: activadas), enviamos para cada solicitud un extracto breve a la API de Claude de <b>Anthropic</b>:</p>
          <ul>
            <li><b>Receta a partir de ingredientes:</b> ingredientes, comida, tiempo, número de personas, tipo de alimentación.</li>
            <li><b>Receta a partir de una foto:</b> además, la foto, reducida previamente a un máximo de 1024 píxeles. No guardamos la foto. Asegúrate, por favor, de que no aparezcan personas ni documentos personales.</li>
            <li><b>Plan semanal:</b> fase, tamaño del hogar, tipo de alimentación, objetivo de proteínas, tus deseos y la lista de nuestras recetas.</li>
            <li><b>Valoración del día:</b> fase, check-in de hoy, un resumen de los valores del dispositivo (recuperación, motivos, noche inquieta, indicación sobre el ciclo), entrenamiento de hoy, cena y estado de proteínas.</li>
          </ul>
          <p>En ningún caso enviamos <b>nombre, correo electrónico ni identificador de la cuenta</b>. Anthropic trata los datos como encargado del tratamiento nuestro. Según las condiciones comerciales de Anthropic, las entradas realizadas a través de la API no se utilizan por defecto para entrenar modelos de IA. Los detalles sobre la conservación se rigen por la <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noreferrer">política de privacidad de Anthropic</a>. Las respuestas de la IA son propuestas, no recomendaciones médicas. La valoración del día la guardamos en tu cuenta durante 14 días.</p>
          <p>Sin la IA activada, la app utiliza exclusivamente su propia colección de recetas y sus propias reglas. En ese caso no se transfiere ningún dato a Anthropic.</p>

          <h2 id="videos">10. Vídeos de ejercicios (YouTube)</h2>
          <p>Para los ejercicios mostramos vídeos explicativos de YouTube. Los vídeos solo se cargan cuando pulsas «Ver vídeo». Antes no se establece ninguna conexión con YouTube, ni siquiera para las imágenes de vista previa. Integramos los vídeos en el modo de privacidad mejorado a través de <code>youtube-nocookie.com</code>.</p>
          <p>En cuanto inicias un vídeo, tu navegador se conecta directamente con servidores de YouTube. El proveedor es Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irlanda. Google recibe como mínimo tu dirección IP, la página consultada y datos técnicos sobre tu dispositivo. Es posible el acceso por parte de Google LLC en los EE. UU. YouTube puede almacenar datos en tu navegador durante la reproducción. La base jurídica es tu consentimiento al pulsar (art. 6, apdo. 1, letra a) del RGPD; § 25, apdo. 1 de la TDDDG para personas en Alemania). No se transfiere ningún dato de salud a YouTube, solo qué ejercicio estás viendo. Más información: <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">política de privacidad de Google</a>. Los respectivos canales son responsables del contenido de los vídeos.</p>

          <h2 id="auswertung">11. Evaluaciones automáticas</h2>
          <p>A partir de tus entradas y de los valores del dispositivo, la app calcula indicaciones, por ejemplo una puntuación de recuperación de 0 a 100 basada en la VFC, la frecuencia cardiaca en reposo y el sueño en comparación con tus propios últimos 28 días, indicaciones sobre noches inquietas, la duración de tus ciclos o relaciones como «después de los días de entrenamiento duermes más». Estas evaluaciones siguen reglas fijas y comprensibles. Sirven únicamente para tu información y <b>no producen efectos jurídicos</b> ni te afectan de forma similarmente significativa. No se toman decisiones automatizadas en el sentido del art. 22 del RGPD ni del art. 21 de la LPD.</p>

          <h2 id="empfaenger">12. Destinatarios y encargados del tratamiento</h2>
          <p>Recurrimos a los siguientes proveedores de servicios, que tratan datos por encargo nuestro y siguiendo nuestras instrucciones (art. 28 del RGPD, art. 9 de la LPD). Con ellos tenemos suscritos contratos de encargo del tratamiento. <P>Confirmar antes del lanzamiento la firma de los contratos de encargo del tratamiento (DPA) con Vercel y Anthropic.</P></p>
          <div className="scroll-x"><table className="t"><thead><tr><th>Destinatario</th><th>Función</th><th>Lugar del tratamiento</th></tr></thead><tbody>
            <tr><td>Vercel Inc., EE. UU.</td><td>Alojamiento de la app, funciones de servidor, almacenamiento privado de datos (Vercel Blob), registros técnicos</td><td>Funciones de servidor y almacenamiento de datos en Fráncfort del Meno (UE). Entrega a través de la red mundial de Vercel. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">Privacidad de Vercel</a></td></tr>
            <tr><td>Google Ireland Ltd. (YouTube)</td><td>Reproducción de vídeos de ejercicios, solo tras tu clic; responsable del tratamiento por cuenta propia</td><td>UE y EE. UU. <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacidad de Google</a></td></tr>
            <tr><td>Anthropic, EE. UU.</td><td>Propuestas de la IA (solo con la IA activada)</td><td>EE. UU. <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noreferrer">Privacidad de Anthropic</a></td></tr>
          </tbody></table></div>
          <p><b>intervals.icu</b> no es un encargado del tratamiento nuestro, sino un servicio que utilizas tú misma. Allí obtenemos tus valores con tu clave. Las fuentes tipográficas se sirven desde nuestro propio servidor; no se establece ninguna conexión con Google. Aparte de esto, solo cedemos datos cuando estamos legalmente obligados a ello, por ejemplo por orden de una autoridad.</p>

          <h2 id="drittland">13. Transferencias a terceros países</h2>
          <p>Vercel y Anthropic tienen su sede en los EE. UU. Por ello es posible el acceso desde los EE. UU., por ejemplo para tareas de mantenimiento, así como el tratamiento de las solicitudes a la IA en los EE. UU. En la medida en que el proveedor correspondiente esté certificado en el marco del <b>EU-US Data Privacy Framework</b> y de su <b>extensión Swiss-US</b>, la transferencia se basa en la decisión de adecuación de la Comisión Europea (art. 45 del RGPD) o en el reconocimiento por parte del Consejo Federal suizo (art. 16, apdo. 1 de la LPD). En caso contrario, utilizamos las <b>cláusulas contractuales tipo de la UE</b> (art. 46, apdo. 2, letra c) del RGPD, art. 16, apdo. 2, letra d) de la LPD) con las adaptaciones necesarias para Suiza. Para las funciones de IA, la transferencia se basa además en tu consentimiento explícito (art. 49, apdo. 1, letra a) del RGPD, art. 17, apdo. 1, letra a) de la LPD). Puedes solicitarnos una copia de las garantías. <P>Comprobar en el lanzamiento el estado de certificación de los proveedores e indicarlo aquí.</P></p>

          <h2 id="dauer">14. Plazo de conservación</h2>
          <div className="scroll-x"><table className="t"><thead><tr><th>Datos</th><th>Durante cuánto tiempo</th></tr></thead><tbody>
            <tr><td>Datos de la cuenta, perfil, entradas en la app</td><td>hasta que elimines tu cuenta; entonces, de forma inmediata y completa</td></tr>
            <tr><td>Valores del dispositivo</td><td>como máximo los últimos 400 días (los más antiguos se eliminan automáticamente); al desconectar, de inmediato si lo solicitas; al eliminar la cuenta, de inmediato</td></tr>
            <tr><td>Credenciales de acceso a intervals.icu</td><td>hasta que desconectes la conexión o elimines tu cuenta</td></tr>
            <tr><td>Valoración del día de la IA</td><td>los últimos 14 días</td></tr>
            <tr><td>Fotos para recetas de la IA</td><td>en nuestros sistemas, en ningún caso; solo se transfieren para esa única solicitud</td></tr>
            <tr><td>Registro de consentimientos</td><td>mientras exista tu cuenta; después, solo en la medida en que lo necesitemos legalmente como prueba</td></tr>
            <tr><td>Contador de llamadas a la IA por cuenta</td><td>un día</td></tr>
            <tr><td>Costes de la IA por mes (sin contenidos, sin referencia a personas)</td><td>12 meses</td></tr>
            <tr><td>Cookie de inicio de sesión</td><td>60 días o hasta que cierres la sesión</td></tr>
            <tr><td>Registros técnicos del proveedor de alojamiento</td><td>durante un breve periodo, según las especificaciones de Vercel</td></tr>
          </tbody></table></div>
          <p>Quedan a salvo las obligaciones legales de conservación. No realizamos copias de seguridad propias de tus datos de salud.</p>

          <h2 id="cookies">15. Cookies y almacenamiento local</h2>
          <p>Utilizamos exactamente <b>tres cookies</b>. <code>sb_session</code> mantiene tu sesión iniciada (60 días); está firmada, no puede ser leída por scripts (httpOnly) y solo se envía a través de conexiones cifradas. <code>sb_lang</code> guarda únicamente el idioma elegido para la interfaz (de, en, fr, es o pt, 1 año). <code>sb_cookie_ok</code> recuerda que has visto el aviso de cookies (1 año). Las tres son técnicamente necesarias para la función que has solicitado; para ello no se requiere consentimiento (art. 5, apdo. 3 de la Directiva sobre la privacidad y las comunicaciones electrónicas, art. 45c de la Ley suiza de Telecomunicaciones [FMG]). No utilizamos cookies de análisis, publicidad ni seguimiento, ni píxeles de terceros. Solo cuando inicias un vídeo de ejercicios, YouTube puede almacenar sus propios datos en tu navegador (consulta el apartado 10).</p>

          <h2 id="demo">16. Demo sin cuenta</h2>
          <p>En la <Link href="/demo">demo</Link> pública no guardamos nada en nuestro servidor. Tus entradas permanecen en el almacenamiento local de tu navegador hasta que las elimines allí. Los valores del dispositivo de la demo son datos de ejemplo ficticios. Si utilizas una función de IA en la demo, se aplica el apartado 9 por analogía. Te recomendamos no introducir datos de salud reales en la demo.</p>

          <h2 id="warteliste">17. Lista de espera</h2>
          <p>Si te apuntas en la lista de espera desde la página de inicio, guardamos tu dirección de correo electrónico, tu nombre (opcional), el idioma elegido y la fecha y versión de tu consentimiento. Usamos estos datos únicamente para informarte una vez del lanzamiento de Second Bloom. La base jurídica es tu consentimiento (art. 6, apdo. 1, letra a) del RGPD; art. 31, apdo. 1 de la LPD). No hay boletín, ni cesión a terceros, ni análisis. Puedes <Link href="/warteliste/abmelden">darte de baja aquí</Link> en cualquier momento o escribirnos; entonces eliminamos la inscripción de inmediato. Eliminamos toda la lista de espera como máximo seis meses después del lanzamiento.</p>

          <h2 id="sicherheit">18. Seguridad de los datos</h2>
          <p>Adoptamos medidas técnicas y organizativas conforme al art. 32 del RGPD y al art. 8 de la LPD, entre ellas:</p>
          <ul>
            <li>Transmisión cifrada (HTTPS/TLS) en todas las conexiones.</li>
            <li>Contraseñas solo como hash bcrypt; claves API cifradas con AES-256-GCM.</li>
            <li>Almacenamiento privado de datos sin direcciones públicas, separado por cuenta.</li>
            <li>Sesiones firmadas que dejan de ser válidas al cambiar la contraseña.</li>
            <li>Modelo de roles: las administradoras no ven datos de salud en la interfaz; la cuenta inicial de administración se bloquea en cuanto una administradora tiene su propia contraseña.</li>
            <li>Minimización de datos en la IA: solo los campos necesarios, sin nombres, fotos reducidas y no almacenadas.</li>
            <li>Funciones de servidor y almacenamiento de datos en la UE.</li>
          </ul>
          <p>Si, a pesar de todo, se produjera una violación de la seguridad de tus datos, la notificaremos a la autoridad de control competente y te informaremos cuando así lo exija la ley (arts. 33 y 34 del RGPD, art. 24 de la LPD).</p>

          <h2 id="rechte">19. Tus derechos</h2>
          <ul>
            <li><b>Acceso</b> a los datos almacenados sobre ti (art. 15 del RGPD, art. 25 de la LPD). La forma más rápida es la exportación en Cuenta.</li>
            <li><b>Rectificación</b> de datos inexactos (art. 16 del RGPD, art. 32 de la LPD). La mayoría de los datos los modificas directamente en la app.</li>
            <li><b>Supresión</b> (art. 17 del RGPD, art. 32 de la LPD). Con «Eliminar cuenta» se borran todos los datos de forma inmediata.</li>
            <li><b>Limitación del tratamiento</b> (art. 18 del RGPD).</li>
            <li><b>Portabilidad de los datos</b> (art. 20 del RGPD, art. 28 de la LPD): exportación como archivo JSON legible por máquina en Cuenta.</li>
            <li><b>Oposición</b> a tratamientos basados en intereses legítimos (art. 21 del RGPD, art. 30, apdo. 2, letra b) de la LPD).</li>
            <li><b>Revocación</b> de los consentimientos en cualquier momento con efectos para el futuro (consulta el apartado 6).</li>
          </ul>
          <p>Para cualquier solicitud basta con un correo electrónico a <P>datenschutz@…</P>. Por lo general respondemos en el plazo de un mes y, por seguridad, podemos pedirte que acredites que eres la persona interesada.</p>

          <h2 id="beschwerde">20. Reclamación ante una autoridad de control</h2>
          <p>Tienes derecho a presentar una reclamación ante una autoridad de control de protección de datos (art. 77 del RGPD), en particular en tu país de residencia. Son competentes, por ejemplo:</p>
          <ul>
            <li>Liechtenstein: Autoridad de Protección de Datos de Liechtenstein (Datenschutzstelle Liechtenstein), Vaduz, <a href="https://www.datenschutzstelle.li" target="_blank" rel="noreferrer">datenschutzstelle.li</a></li>
            <li>Suiza: Comisionado Federal de Protección de Datos y Transparencia (PFPDT/FDPIC), Berna, <a href="https://www.edoeb.admin.ch" target="_blank" rel="noreferrer">edoeb.admin.ch</a></li>
            <li>Alemania y Austria: la autoridad de control de tu estado federado o la Autoridad de Protección de Datos de Austria (Datenschutzbehörde)</li>
          </ul>

          <h2 id="pflicht">21. Obligación de facilitar datos</h2>
          <p>Para crear una cuenta necesitamos tu nombre, correo electrónico, contraseña, fecha de nacimiento (para comprobar la edad) y tu fase, así como tu aceptación de la política de privacidad y tu consentimiento para el tratamiento de los datos de salud. Todos los demás datos y la conexión de un reloj son opcionales; las funciones de IA puedes desactivarlas. Sin ellos, algunas funciones no estarán disponibles o solo lo estarán de forma limitada.</p>

          <h2 id="alter">22. Edad mínima</h2>
          <p>Second Bloom está dirigida a personas adultas. Su uso solo está permitido a partir de los 18 años. Al registrarte indicas tu fecha de nacimiento; no se crea ninguna cuenta para personas menores de 18 años.</p>

          <h2 id="werbung">23. Sin publicidad, sin venta, sin seguimiento</h2>
          <p>No mostramos publicidad, no vendemos datos, no creamos perfiles publicitarios y no utilizamos herramientas de análisis de terceros. Tus datos no se utilizan para entrenar modelos de IA.</p>

          <h2 id="medizin">24. No es un producto sanitario</h2>
          <p>Second Bloom es un acompañante de estilo de vida. La app no realiza diagnósticos, no sustituye el consejo médico y no ofrece recomendaciones terapéuticas, en particular sobre la terapia hormonal de la menopausia, medicamentos o suplementos alimenticios. Si tienes molestias, consulta a tu médica o a tu médico; en caso de crisis aguda, llama a los números de emergencia indicados en la app.</p>

          <h2 id="aenderungen">25. Cambios en esta política</h2>
          <p>Adaptamos esta política cuando cambian la app o la situación jurídica. Aquí encontrarás siempre la versión vigente. En caso de cambios sustanciales que requieran un nuevo consentimiento, te lo preguntaremos en la app antes de que el cambio se aplique a ti.</p>

          <div className="card flat" style={{ marginTop: 24 }}>
            <p className="small"><b>Nota sobre el prototipo:</b> los pasajes marcados en amarillo son marcadores de posición que deben completarse antes de un uso público. Esta política refleja la implementación técnica real de la app. Antes del lanzamiento, debería revisarla una persona experta en Derecho de protección de datos, junto con los contratos de encargo del tratamiento y el registro de las actividades de tratamiento (art. 30 del RGPD, art. 12 de la LPD).</p>
          </div>
        </article>
      </div>
  );
}
