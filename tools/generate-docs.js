const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageNumber, Footer, Header, BorderStyle, Table, TableRow, TableCell, WidthType } = require("docx");
const fs = require("fs");
const path = require("path");

const out2 = path.join(__dirname, "..", "documentacion", "Fase-II");
const out3 = path.join(__dirname, "..", "documentacion", "Fase-III");
fs.mkdirSync(out2, { recursive: true });
fs.mkdirSync(out3, { recursive: true });

const border = { style: BorderStyle.SINGLE, size: 4, color: "666666" };
const borders = { top: border, bottom: border, left: border, right: border };

function run(text, o = {}) {
  return new TextRun({ text, font: "Times New Roman", size: o.size || 24, bold: !!o.bold, italics: !!o.italics });
}
function p(text, o = {}) {
  return new Paragraph({
    spacing: { after: o.after ?? 160, before: o.before ?? 0, line: 276 },
    alignment: o.align || AlignmentType.JUSTIFIED,
    indent: o.indent || {},
    ...(o.heading ? { heading: o.heading } : {}),
    children: [run(text, o)],
  });
}
function h1(t) { return p(t, { heading: HeadingLevel.HEADING_1, align: AlignmentType.LEFT, bold: true, size: 28, after: 200, before: 240 }); }
function h2(t) { return p(t, { heading: HeadingLevel.HEADING_2, align: AlignmentType.LEFT, bold: true, size: 26, after: 160, before: 200 }); }
function h3(t) { return p(t, { heading: HeadingLevel.HEADING_3, align: AlignmentType.LEFT, bold: true, size: 24, after: 120, before: 160 }); }
function center(t, o = {}) {
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: o.after ?? 120 }, children: [run(t, o)] });
}
function bullet(t) {
  return new Paragraph({
    spacing: { after: 80, line: 276 },
    indent: { left: 720 },
    children: [run(`â€¢ ${t}`)],
  });
}
function pageBreak() {
  return new Paragraph({ children: [new TextRun({ break: 1 })], pageBreak: true });
}
function cell(text, width) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    children: [new Paragraph({ spacing: { after: 40 }, children: [run(String(text), { size: 20 })] })],
  });
}
function table(rows) {
  const w = Math.floor(9360 / rows[0].length);
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    rows: rows.map((r) => new TableRow({ children: r.map((c) => cell(c, w)) })),
  });
}
function note(t) { return p(t, { italics: true, size: 20, after: 200 }); }

function cover({ faseLine, subtitle, date }) {
  return [
    center("Universidad Don Bosco", { bold: true, size: 28 }),
    center("Facultad de InformÃ¡tica y Ciencias Aplicadas"),
    center("Arquitectura de Software"),
    center("Ciclo 02-2026", { after: 360 }),
    center("Propuesta de arquitectura de software para la plataforma", { bold: true, size: 28 }),
    center("CompraLatino", { bold: true, size: 32, after: 200 }),
    center(subtitle, { italics: true, after: 120 }),
    center(faseLine, { bold: true, after: 360 }),
    center("Integrante", { bold: true }),
    center("MarroquÃ­n, Franly Azael", { after: 280 }),
    center("San Salvador, El Salvador"),
    center(date, { after: 200 }),
    pageBreak(),
  ];
}

function headerFooter(label) {
  return {
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [run(`CompraLatino. ${label}`, { italics: true, size: 18 })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [run("PÃ¡gina ", { size: 18 }), new TextRun({ children: [PageNumber.CURRENT], font: "Times New Roman", size: 18 })],
        })],
      }),
    },
  };
}

const fase1Core = [
  h1("1. IntroducciÃ³n"),
  p("El presente documento constituye la propuesta acumulativa de arquitectura de software para CompraLatino, empresa de comercio electrÃ³nico cuyo modelo de negocio consiste en intermediar la compra de productos ofertados en YAuctions, tienda con origen en JapÃ³n, y ponerlos a disposiciÃ³n de clientes en LatinoamÃ©rica. En la Fase I se evaluÃ³ la viabilidad del proyecto, se fijaron los objetivos comerciales y tÃ©cnicos, se especificaron los requisitos del sistema y se definiÃ³ el plan de trabajo. Las fases posteriores enriquecen ese mismo documento con el diseÃ±o tÃ©cnico, los diagramas, los prototipos, el presupuesto de implementaciÃ³n, la soluciÃ³n de inteligencia de negocios y la evidencia de construcciÃ³n."),
  p("CompraLatino no opera como un inventario tradicional. Su valor estÃ¡ en articular tres frentes que el cliente no resuelve por sÃ­ solo: la cuenta y la experiencia de compra en un canal regional, el cobro local mediante una pasarela de pagos, y la ejecuciÃ³n de la transacciÃ³n sobre la interfaz que YAuctions expone a terceros. Por esa razÃ³n la propuesta no se limita a un sitio vitrina: describe un sistema transaccional, auditable y administrable."),
  p("La arquitectura de lÃ­nea base permanece estable a lo largo del documento: frontend en Next.js alojado en Firebase Hosting, sesiones con Firebase Authentication, API en ASP.NET Core (C#), persistencia en SQL Server, cobro con Wompi, adaptador hacia YAuctions y mÃ³dulo administrativo de monitoreo. Cada fase actualiza la introducciÃ³n y aÃ±ade secciones nuevas sin descartar el contenido previo, conforme a la indicaciÃ³n de entregas acumulativas."),

  h1("2. Objetivos"),
  h2("2.1 Objetivo general"),
  p("DiseÃ±ar e implementar una plataforma de comercio electrÃ³nico intermediario que permita a los usuarios de CompraLatino crear una cuenta, buscar y adquirir productos de YAuctions desde computadoras, tabletas y telÃ©fonos inteligentes, pagar a travÃ©s de la pasarela Wompi, ejecutar la compra mediante la interfaz de YAuctions, recibir recomendaciones basadas en su historial y brindar a la empresa herramientas administrativas de gestiÃ³n y monitoreo para la toma de decisiones."),
  h2("2.2 Objetivos especÃ­ficos"),
  p("Los objetivos especÃ­ficos cubren el proyecto en su totalidad y fijan lo que se espera de las entregas:"),
  bullet("Implementar el registro, el inicio de sesiÃ³n y la persistencia de sesiÃ³n de los usuarios mediante Firebase Authentication, de modo que la identidad sea Ãºnica tanto en el frontend como en las llamadas a la API."),
  bullet("Construir una aplicaciÃ³n web responsive en Next.js, desplegada en Firebase Hosting, que permita buscar, consultar detalle y completar el flujo de compra en computadoras, tabletas y telÃ©fonos inteligentes."),
  bullet("Desarrollar una API REST en ASP.NET Core (C#) que concentre la lÃ³gica de negocio: catÃ¡logo, carrito, Ã³rdenes, recomendaciones, administraciÃ³n y bitÃ¡coras."),
  bullet("Modelar e implementar la persistencia en SQL Server para usuarios de negocio, productos sincronizados, Ã³rdenes, pagos, historial de compras e indicadores de monitoreo."),
  bullet("Integrar Wompi como pasarela de pagos para autorizar y confirmar el cobro de cada orden antes de disparar la compra en YAuctions."),
  bullet("Integrar la interfaz provista por YAuctions a travÃ©s de un adaptador en el backend, de forma que CompraLatino ejecute la transacciÃ³n en JapÃ³n sin exponer credenciales ni reglas de esa API en el navegador."),
  bullet("Ofrecer un motor de recomendaciones basado en el historial de compras almacenado en SQL Server."),
  bullet("Habilitar un mÃ³dulo administrativo con tableros de Ã³rdenes, estados de pago, resultados de integraciÃ³n con YAuctions, productos mÃ¡s demandados, fallos operativos y bitÃ¡coras, orientado a la toma de decisiones."),
  bullet("Definir e implementar la soluciÃ³n de inteligencia de negocios sobre los hechos transaccionales para soportar el conocimiento operativo de CompraLatino."),

  h1("3. JustificaciÃ³n y limitantes del proyecto"),
  h2("3.1 JustificaciÃ³n"),
  p("YAuctions concentra una oferta de productos que, para el consumidor latinoamericano, suele estar detrÃ¡s de barreras de idioma, medio de pago, cuenta extranjera y logÃ­stica. CompraLatino nace para remover esas barreras: el cliente opera en un canal propio, paga con un instrumento regional y la empresa se encarga de concretar la operaciÃ³n en la fuente japonesa. Ese modelo solo es sostenible si la plataforma garantiza identidad, cobro, ejecuciÃ³n remota y visibilidad operativa."),
  p("La justificaciÃ³n tÃ©cnica es, por tanto, comercial. Una cuenta de usuario permite reconocer al cliente, recuperar su historial y personalizar la oferta. Una experiencia responsive permite vender en el dispositivo que el cliente ya usa. Una pasarela como Wompi permite cobrar en el entorno local sin que CompraLatino almacene datos de tarjeta. Una API propia permite orquestar el cobro y la compra en YAuctions con transacciones consistentes. SQL Server permite reportar. Firebase cubre la sesiÃ³n del usuario y el hosting del frontend."),
  p("Construir la soluciÃ³n con separaciÃ³n frontend/backend no es un capricho de stack. El cobro, la firma de webhooks de Wompi, las credenciales de YAuctions y el cambio de estado de una orden son operaciones de confianza. Deben ocurrir en servidor. Next.js concentra la interfaz; C# concentra el negocio; SQL Server concentra los hechos; Firebase Authentication concentra la sesiÃ³n; Firebase Hosting concentra la entrega del cliente web."),
  h2("3.2 Limitantes del proyecto"),
  bullet("Dependencia de YAuctions: disponibilidad del catÃ¡logo, reglas de compra y tiempos de respuesta fuera del control de CompraLatino."),
  bullet("Dependencia de Wompi: afiliaciÃ³n comercial, liquidaciÃ³n, comisiones y rechazos bancarios."),
  bullet("CatÃ¡logo no propio: precios, stock y vigencia pueden cambiar entre la vitrina y el instante del cobro."),
  bullet("Tipo de cambio y moneda: conversiÃ³n JPY a moneda local calculada en backend."),
  bullet("LogÃ­stica internacional y aduanas: el software registra la orden; la operaciÃ³n fÃ­sica puede evolucionar en fases posteriores."),
  bullet("Latencia y huso horario con JapÃ³n: se requieren estados de compensaciÃ³n, reembolso o reintento."),
  bullet("SeparaciÃ³n de hosting: Firebase Hosting para frontend; API y SQL Server en otra superficie de despliegue."),
  bullet("Cumplimiento y datos personales: registro, historial y comprobantes sujetos a buenas prÃ¡cticas de protecciÃ³n de datos."),

  h1("4. Documento de especificaciÃ³n de requisitos (SRS)"),
  h2("4.1 PropÃ³sito"),
  p("Este SRS establece quÃ© debe hacer la plataforma CompraLatino, para quiÃ©n y con quÃ© restricciones, de manera que el diseÃ±o, la construcciÃ³n y las pruebas tengan una lÃ­nea base. Se alinea con prÃ¡cticas de especificaciÃ³n de requisitos de software (IEEE/ISO/IEC 29148) y cubre requisitos funcionales, no funcionales, actores y alcance."),
  h2("4.2 Alcance del producto"),
  p("El producto es una plataforma web de intermediaciÃ³n. Incluye gestiÃ³n de cuentas, bÃºsqueda y visualizaciÃ³n de productos provenientes de YAuctions, carrito y checkout con Wompi, orquestaciÃ³n de la compra en YAuctions, historial, recomendaciones y un backoffice de monitoreo. No incluye, en esta lÃ­nea base, una aplicaciÃ³n nativa iOS/Android independiente, un almacÃ©n fÃ­sico propio ni un call center."),
  h2("4.3 Actores e interesados"),
  p("Cliente final; administrador de CompraLatino; sistema YAuctions; pasarela Wompi; Firebase Authentication; operaciÃ³n de CompraLatino."),
  h2("4.4 Requisitos funcionales"),
  center("Tabla 1", { italics: true }),
  center("Requisitos funcionales de la plataforma CompraLatino", { italics: true }),
  table([
    ["ID", "Requisito", "DescripciÃ³n"],
    ["RF-01", "Registro de cuenta", "El usuario crea cuenta; Firebase Authentication emite identidad; la API registra el perfil en SQL Server."],
    ["RF-02", "Inicio de sesiÃ³n", "SesiÃ³n persistente con token enviado a la API en cada peticiÃ³n de negocio."],
    ["RF-03", "BÃºsqueda de productos", "BÃºsqueda y filtros sobre catÃ¡logo intermediado desde PC, tablet o telÃ©fono."],
    ["RF-04", "Detalle de producto", "Ficha con precio de origen, precio de cobro estimado y condiciones visibles."],
    ["RF-05", "Carrito y checkout", "Armado de carrito; backend calcula total y crea transacciÃ³n en Wompi."],
    ["RF-06", "Cobro con Wompi", "ConfirmaciÃ³n Ãºnicamente por webhook firmado o consulta oficial de estado."],
    ["RF-07", "EjecuciÃ³n en YAuctions", "Tras pago aprobado, el backend invoca la interfaz de YAuctions."],
    ["RF-08", "Historial de compras", "Consulta de Ã³rdenes, pagos, ejecuciÃ³n y comprobantes."],
    ["RF-09", "Recomendaciones", "Sugerencias a partir del historial de compras concluidas."],
    ["RF-10", "AdministraciÃ³n y monitoreo", "Tableros de Ã³rdenes, pagos, YAuctions, demanda e incidentes."],
    ["RF-11", "GestiÃ³n de Ã³rdenes", "Filtrado y actualizaciÃ³n de estados operativos permitidos."],
    ["RF-12", "BitÃ¡cora de integraciÃ³n", "Traza de llamadas relevantes a Wompi y YAuctions."],
  ]),
  note("Nota. ElaboraciÃ³n propia a partir de las necesidades de CompraLatino."),
  h2("4.5 Requisitos no funcionales"),
  center("Tabla 2", { italics: true }),
  center("Requisitos no funcionales", { italics: true }),
  table([
    ["ID", "Atributo", "Criterio"],
    ["RNF-01", "Multi-dispositivo", "Interfaz adaptable a computadora, tableta y telÃ©fono."],
    ["RNF-02", "Seguridad de identidad", "Tokens validados en API; roles cliente y administrador."],
    ["RNF-03", "Seguridad de pagos", "Sin almacenamiento de PAN/CVV; webhooks firmados."],
    ["RNF-04", "Integridad transaccional", "El estado lo decide el backend, no el navegador."],
    ["RNF-05", "DesempeÃ±o percibido", "BÃºsqueda y ficha en tiempos interactivos."],
    ["RNF-06", "Disponibilidad", "HTTPS en Hosting; degradaciÃ³n controlada ante fallas externas."],
    ["RNF-07", "Auditabilidad", "Ã“rdenes, pagos e integraciones consultables."],
    ["RNF-08", "Mantenibilidad", "API en capas con adaptadores intercambiables."],
    ["RNF-09", "Cumplimiento de datos", "MÃ­nimo de datos personales; contraseÃ±as en Firebase Auth."],
  ]),
  note("Nota. ElaboraciÃ³n propia."),
  h2("4.6 Reglas de negocio relevantes"),
  bullet("El precio cobrado al cliente lo calcula el backend al crear la orden."),
  bullet("Solo una orden con pago aprobado en Wompi habilita la ejecuciÃ³n en YAuctions."),
  bullet("Si YAuctions rechaza despuÃ©s de un pago aprobado, la orden entra en compensaciÃ³n."),
  bullet("Las recomendaciones se generan a partir de compras concluidas."),
  bullet("Los administradores se autorizan por rol; el cliente no se autoasigna administraciÃ³n."),

  h1("5. Estudio de viabilidad"),
  h2("5.1 Viabilidad tÃ©cnica"),
  p("El problema se descompone en piezas con precedente industrial claro. Next.js cubre la interfaz responsive. Firebase Authentication cubre registro y sesiÃ³n. ASP.NET Core ofrece un modelo maduro para APIs transaccionales e integraciones HTTP. SQL Server cubre integridad y reportes. Wompi cubre el cobro. El riesgo principal no estÃ¡ en la inexistencia de herramientas, sino en la orquestaciÃ³n pago-compra; ello se resuelve con mÃ¡quina de estados, idempotencia y bitÃ¡coras. La soluciÃ³n es tÃ©cnicamente viable."),
  h2("5.2 Viabilidad econÃ³mica"),
  p("El ingreso de CompraLatino es la intermediaciÃ³n. Los costos de plataforma en arranque son de nube y comisiÃ³n de pasarela, proporcionales al uso y a las ventas. El perfil es compatible con un arranque sin inversiÃ³n en hardware propio."),
  h2("5.3 Viabilidad operativa"),
  p("Operar la plataforma exige un responsable de Ã³rdenes, soporte al cliente y criterio para excepciones. El software aporta tableros y bitÃ¡coras para que esa operaciÃ³n no dependa de hojas de cÃ¡lculo paralelas."),
  h2("5.4 Viabilidad legal y comercial"),
  p("CompraLatino debe contar con tÃ©rminos claros sobre su rol de intermediario, afiliarse a Wompi y obtener o mantener acceso a la interfaz de YAuctions. Con esos supuestos, el proyecto es viable en el plano comercial."),
  h2("5.5 ConclusiÃ³n de viabilidad"),
  p("El proyecto es viable. Se recomienda continuar con diseÃ±o, construcciÃ³n y soluciÃ³n de BI sobre la arquitectura descrita."),

  h1("6. Plan del proyecto"),
  h2("6.1 Enfoque de trabajo"),
  p("Se adopta un esquema por fases, acumulativo, alineado a las entregas del curso y a un ciclo de construcciÃ³n iterativo dentro de cada fase."),
  h2("6.2 Cronograma de actividades"),
  center("Tabla 3", { italics: true }),
  center("Cronograma de actividades del proyecto CompraLatino", { italics: true }),
  table([
    ["Fase", "Actividades principales", "Inicio", "Fin"],
    ["I. PlanificaciÃ³n", "SRS, viabilidad, riesgos, presupuesto, arquitectura", "21/07/2026", "12/08/2026"],
    ["II. DiseÃ±o", "Modelo de datos, contratos, UML, prototipos UI", "13/08/2026", "15/09/2026"],
    ["III. ConstrucciÃ³n y BI", "CÃ³digo funcional, integraciones, paneles BI", "16/09/2026", "10/10/2026"],
    ["IV. Integraciones", "Wompi y YAuctions en ambiente de pruebas", "11/10/2026", "23/10/2026"],
    ["V. OperaciÃ³n", "Pruebas, seguridad y puesta en producciÃ³n", "24/10/2026", "20/11/2026"],
  ]),
  note("Nota. ElaboraciÃ³n propia. El camino crÃ­tico es la integraciÃ³n Wompi + YAuctions."),
  h2("6.3 AnÃ¡lisis de riesgos"),
  center("Tabla 4", { italics: true }),
  center("Matriz de riesgos del proyecto", { italics: true }),
  table([
    ["ID", "Riesgo", "MitigaciÃ³n"],
    ["R01", "Cambios en YAuctions", "Adaptador aislado, reintentos y compensaciÃ³n"],
    ["R02", "Rechazos en Wompi", "Estados de pago y webhook firmado"],
    ["R03", "Pago OK y compra fallida", "Proceso de compensaciÃ³n visible en admin"],
    ["R04", "VariaciÃ³n de tipo de cambio", "Tasa capturada al cotizar y al cobrar"],
    ["R05", "Fuga de secretos", "Secretos solo en servidor"],
  ]),
  h2("6.4 Presupuesto estimado de desarrollo"),
  p("El esfuerzo total valorado del ciclo se estima en el orden de USD 13,600, con un costo operativo mensual de arranque entre USD 40 y 160, sin incluir comisiones variables de Wompi."),

  h1("7. DescripciÃ³n de la arquitectura propuesta"),
  h2("7.1 VisiÃ³n de la soluciÃ³n"),
  p("La arquitectura de CompraLatino es una arquitectura en capas, distribuida en dos aplicaciones y tres proveedores externos de borde. El cliente web (Next.js) se publica en Firebase Hosting y utiliza Firebase Authentication para crear la cuenta y mantener la sesiÃ³n. Toda regla de negocio transaccional vive en una API REST escrita en ASP.NET Core (C#). La API persiste en SQL Server y se integra con Wompi para el cobro y con YAuctions para ejecutar la compra. El mÃ³dulo administrativo es parte del mismo frontend, con rutas y endpoints restringidos por rol."),
  h2("7.2 Estilo arquitectÃ³nico y justificaciÃ³n"),
  p("El estilo elegido es cliente-servidor con API REST, especializaciÃ³n por capas en el servidor y el patrÃ³n adaptador para Wompi y YAuctions. Se privilegian modificabilidad, integridad y auditabilidad. Se descartan microservicios y la concentraciÃ³n de cobro o ejecuciÃ³n en el frontend. Firebase no se usa como base de datos de Ã³rdenes; SQL Server es la fuente de verdad de hechos contables y operativos."),
  h2("7.3 Componentes de la soluciÃ³n"),
  p("Frontend Next.js; Firebase Authentication; API ASP.NET Core; SQL Server; Wompi; adaptador YAuctions; motor de recomendaciones; herramientas administrativas con bitÃ¡coras. El detalle ampliado de plataformas, servicios e interfaces se desarrolla en las secciones de diseÃ±o de este documento acumulativo."),
  h2("7.4 Flujo de extremo a extremo"),
  bullet("El usuario abre la aplicaciÃ³n en Firebase Hosting e inicia sesiÃ³n."),
  bullet("Busca y selecciona productos mediante la API."),
  bullet("Al checkout, la API recotiza, persiste la orden y crea la transacciÃ³n en Wompi."),
  bullet("Tras el webhook aprobado, la API ejecuta la compra en YAuctions."),
  bullet("Historial, recomendaciones y tableros administrativos reflejan el resultado."),
  h2("7.5 Vista de despliegue"),
  p("Zona pÃºblica: Firebase Hosting. Zona de identidad: Firebase Authentication. Zona privada: API ASP.NET Core y SQL Server. Wompi y YAuctions por HTTPS; webhook de Wompi autenticado por firma."),
  h2("7.6 Ventajas de la arquitectura"),
  p("SeparaciÃ³n de confianza, identidad lista para producciÃ³n, canal Ãºnico multi-dispositivo, hosting desacoplado, integridad y reportes en SQL Server, pasarela real, modificabilidad de integraciones y camino claro de fases."),
];

const fase2Extra = [
  h1("8. Detalle de los componentes de la arquitectura"),
  p("Esta secciÃ³n amplÃ­a la descripciÃ³n de la Fase I. Describe plataformas, servicios e interfaces que interactÃºan con la arquitectura propuesta, con el nivel de detalle exigido para el diseÃ±o tÃ©cnico."),
  h2("8.1 Plataformas"),
  bullet("Next.js (App Router): canal Ãºnico responsive para catÃ¡logo, cuenta, carrito, checkout, historial, recomendaciones y backoffice."),
  bullet("Firebase Hosting: publicaciÃ³n HTTPS y CDN del frontend."),
  bullet("Firebase Authentication: registro, login, recuperaciÃ³n y emisiÃ³n de ID token."),
  bullet("ASP.NET Core Web API: orquestaciÃ³n transaccional y exposiciÃ³n REST."),
  bullet("SQL Server: fuente de verdad de perfiles, catÃ¡logo intermediado, Ã³rdenes, pagos, eventos e indicadores."),
  h2("8.2 Servicios de aplicaciÃ³n"),
  bullet("Servicio de identidad y perfil de negocio."),
  bullet("Servicio de catÃ¡logo y cotizaciÃ³n (JPY, margen, moneda local)."),
  bullet("Servicio de Ã³rdenes con mÃ¡quina de estados."),
  bullet("Cliente/adaptador Wompi (transacciÃ³n y verificaciÃ³n de firma)."),
  bullet("Cliente/adaptador YAuctions (ejecuciÃ³n y consulta de resultado)."),
  bullet("Servicio de recomendaciones por historial."),
  bullet("Servicio de administraciÃ³n, monitoreo y bitÃ¡coras."),
  h2("8.3 Interfaces"),
  bullet("Frontend â†” API: REST JSON sobre HTTPS con Authorization Bearer."),
  bullet("API â†” Wompi: creaciÃ³n de transacciÃ³n y webhook firmado de entrada."),
  bullet("API â†” YAuctions: invocaciÃ³n saliente exclusiva desde servidor."),
  bullet("Frontend â†” Firebase Authentication: SDK de cliente para sesiÃ³n."),
  h2("8.4 Contratos de datos principales"),
  p("Las entidades centrales son UserProfile, Product, Order, OrderItem, Payment e IntegrationEvent. Order mantiene estados PendingPayment, Paid, Executing, Completed, Compensation, Declined y Cancelled. Payment registra el identificador Wompi y su estado. IntegrationEvent conserva proveedor, acciÃ³n, resultado, carga Ãºtil y marca de tiempo para auditorÃ­a (RF-12)."),

  h1("9. Diagramas de la arquitectura propuesta"),
  p("Los diagramas se entregan como artefactos de diseÃ±o en la carpeta documentacion/Fase-II/diagramas y se describen a continuaciÃ³n. Cubren hardware lÃ³gico, software, servicios externos y comportamiento."),
  h2("9.1 Diagrama de componentes"),
  p("La vista de componentes muestra el canal multi-dispositivo (Next.js) publicado en Firebase Hosting, la identidad en Firebase Authentication, el nÃºcleo ASP.NET Core, SQL Server, Wompi y YAuctions. El navegador no posee credenciales de YAuctions ni secretos de webhook."),
  h2("9.2 Diagrama de secuencia de compra"),
  p("El usuario confirma el carrito; la API crea la orden pendiente y la transacciÃ³n Wompi; el webhook aprobado dispara YAuctions; el resultado actualiza historial y tableros. Si YAuctions rechaza, la orden entra en compensaciÃ³n."),
  h2("9.3 Diagrama de clases del dominio"),
  p("UserProfile se asocia a Order; Order contiene OrderItem y Payment; OrderItem referencia Product; IntegrationEvent audita cada interacciÃ³n externa relevante."),
  h2("9.4 MÃ¡quina de estados de la orden"),
  p("PendingPayment â†’ Paid | Declined; Paid â†’ Executing; Executing â†’ Completed | Compensation; Compensation â†’ Completed | Cancelled."),
  h2("9.5 Modelo entidad-relaciÃ³n"),
  p("El ERD formaliza las cardinalidades entre perfil, orden, detalle, producto, pago y evento de integraciÃ³n, base del diseÃ±o fÃ­sico en SQL Server."),
  note("Nota. Archivos: 01-arquitectura-componentes.mmd, 02-secuencia-compra.mmd, 03-modelo-dominio.mmd, 04-estados-orden.mmd, 05-erd.mmd."),

  h1("10. Prototipos visuales (wireframes y UI/UX)"),
  p("Los prototipos visuales se presentan en documentacion/Fase-II/prototipos/wireframes-ui.html y en la aplicaciÃ³n web de codigo/frontend. La propuesta de interfaz privilegia una composiciÃ³n de marca clara en el primer viewport, navegaciÃ³n persistente, catÃ¡logo operable, ficha con precio de origen y cobro estimado, carrito, checkout Wompi, historial y, para administraciÃ³n, menÃºs de monitoreo y bitÃ¡coras."),
  bullet("Home: marca CompraLatino, promesa de valor y acceso al catÃ¡logo."),
  bullet("CatÃ¡logo y ficha: bÃºsqueda, categorÃ­as y decisiÃ³n de compra."),
  bullet("Checkout: referencia de transacciÃ³n Wompi y confirmaciÃ³n de estado."),
  bullet("Historial y recomendaciones: trazabilidad y personalizaciÃ³n."),
  bullet("Admin: tableros, Ã³rdenes y bitÃ¡coras de integraciÃ³n."),

  h1("11. Presupuesto de implementaciÃ³n"),
  p("El presupuesto de implementaciÃ³n detalla el desembolso asociado a llevar el diseÃ±o a una primera versiÃ³n operable."),
  center("Tabla 5", { italics: true }),
  center("Presupuesto de implementaciÃ³n (USD)", { italics: true }),
  table([
    ["Rubro", "Detalle", "USD"],
    ["DiseÃ±o tÃ©cnico y UML", "Datos, contratos, prototipos", "1,600"],
    ["API ASP.NET Core + SQL Server", "Dominio, estados, bitÃ¡coras", "2,800"],
    ["Frontend Next.js + Auth/Hosting", "Canal responsive", "2,400"],
    ["IntegraciÃ³n Wompi", "Checkout, webhook, conciliaciÃ³n", "1,200"],
    ["IntegraciÃ³n YAuctions", "Adaptador y compensaciones", "1,600"],
    ["Recomendaciones y admin BI", "Historial y tableros", "1,400"],
    ["Pruebas y despliegue", "Seguridad y go-live", "1,000"],
    ["Contingencia (10%)", "Riesgos de integraciÃ³n", "1,200"],
    ["Total", "", "13,200"],
  ]),
  note("Nota. ElaboraciÃ³n propia. Las comisiones de Wompi son variables y se cubren con el margen de intermediaciÃ³n."),
  p("Costo operativo mensual estimado de arranque, sin comisiones: USD 40â€“160 (Firebase Hosting/Authentication, servicio de API y SQL administrado)."),

  h1("12. Cierre de la Fase II"),
  p("Con el diseÃ±o tÃ©cnico, los diagramas, los prototipos y el presupuesto de implementaciÃ³n, CompraLatino dispone de la base necesaria para la construcciÃ³n. La arquitectura elegida en la Fase I se mantiene. La siguiente fase incorpora la soluciÃ³n de inteligencia de negocios y el cÃ³digo fuente funcional de la primera versiÃ³n, sin romper la continuidad del documento acumulativo."),
];

const fase3Extra = [
  h1("13. DescripciÃ³n de la arquitectura de la soluciÃ³n de BI"),
  p("La necesidad de conocimiento del caso de estudio exige mÃ¡s que operar compras: CompraLatino debe saber quÃ© se vende, dÃ³nde se pierde conversiÃ³n de pago, dÃ³nde falla la ejecuciÃ³n en JapÃ³n y quÃ© categorÃ­as impulsan la demanda. La soluciÃ³n de BI se diseÃ±a sobre los mismos hechos transaccionales."),
  h2("13.1 Enfoque"),
  p("Se adopta un BI operacional embebido. El almacÃ©n analÃ­tico de arranque es SQL Server. Un servicio de agregaciÃ³n materializa KPIs y series para endpoints administrativos protegidos por rol. Esta decisiÃ³n evita, en la primera versiÃ³n, un data warehouse separado, reduce costo y acorta la latencia de decisiÃ³n para el volumen inicial."),
  h2("13.2 Estructuras de datos"),
  bullet("Hechos: Order, OrderItem, Payment, IntegrationEvent."),
  bullet("Dimensiones: fecha, categorÃ­a, estado de orden, estado de pago, proveedor de integraciÃ³n, usuario."),
  bullet("Indicadores: Ã³rdenes totales, ingresos de Ã³rdenes completadas, tasa de aprobaciÃ³n Wompi, tasa de Ã©xito YAuctions, Ã³rdenes en compensaciÃ³n, clientes con compra, ventas por dÃ­a, top categorÃ­as y embudo de pago."),
  h2("13.3 Plataformas y tecnologÃ­as"),
  bullet("Origen OLTP: API ASP.NET Core, Entity Framework Core y SQL Server."),
  bullet("Capa semÃ¡ntica: servicio de BI con consultas agregadas."),
  bullet("Consumo: panel administrativo en Next.js con menÃºs de monitoreo y bitÃ¡coras."),
  bullet("EvoluciÃ³n: vistas materializadas o herramientas como Power BI sobre rÃ©plica de lectura cuando el volumen lo justifique."),
  h2("13.4 Gobierno y calidad"),
  p("Los indicadores se calculan sobre hechos persistidos tras webhooks y adaptadores, no sobre mera navegaciÃ³n de vitrina. El acceso exige rol administrador. Las bitÃ¡coras permiten auditar discrepancias entre pago aprobado y ejecuciÃ³n fallida."),

  h1("14. Prototipos de la soluciÃ³n de BI y del producto"),
  p("Los esquemas del producto final y de los paneles BI se entregan en documentacion/Fase-III/prototipos-bi/paneles-bi.html y en la aplicaciÃ³n codigo/frontend. El panel administrativo incluye tarjetas de indicadores, series de ventas, top de categorÃ­as, embudo Wompi, resultados YAuctions, listado de Ã³rdenes y bitÃ¡coras de integraciÃ³n. El canal de cliente incluye menÃº principal, catÃ¡logo, ficha, carrito, checkout, historial y recomendaciones."),

  h1("15. DescripciÃ³n del software construido"),
  p("La primera versiÃ³n funcional se organiza en codigo/backend (API CompraLatino.Api) y codigo/frontend (Next.js). Implementa registro e inicio de sesiÃ³n, catÃ¡logo, carrito, checkout con simulaciÃ³n controlada de Wompi para ambiente acadÃ©mico, ejecuciÃ³n mediante adaptador YAuctions, historial, recomendaciones, panel BI y bitÃ¡coras. El repositorio pÃºblico del cÃ³digo se aloja en la cuenta GitHub del estudiante."),

  h1("16. Conclusiones y recomendaciones"),
  h2("16.1 Conclusiones"),
  p("Primero, es viable construir CompraLatino como intermediario digital con separaciÃ³n clara entre vitrina y nÃºcleo transaccional. Segundo, la mÃ¡quina de estados y los adaptadores permiten absorber fallas de Wompi o YAuctions sin corromper la verdad operativa. Tercero, la soluciÃ³n de BI embebida satisface la necesidad de conocimiento del caso de estudio en la primera versiÃ³n. Cuarto, el documento acumulativo mantiene trazabilidad desde el SRS hasta el diseÃ±o, la construcciÃ³n y el monitoreo."),
  h2("16.2 Recomendaciones"),
  bullet("Completar la afiliaciÃ³n real a Wompi y el contrato de interfaz de YAuctions antes del go-live."),
  bullet("Operar en producciÃ³n con validaciÃ³n de ID token de Firebase Authentication."),
  bullet("Usar SQL Server administrado con respaldos y alertas."),
  bullet("Formalizar el runbook de compensaciÃ³n con dueÃ±o de negocio."),
  bullet("Separar rÃ©plica analÃ­tica cuando el volumen lo justifique."),
  bullet("Ampliar pruebas automatizadas de webhook, idempotencia y autorizaciÃ³n administrativa."),
];

const references = [
  h1("Referencias"),
  p("American Psychological Association. (2020). Publication manual of the American Psychological Association (7.Âª ed.)."),
  p("Bass, L., Clements, P., & Kazman, R. (2013). Software architecture in practice (3.Âª ed.). Addison-Wesley."),
  p("Fielding, R. T. (2000). Architectural styles and the design of network-based software architectures [Tesis doctoral, University of California, Irvine]. https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm"),
  p("Google. (s. f.-a). Firebase Authentication documentation. https://firebase.google.com/docs/auth"),
  p("Google. (s. f.-b). Firebase Hosting documentation. https://firebase.google.com/docs/hosting"),
  p("ISO/IEC/IEEE. (2018). ISO/IEC/IEEE 29148:2018. Systems and software engineering â€” Life cycle processes â€” Requirements engineering."),
  p("Kimball, R., & Ross, M. (2013). The data warehouse toolkit (3.Âª ed.). Wiley."),
  p("Microsoft. (s. f.). ASP.NET Core documentation. https://learn.microsoft.com/aspnet/core"),
  p("Object Management Group. (2017). OMG unified modeling language (OMG UML) version 2.5.1."),
  p("Pressman, R. S., & Maxim, B. R. (2020). Software engineering: A practitionerâ€™s approach (9.Âª ed.). McGraw-Hill."),
  p("Vercel. (s. f.). Next.js documentation. https://nextjs.org/docs"),
  p("Wompi. (s. f.). DocumentaciÃ³n para desarrolladores. https://docs.wompi.co"),
];

function index(items) {
  return [h1("Ãndice"), ...items.map((t) => p(t, { align: AlignmentType.LEFT, after: 60 })), pageBreak()];
}

async function writeDoc(filePath, label, coverArgs, body) {
  const doc = new Document({
    ...headerFooter(label),
    sections: [{
      properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      children: [...cover(coverArgs), ...body],
    }],
  });
  fs.writeFileSync(filePath, await Packer.toBuffer(doc));
  console.log("Wrote", filePath);
}

async function main() {
  await writeDoc(
    path.join(out2, "CompraLatino_Fase_II_Documento_Acumulativo.docx"),
    "Fase II",
    {
      faseLine: "Fase II â€” DiseÃ±o (documento acumulativo)",
      subtitle: "EspecificaciÃ³n de requisitos, viabilidad, plan del proyecto, arquitectura tÃ©cnica, diagramas UML y prototipos",
      date: "15 de septiembre de 2026",
    },
    [
      ...index([
        "1. IntroducciÃ³n",
        "2. Objetivos",
        "3. JustificaciÃ³n y limitantes del proyecto",
        "4. Documento de especificaciÃ³n de requisitos (SRS)",
        "5. Estudio de viabilidad",
        "6. Plan del proyecto",
        "7. DescripciÃ³n de la arquitectura propuesta",
        "8. Detalle de los componentes de la arquitectura",
        "9. Diagramas de la arquitectura propuesta",
        "10. Prototipos visuales (wireframes y UI/UX)",
        "11. Presupuesto de implementaciÃ³n",
        "12. Cierre de la Fase II",
        "Referencias",
      ]),
      ...fase1Core,
      ...fase2Extra,
      ...references,
    ]
  );

  await writeDoc(
    path.join(out3, "CompraLatino_Fase_III_Documento_Acumulativo.docx"),
    "Fase III",
    {
      faseLine: "Fase III â€” Desarrollo y soluciÃ³n de BI (documento acumulativo)",
      subtitle: "Propuesta completa: planificaciÃ³n, diseÃ±o tÃ©cnico, arquitectura de BI, prototipos y construcciÃ³n",
      date: "10 de octubre de 2026",
    },
    [
      ...index([
        "1. IntroducciÃ³n",
        "2. Objetivos",
        "3. JustificaciÃ³n y limitantes del proyecto",
        "4. Documento de especificaciÃ³n de requisitos (SRS)",
        "5. Estudio de viabilidad",
        "6. Plan del proyecto",
        "7. DescripciÃ³n de la arquitectura propuesta",
        "8. Detalle de los componentes de la arquitectura",
        "9. Diagramas de la arquitectura propuesta",
        "10. Prototipos visuales (wireframes y UI/UX)",
        "11. Presupuesto de implementaciÃ³n",
        "12. Cierre de la Fase II",
        "13. DescripciÃ³n de la arquitectura de la soluciÃ³n de BI",
        "14. Prototipos de la soluciÃ³n de BI y del producto",
        "15. DescripciÃ³n del software construido",
        "16. Conclusiones y recomendaciones",
        "Referencias",
      ]),
      ...fase1Core,
      ...fase2Extra,
      ...fase3Extra,
      ...references,
    ]
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
