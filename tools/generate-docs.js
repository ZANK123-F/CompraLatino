const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  PageNumber, Footer, Header, BorderStyle, Table, TableRow, TableCell, WidthType,
} = require("docx");
const fs = require("fs");
const path = require("path");

const out2 = path.join(__dirname, "..", "documentacion", "Fase-II");
const out3 = path.join(__dirname, "..", "documentacion", "Fase-III");
fs.mkdirSync(out2, { recursive: true });
fs.mkdirSync(out3, { recursive: true });

const border = { style: BorderStyle.SINGLE, size: 4, color: "666666" };
const borders = { top: border, bottom: border, left: border, right: border };

function run(text, o = {}) {
  return new TextRun({
    text: String(text ?? ""),
    font: "Times New Roman",
    size: o.size || 24,
    bold: !!o.bold,
    italics: !!o.italics,
  });
}

function p(text, o = {}) {
  return new Paragraph({
    spacing: { after: o.after ?? 160, before: o.before ?? 0, line: 276 },
    alignment: o.align || AlignmentType.JUSTIFIED,
    ...(o.heading ? { heading: o.heading } : {}),
    children: [run(text, o)],
  });
}

function h1(t) {
  return p(t, { heading: HeadingLevel.HEADING_1, align: AlignmentType.LEFT, bold: true, size: 28, after: 200, before: 240 });
}
function h2(t) {
  return p(t, { heading: HeadingLevel.HEADING_2, align: AlignmentType.LEFT, bold: true, size: 26, after: 160, before: 200 });
}
function h3(t) {
  return p(t, { heading: HeadingLevel.HEADING_3, align: AlignmentType.LEFT, bold: true, size: 24, after: 120, before: 160 });
}
function center(t, o = {}) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: o.after ?? 120 },
    children: [run(t, o)],
  });
}
function bullet(t) {
  return new Paragraph({
    spacing: { after: 80, line: 276 },
    indent: { left: 720 },
    children: [run(`• ${t}`)],
  });
}
function pageBreak() {
  return new Paragraph({ children: [], pageBreak: true });
}
function note(t) {
  return p(t, { italics: true, size: 20, after: 200 });
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

function cover({ subtitle, fase, date }) {
  return [
    center("Universidad Don Bosco", { bold: true, size: 28 }),
    center("Facultad de Informática y Ciencias Aplicadas"),
    center("Arquitectura de Software"),
    center("Ciclo 02-2026", { after: 360 }),
    center("Propuesta de arquitectura de software para la plataforma", { bold: true, size: 28 }),
    center("CompraLatino", { bold: true, size: 32, after: 200 }),
    center(subtitle, { italics: true, after: 120 }),
    center(fase, { bold: true, after: 360 }),
    center("Integrante", { bold: true }),
    center("Marroquín, Franly Azael", { after: 280 }),
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
          children: [
            run("Página ", { size: 18 }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Times New Roman", size: 18 }),
          ],
        })],
      }),
    },
  };
}

const sharedBase = [
  h1("1. Introducción"),
  p("El presente documento forma parte de la propuesta de arquitectura de software para CompraLatino, empresa de comercio electrónico cuyo modelo de negocio consiste en intermediar la compra de productos ofertados en YAuctions, tienda con origen en Japón, y ponerlos a disposición de clientes en Latinoamérica. La Fase I estableció la viabilidad, los objetivos, el SRS, el plan del proyecto y la arquitectura objetivo. Esta entrega conserva esa línea base e incorpora el contenido propio de la fase correspondiente, de modo que CompraLatino disponga de un único hilo documental coherente."),
  p("CompraLatino no opera como un inventario tradicional. Su valor está en articular tres frentes que el cliente no resuelve por sí solo: la cuenta y la experiencia de compra en un canal regional, el cobro local mediante una pasarela de pagos, y la ejecución de la transacción sobre la interfaz que YAuctions expone a terceros. Por esa razón la propuesta describe un sistema transaccional, auditable y administrable."),
  p("La arquitectura de línea base es la siguiente: frontend en Next.js alojado en Firebase Hosting, sesiones con Firebase Authentication, API en ASP.NET Core (C#), persistencia en SQL Server, cobro con Wompi, adaptador hacia YAuctions y módulo administrativo de monitoreo. Las observaciones recibidas en entregas previas se incorporan en este documento."),

  h1("2. Objetivos"),
  h2("2.1 Objetivo general"),
  p("Diseñar e implementar una plataforma de comercio electrónico intermediario que permita a los usuarios de CompraLatino crear una cuenta, buscar y adquirir productos de YAuctions desde computadoras, tabletas y teléfonos inteligentes, pagar a través de la pasarela Wompi, ejecutar la compra mediante la interfaz de YAuctions, recibir recomendaciones basadas en su historial y brindar a la empresa herramientas administrativas de gestión y monitoreo para la toma de decisiones."),
  h2("2.2 Objetivos específicos"),
  bullet("Implementar el registro, el inicio de sesión y la persistencia de sesión mediante Firebase Authentication."),
  bullet("Construir una aplicación web responsive en Next.js, desplegada en Firebase Hosting."),
  bullet("Desarrollar una API REST en ASP.NET Core (C#) para catálogo, carrito, órdenes, recomendaciones, administración y bitácoras."),
  bullet("Modelar e implementar la persistencia en SQL Server."),
  bullet("Integrar Wompi como pasarela de pagos antes de disparar la compra en YAuctions."),
  bullet("Integrar la interfaz de YAuctions mediante un adaptador en el backend."),
  bullet("Ofrecer recomendaciones basadas en el historial de compras."),
  bullet("Habilitar un módulo administrativo con tableros, bitácoras e indicadores para la toma de decisiones."),
  bullet("Definir e implementar la solución de inteligencia de negocios sobre los hechos transaccionales."),

  h1("3. Justificación y limitantes del proyecto"),
  h2("3.1 Justificación"),
  p("YAuctions concentra una oferta que, para el consumidor latinoamericano, suele estar detrás de barreras de idioma, medio de pago, cuenta extranjera y logística. CompraLatino remueve esas barreras: el cliente opera en un canal propio, paga con un instrumento regional y la empresa concreta la operación en la fuente japonesa. El modelo solo es sostenible si la plataforma garantiza identidad, cobro, ejecución remota y visibilidad operativa."),
  p("La justificación técnica es comercial. La cuenta permite reconocer al cliente y personalizar la oferta. La experiencia responsive permite vender en el dispositivo que el usuario ya usa. Wompi permite cobrar sin almacenar datos de tarjeta. La API orquesta cobro y compra con transacciones consistentes. SQL Server permite reportar. Firebase cubre sesión y hosting del frontend."),
  h2("3.2 Limitantes"),
  bullet("Dependencia de la disponibilidad y del contrato de YAuctions."),
  bullet("Dependencia de la afiliación, liquidación y comisiones de Wompi."),
  bullet("Catálogo no propio: precios y vigencia pueden cambiar entre vitrina y cobro."),
  bullet("Conversión de moneda y tipo de cambio gestionados en backend."),
  bullet("Logística internacional y aduanas fuera del núcleo de software de esta línea base."),
  bullet("Latencia y huso horario con Japón, con necesidad de compensación o reintento."),
  bullet("Separación de superficies de despliegue entre frontend y API."),
  bullet("Cumplimiento en el tratamiento de datos personales."),

  h1("4. Documento de especificación de requisitos (SRS)"),
  h2("4.1 Propósito y alcance"),
  p("Este SRS establece qué debe hacer la plataforma, para quién y con qué restricciones. El producto es una plataforma web de intermediación: cuentas, búsqueda, carrito, checkout con Wompi, ejecución en YAuctions, historial, recomendaciones y backoffice. No incluye aplicación nativa independiente ni almacén físico propio."),
  h2("4.2 Actores"),
  p("Cliente final; administrador de CompraLatino; sistema YAuctions; pasarela Wompi; Firebase Authentication; operación de CompraLatino."),
  h2("4.3 Requisitos funcionales"),
  center("Tabla 1", { italics: true }),
  center("Requisitos funcionales de CompraLatino", { italics: true }),
  table([
    ["ID", "Requisito", "Descripción"],
    ["RF-01", "Registro de cuenta", "Creación de cuenta con identidad en Firebase Authentication y perfil en SQL Server."],
    ["RF-02", "Inicio de sesión", "Sesión persistente y token enviado a la API."],
    ["RF-03", "Búsqueda", "Búsqueda y filtros desde computadora, tableta o teléfono."],
    ["RF-04", "Detalle", "Ficha con precio de origen y precio de cobro estimado."],
    ["RF-05", "Carrito y checkout", "Armado de carrito y creación de transacción Wompi en servidor."],
    ["RF-06", "Cobro Wompi", "Confirmación por webhook firmado o consulta oficial."],
    ["RF-07", "Ejecución YAuctions", "Compra en origen tras pago aprobado."],
    ["RF-08", "Historial", "Consulta de órdenes, pagos y ejecución."],
    ["RF-09", "Recomendaciones", "Sugerencias a partir del historial de compras."],
    ["RF-10", "Administración", "Tableros de monitoreo para decisión."],
    ["RF-11", "Gestión de órdenes", "Filtrado y actualización de estados operativos."],
    ["RF-12", "Bitácora", "Traza de integraciones con Wompi y YAuctions."],
  ]),
  note("Nota. Elaboración propia a partir de las necesidades de CompraLatino."),
  h2("4.4 Requisitos no funcionales"),
  center("Tabla 2", { italics: true }),
  table([
    ["ID", "Atributo", "Criterio"],
    ["RNF-01", "Multi-dispositivo", "Flujos completos en computadora, tableta y teléfono."],
    ["RNF-02", "Seguridad de identidad", "Validación de token y roles en API."],
    ["RNF-03", "Seguridad de pagos", "Sin almacenamiento de PAN ni CVV."],
    ["RNF-04", "Integridad", "El estado lo decide el backend."],
    ["RNF-05", "Desempeño", "Búsqueda y ficha en tiempos interactivos."],
    ["RNF-06", "Disponibilidad", "HTTPS y degradación controlada ante fallas externas."],
    ["RNF-07", "Auditabilidad", "Órdenes, pagos e integraciones consultables."],
    ["RNF-08", "Mantenibilidad", "API en capas con adaptadores intercambiables."],
    ["RNF-09", "Datos personales", "Mínimo necesario; contraseñas en Firebase Authentication."],
  ]),
  note("Nota. Elaboración propia."),

  h1("5. Estudio de viabilidad"),
  p("El proyecto es viable en las dimensiones técnica, económica, operativa y legal-comercial. Las herramientas seleccionadas tienen precedente industrial; el costo de arranque es de nube y comisión de pasarela; la operación exige un responsable de órdenes y un runbook de excepciones; la afiliación a Wompi y el acceso a YAuctions son supuestos comerciales de CompraLatino. Se recomienda continuar con diseño, construcción y solución de inteligencia de negocios."),

  h1("6. Plan del proyecto"),
  center("Tabla 3", { italics: true }),
  center("Cronograma de actividades", { italics: true }),
  table([
    ["Fase", "Actividades", "Inicio", "Fin"],
    ["I. Planificación", "SRS, viabilidad, riesgos, arquitectura", "21/07/2026", "12/08/2026"],
    ["II. Diseño", "Datos, contratos, UML, prototipos", "13/08/2026", "15/09/2026"],
    ["III. Construcción y BI", "Código, integraciones, paneles BI", "16/09/2026", "10/10/2026"],
    ["IV. Integraciones", "Wompi y YAuctions en pruebas", "11/10/2026", "23/10/2026"],
    ["V. Operación", "Pruebas, seguridad y producción", "24/10/2026", "20/11/2026"],
  ]),
  note("Nota. Elaboración propia. El camino crítico es la integración Wompi + YAuctions."),

  h1("7. Descripción de la arquitectura propuesta"),
  p("La arquitectura es cliente-servidor con API REST, especialización por capas en el servidor y patrón adaptador para Wompi y YAuctions. El cliente Next.js se publica en Firebase Hosting y autentica con Firebase Authentication. El núcleo transaccional vive en ASP.NET Core y persiste en SQL Server. Se descartan microservicios y la concentración de cobro o ejecución en el navegador. Firebase no se usa como base de datos de órdenes."),
];

const fase2Body = [
  h1("8. Detalle de los componentes de la arquitectura"),
  p("Esta sección detalla plataformas, servicios e interfaces que interactúan con la solución, con el nivel exigido para el diseño técnico."),
  h2("8.1 Plataformas"),
  bullet("Next.js: canal único responsive para catálogo, cuenta, carrito, checkout, historial, recomendaciones y backoffice."),
  bullet("Firebase Hosting: publicación HTTPS y CDN del frontend."),
  bullet("Firebase Authentication: registro, inicio de sesión y emisión de token de identidad."),
  bullet("ASP.NET Core Web API: orquestación de negocio y exposición REST."),
  bullet("SQL Server: fuente de verdad de perfiles, catálogo intermediado, órdenes, pagos, eventos e indicadores."),
  h2("8.2 Servicios"),
  bullet("Identidad y perfil de negocio."),
  bullet("Catálogo y cotización con conversión JPY a moneda local."),
  bullet("Órdenes con máquina de estados."),
  bullet("Adaptador Wompi para transacción y verificación de firma."),
  bullet("Adaptador YAuctions para ejecución de compra."),
  bullet("Recomendaciones por historial."),
  bullet("Administración, monitoreo y bitácoras."),
  h2("8.3 Interfaces"),
  bullet("Frontend ↔ API: REST JSON sobre HTTPS con Authorization Bearer."),
  bullet("API ↔ Wompi: creación de transacción y webhook firmado."),
  bullet("API ↔ YAuctions: invocación saliente exclusiva desde servidor."),
  bullet("Frontend ↔ Firebase Authentication: SDK de cliente."),
  h2("8.4 Modelo de datos central"),
  p("Las entidades principales son UserProfile, Product, Order, OrderItem, Payment e IntegrationEvent. La orden transita por PendingPayment, Paid, Executing, Completed, Compensation, Declined y Cancelled. IntegrationEvent conserva proveedor, acción, resultado y marca de tiempo para cumplir RF-12."),

  h1("9. Diagramas de la arquitectura propuesta"),
  p("Los diagramas se entregan en documentacion/Fase-II/diagramas e incluyen la vista de componentes, la secuencia de compra, el modelo de dominio, la máquina de estados de la orden y el modelo entidad-relación. En conjunto cubren hardware lógico, software, servicios externos y comportamiento."),
  h3("9.1 Componentes"),
  p("El canal multi-dispositivo se publica en Firebase Hosting, la identidad corre en Firebase Authentication y el núcleo ASP.NET Core se conecta a SQL Server, Wompi y YAuctions. El navegador no posee credenciales de YAuctions ni secretos de webhook."),
  h3("9.2 Secuencia de compra"),
  p("El usuario confirma el carrito; la API crea la orden pendiente y la transacción Wompi; el webhook aprobado dispara YAuctions; el resultado actualiza historial y tableros. Si YAuctions rechaza, la orden entra en compensación."),
  h3("9.3 Dominio, estados y ERD"),
  p("UserProfile se asocia a Order; Order contiene OrderItem y Payment; OrderItem referencia Product; IntegrationEvent audita cada interacción externa. El ERD formaliza esas cardinalidades para el diseño físico en SQL Server."),

  h1("10. Prototipos visuales"),
  p("Los prototipos visuales se presentan en documentacion/Fase-II/prototipos/wireframes-ui.html y en la aplicación web de codigo/frontend. La interfaz privilegia marca clara, navegación persistente, catálogo operable, ficha con precio de origen y cobro estimado, carrito, checkout Wompi, historial, recomendaciones y, en administración, menús de tablero, órdenes y bitácoras."),

  h1("11. Presupuesto de implementación"),
  center("Tabla 4", { italics: true }),
  center("Presupuesto de implementación (USD)", { italics: true }),
  table([
    ["Rubro", "Detalle", "USD"],
    ["Diseño técnico y UML", "Datos, contratos, prototipos", "1,600"],
    ["API ASP.NET Core + SQL Server", "Dominio, estados, bitácoras", "2,800"],
    ["Frontend Next.js + Auth/Hosting", "Canal responsive", "2,400"],
    ["Integración Wompi", "Checkout, webhook, conciliación", "1,200"],
    ["Integración YAuctions", "Adaptador y compensaciones", "1,600"],
    ["Recomendaciones y admin BI", "Historial y tableros", "1,400"],
    ["Pruebas y despliegue", "Seguridad y puesta en operación", "1,000"],
    ["Contingencia (10%)", "Riesgos de integración", "1,200"],
    ["Total", "", "13,200"],
  ]),
  note("Nota. Elaboración propia. Las comisiones de Wompi son variables y se cubren con el margen de intermediación."),
  p("Costo operativo mensual estimado de arranque, sin comisiones: entre USD 40 y 160."),

  h1("12. Cierre de la Fase II"),
  p("Con el diseño técnico, los diagramas, los prototipos y el presupuesto de implementación, CompraLatino dispone de la base necesaria para la construcción. La arquitectura elegida en la Fase I se mantiene. La siguiente fase incorpora la solución de inteligencia de negocios y la primera versión funcional del software."),
];

const fase3Body = [
  h1("13. Descripción de la arquitectura de la solución de BI"),
  p("La necesidad de conocimiento del caso de estudio exige más que operar compras: CompraLatino debe saber qué se vende, dónde se pierde conversión de pago, dónde falla la ejecución en Japón y qué categorías impulsan la demanda."),
  h2("13.1 Enfoque"),
  p("Se adopta un BI operacional embebido. El almacén analítico de arranque es SQL Server. Un servicio de agregación materializa indicadores y series para endpoints administrativos protegidos por rol. Esta decisión evita, en la primera versión, un data warehouse separado."),
  h2("13.2 Estructuras de datos"),
  bullet("Hechos: Order, OrderItem, Payment, IntegrationEvent."),
  bullet("Dimensiones: fecha, categoría, estado de orden, estado de pago, proveedor y usuario."),
  bullet("Indicadores: órdenes totales, ingresos, tasa de aprobación Wompi, tasa de éxito YAuctions, compensación, clientes con compra, ventas por día, top categorías y embudo de pago."),
  h2("13.3 Plataformas y tecnologías"),
  bullet("Origen: API ASP.NET Core, Entity Framework Core y SQL Server."),
  bullet("Capa semántica: servicio de BI con consultas agregadas."),
  bullet("Consumo: panel administrativo en Next.js."),
  bullet("Evolución: vistas materializadas o Power BI sobre réplica de lectura cuando el volumen lo justifique."),
  h2("13.4 Gobierno"),
  p("Los indicadores se calculan sobre hechos persistidos tras webhooks y adaptadores. El acceso exige rol administrador. Las bitácoras permiten auditar discrepancias entre pago aprobado y ejecución fallida."),

  h1("14. Prototipos de la solución de BI"),
  p("Los esquemas del producto final y de los paneles se entregan en documentacion/Fase-III/prototipos-bi/paneles-bi.html y en codigo/frontend. El panel incluye indicadores, series, top de categorías, embudo Wompi, resultados YAuctions, órdenes y bitácoras de integración."),

  h1("15. Descripción del software construido"),
  p("La primera versión funcional se organiza en codigo/backend y codigo/frontend. Implementa registro e inicio de sesión, catálogo, carrito, checkout con Wompi, ejecución mediante adaptador YAuctions, historial, recomendaciones, panel BI y bitácoras. El repositorio público del código se encuentra en la cuenta GitHub del estudiante."),

  h1("16. Conclusiones y recomendaciones"),
  h2("16.1 Conclusiones"),
  p("Es viable construir CompraLatino con separación clara entre vitrina y núcleo transaccional. La máquina de estados y los adaptadores permiten absorber fallas de Wompi o YAuctions sin corromper la verdad operativa. La solución de BI embebida satisface la necesidad de conocimiento del caso de estudio en la primera versión. El hilo documental mantiene trazabilidad desde el SRS hasta el diseño, la construcción y el monitoreo."),
  h2("16.2 Recomendaciones"),
  bullet("Completar la afiliación real a Wompi y el contrato de interfaz de YAuctions antes del go-live."),
  bullet("Operar en producción con validación de token de Firebase Authentication."),
  bullet("Usar SQL Server administrado con respaldos."),
  bullet("Formalizar el runbook de compensación con dueño de negocio."),
  bullet("Separar réplica analítica cuando el volumen lo justifique."),
  bullet("Ampliar pruebas automatizadas de webhook, idempotencia y autorización administrativa."),
];

const references = [
  h1("Referencias"),
  p("American Psychological Association. (2020). Publication manual of the American Psychological Association (7.ª ed.)."),
  p("Bass, L., Clements, P., & Kazman, R. (2013). Software architecture in practice (3.ª ed.). Addison-Wesley."),
  p("Fielding, R. T. (2000). Architectural styles and the design of network-based software architectures [Tesis doctoral, University of California, Irvine]."),
  p("Google. (s. f.-a). Firebase Authentication documentation. https://firebase.google.com/docs/auth"),
  p("Google. (s. f.-b). Firebase Hosting documentation. https://firebase.google.com/docs/hosting"),
  p("ISO/IEC/IEEE. (2018). ISO/IEC/IEEE 29148:2018. Systems and software engineering — Life cycle processes — Requirements engineering."),
  p("Kimball, R., & Ross, M. (2013). The data warehouse toolkit (3.ª ed.). Wiley."),
  p("Microsoft. (s. f.). ASP.NET Core documentation. https://learn.microsoft.com/aspnet/core"),
  p("Object Management Group. (2017). OMG unified modeling language (OMG UML) version 2.5.1."),
  p("Pressman, R. S., & Maxim, B. R. (2020). Software engineering: A practitioner’s approach (9.ª ed.). McGraw-Hill."),
  p("Vercel. (s. f.). Next.js documentation. https://nextjs.org/docs"),
  p("Wompi. (s. f.). Documentación para desarrolladores. https://docs.wompi.co"),
];

function index(items) {
  return [h1("Índice"), ...items.map((t) => p(t, { align: AlignmentType.LEFT, after: 60 })), pageBreak()];
}

async function writeDoc(filePath, label, coverArgs, body) {
  const doc = new Document({
    ...headerFooter(label),
    sections: [{
      properties: {
        page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
      },
      children: [...cover(coverArgs), ...body],
    }],
  });
  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, buf);
  console.log("OK", filePath, "bytes", buf.length);
}

async function main() {
  await writeDoc(
    path.join(out2, "CompraLatino_Fase_II_Diseno_Arquitectura.docx"),
    "Fase II",
    {
      subtitle: "Especificación de requisitos, viabilidad, plan del proyecto, arquitectura técnica, diagramas UML y prototipos",
      fase: "Fase II — Diseño",
      date: "15 de septiembre de 2026",
    },
    [
      ...index([
        "1. Introducción",
        "2. Objetivos",
        "3. Justificación y limitantes del proyecto",
        "4. Documento de especificación de requisitos (SRS)",
        "5. Estudio de viabilidad",
        "6. Plan del proyecto",
        "7. Descripción de la arquitectura propuesta",
        "8. Detalle de los componentes de la arquitectura",
        "9. Diagramas de la arquitectura propuesta",
        "10. Prototipos visuales",
        "11. Presupuesto de implementación",
        "12. Cierre de la Fase II",
        "Referencias",
      ]),
      ...sharedBase,
      ...fase2Body,
      ...references,
    ]
  );

  await writeDoc(
    path.join(out3, "CompraLatino_Fase_III_Desarrollo_y_BI.docx"),
    "Fase III",
    {
      subtitle: "Arquitectura técnica, solución de inteligencia de negocios, prototipos y descripción del software construido",
      fase: "Fase III — Desarrollo",
      date: "10 de octubre de 2026",
    },
    [
      ...index([
        "1. Introducción",
        "2. Objetivos",
        "3. Justificación y limitantes del proyecto",
        "4. Documento de especificación de requisitos (SRS)",
        "5. Estudio de viabilidad",
        "6. Plan del proyecto",
        "7. Descripción de la arquitectura propuesta",
        "8. Detalle de los componentes de la arquitectura",
        "9. Diagramas de la arquitectura propuesta",
        "10. Prototipos visuales",
        "11. Presupuesto de implementación",
        "12. Cierre de la Fase II",
        "13. Descripción de la arquitectura de la solución de BI",
        "14. Prototipos de la solución de BI",
        "15. Descripción del software construido",
        "16. Conclusiones y recomendaciones",
        "Referencias",
      ]),
      ...sharedBase,
      ...fase2Body,
      ...fase3Body,
      ...references,
    ]
  );

  // sanity: ensure accents survived in generator source
  const sample = "aplicación, información, Marroquín, especificación";
  if (!sample.includes("ó") || !sample.includes("í")) {
    throw new Error("Encoding broken in generator source");
  }
  console.log("Encoding check:", sample);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
