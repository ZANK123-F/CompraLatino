const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageNumber, Footer, Header, BorderStyle, Table, TableRow, TableCell, WidthType, PageBreak } = require("docx");
const fs = require("fs");
const path = require("path");

const outDir2 = path.join(__dirname, "..", "documentacion", "Fase-II");
const outDir3 = path.join(__dirname, "..", "documentacion", "Fase-III");
fs.mkdirSync(outDir2, { recursive: true });
fs.mkdirSync(outDir3, { recursive: true });

const border = { style: BorderStyle.SINGLE, size: 4, color: "999999" };
const borders = { top: border, bottom: border, left: border, right: border };

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after ?? 160, before: opts.before ?? 0, line: 276 },
    alignment: opts.align || AlignmentType.JUSTIFIED,
    ...opts.heading ? { heading: opts.heading } : {},
    children: [
      new TextRun({
        text,
        bold: !!opts.bold,
        italics: !!opts.italics,
        size: opts.size || 24,
        font: "Times New Roman",
      }),
    ],
  });
}

function h1(text) { return p(text, { heading: HeadingLevel.HEADING_1, align: AlignmentType.LEFT, bold: true, size: 28, after: 200 }); }
function h2(text) { return p(text, { heading: HeadingLevel.HEADING_2, align: AlignmentType.LEFT, bold: true, size: 26, after: 160 }); }
function h3(text) { return p(text, { heading: HeadingLevel.HEADING_3, align: AlignmentType.LEFT, bold: true, size: 24, after: 120 }); }
function title(text, size = 32) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text, bold: true, size, font: "Times New Roman" })],
  });
}
function center(text, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: opts.after ?? 120 },
    children: [new TextRun({ text, bold: !!opts.bold, italics: !!opts.italics, size: opts.size || 24, font: "Times New Roman" })],
  });
}
function bullet(text) {
  return new Paragraph({
    spacing: { after: 80, line: 276 },
    indent: { left: 720 },
    children: [new TextRun({ text: `• ${text}`, size: 24, font: "Times New Roman" })],
  });
}
function cell(text, width = 2340) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    children: [new Paragraph({ children: [new TextRun({ text, size: 20, font: "Times New Roman" })] })],
  });
}
function table(rows) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    rows: rows.map((r) => new TableRow({ children: r.map((c, i) => cell(c, Math.floor(9360 / r.length))) })),
  });
}

function cover({ fase, subtitle, date }) {
  return [
    center("UNIVERSIDAD DON BOSCO", { bold: true, size: 28 }),
    center("Facultad de Informática y Ciencias Aplicadas", { size: 24 }),
    center("Arquitectura de Software / Diseño de Sistemas Empresariales", { size: 24 }),
    center("Ciclo 02-2026", { size: 24, after: 400 }),
    title("Propuesta de arquitectura de software para la plataforma"),
    title("CompraLatino"),
    center(subtitle, { italics: true, after: 200 }),
    center(fase, { bold: true, after: 400 }),
    center("Integrantes del grupo de trabajo", { bold: true }),
    center("Marroquín, Franly Azael"),
    center("(Completar nombres del resto del equipo)"),
    center("San Salvador, El Salvador", { after: 80 }),
    center(date, { after: 400 }),
    new Paragraph({ children: [], pageBreak: true }),
  ];
}

function commonHeaderFooter(label) {
  return {
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: `CompraLatino · ${label}`, italics: true, size: 18, font: "Times New Roman", color: "666666" })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Página ", size: 18, font: "Times New Roman" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, font: "Times New Roman" }),
          ],
        })],
      }),
    },
  };
}

async function buildFase2() {
  const doc = new Document({
    styles: {
      default: { document: { styles: [{ id: "Normal", run: { font: "Times New Roman", size: 24 } }] } },
    },
    ...commonHeaderFooter("Fase II"),
    sections: [{
      properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
      children: [
        ...cover({
          fase: "Fase II — Diseño de arquitectura técnica, UML y prototipos UI/UX",
          subtitle: "Documento acumulativo de arquitectura técnica (incluye observaciones y línea base de Fase I)",
          date: "15 de septiembre de 2026",
        }),
        h1("Índice"),
        p("1. Introducción"),
        p("2. Síntesis acumulativa de la Fase I"),
        p("3. Detalle de los componentes de la arquitectura"),
        p("4. Diagramas de la arquitectura propuesta"),
        p("5. Prototipos visuales (wireframes y UI/UX)"),
        p("6. Presupuesto de implementación"),
        p("7. Trazabilidad requisitos–componentes"),
        p("8. Cierre de la Fase II"),
        p("Referencias"),
        new Paragraph({ children: [], pageBreak: true }),

        h1("1. Introducción"),
        p("El presente documento constituye la Fase II de la propuesta de arquitectura de software para CompraLatino, empresa de comercio electrónico intermediario que habilita a clientes latinoamericanos la compra de productos ofertados en YAuctions (Japón). Esta entrega actualiza la introducción de la Fase I y profundiza el diseño técnico: plataformas, servicios, interfaces, diagramas UML, prototipos visuales y presupuesto de implementación."),
        p("La Fase I estableció la viabilidad, el SRS, el plan del proyecto y la arquitectura objetivo: frontend Next.js en Firebase Hosting, sesiones con Firebase Authentication, API REST en ASP.NET Core (C#), persistencia en SQL Server, cobro con Wompi y ejecución remota mediante un adaptador hacia YAuctions, más un módulo administrativo de monitoreo. La Fase II no cambia ese estilo arquitectónico; lo detalla para que CompraLatino y el equipo de construcción compartan contratos, flujos y vistas de despliegue."),
        p("El alcance de esta fase responde a las mismas necesidades del caso de estudio: creación de cuenta; búsqueda y compra multi-dispositivo; ejecución de compras vía interfaz de YAuctions; recomendaciones basadas en historial; y herramientas administrativas para la toma de decisiones. Las entregas son acumulativas: se conservan objetivos, justificación, limitantes, SRS y viabilidad, e incorporan el diseño técnico exigido por la rúbrica de Fase II."),

        h1("2. Síntesis acumulativa de la Fase I"),
        h2("2.1 Objetivo general"),
        p("Diseñar e implementar una plataforma de comercio electrónico intermediario que permita a los usuarios de CompraLatino crear una cuenta, buscar y adquirir productos de YAuctions desde computadoras, tabletas y teléfonos inteligentes, pagar a través de la pasarela Wompi, ejecutar la compra mediante la interfaz de YAuctions, recibir recomendaciones basadas en su historial y brindar a la empresa herramientas administrativas de gestión y monitoreo para la toma de decisiones."),
        h2("2.2 Arquitectura base aprobada"),
        p("Cliente-servidor con API REST, capas en el backend (presentación, aplicación, dominio, infraestructura) y patrón adaptador para Wompi y YAuctions. Firebase se usa para identidad y hosting del frontend; SQL Server es la fuente de verdad de órdenes, pagos e historial. Se descartan microservicios y un backend exclusivo en Route Handlers de Next.js para no mezclar vitrina y núcleo transaccional."),
        h2("2.3 Requisitos funcionales cubiertos en diseño"),
        p("RF-01 a RF-12: registro e inicio de sesión, búsqueda, detalle, carrito/checkout, cobro Wompi, ejecución YAuctions, historial, recomendaciones, administración, gestión de órdenes y bitácora de integración."),

        h1("3. Detalle de los componentes de la arquitectura"),
        h2("3.1 Plataformas"),
        bullet("Next.js (App Router): interfaz responsive única para PC, tablet y smartphone; rutas de catálogo, cuenta, carrito, checkout, historial, recomendaciones y administración."),
        bullet("Firebase Hosting: publicación HTTPS/CDN del frontend."),
        bullet("Firebase Authentication: registro, login y sesión (ID token). En el prototipo funcional académico se incluye un modo JWT de desarrollo equivalente para demostrar el flujo completo sin depender de llaves de producción."),
        bullet("ASP.NET Core Web API (C#): orquestación de órdenes, precios, pagos, YAuctions, recomendaciones y BI."),
        bullet("SQL Server (producción) / SQLite (ambiente académico local): persistencia relacional de perfiles, catálogo intermediado, órdenes, pagos y eventos de integración."),
        h2("3.2 Servicios de aplicación"),
        bullet("AuthService / TokenService: emisión y validación de identidad; perfil de negocio en base de datos."),
        bullet("CatalogService / PricingService: búsqueda, ficha y conversión JPY→moneda local con margen."),
        bullet("OrderService: máquina de estados PendingPayment → Paid → Executing → Completed | Compensation."),
        bullet("WompiClient: creación de transacción, verificación de firma de webhook y simulación controlada en desarrollo."),
        bullet("YAuctionsClient: adaptador de ejecución de compra y registro de resultado."),
        bullet("RecommendationService: afinidad por categorías del historial + respaldo de destacados."),
        bullet("BiService: KPIs y series para el tablero administrativo."),
        h2("3.3 Interfaces externas"),
        bullet("Wompi: checkout/widget + webhook firmado (entrada a la API)."),
        bullet("YAuctions: consulta/ejecución exclusivamente desde el backend."),
        bullet("Frontend ↔ API: REST JSON sobre HTTPS con Authorization Bearer."),
        h2("3.4 Vista de despliegue"),
        p("Zona pública: Firebase Hosting entrega el bundle Next.js. Zona de identidad: Firebase Authentication. Zona privada: API ASP.NET Core y motor SQL con secretos de entorno. Egresos HTTPS hacia Wompi y YAuctions; ingreso del webhook Wompi autenticado por firma. El frontend nunca posee credenciales de YAuctions ni secretos de webhook."),

        h1("4. Diagramas de la arquitectura propuesta"),
        p("Los diagramas UML y de arquitectura se entregan en la carpeta documentacion/Fase-II/diagramas en formato Mermaid (.mmd), importables a herramientas de modelado o a editores Markdown. Incluyen:"),
        bullet("01-arquitectura-componentes.mmd — vista de componentes (hardware/software/servicios externos)."),
        bullet("02-secuencia-compra.mmd — diagrama de secuencia del flujo extremo a extremo."),
        bullet("03-modelo-dominio.mmd — diagrama de clases del dominio."),
        bullet("04-estados-orden.mmd — máquina de estados de la orden."),
        bullet("05-erd.mmd — modelo entidad-relación."),
        h3("4.1 Descripción de la vista de componentes"),
        p("El canal multi-dispositivo (Next.js) se publica en Firebase Hosting y autentica con Firebase Authentication. Toda regla de negocio transaccional vive en la API. SQL Server concentra hechos. Wompi concentra cobro. YAuctions concentra origen y ejecución. Esta separación maximiza integridad, auditabilidad y modificabilidad de integraciones."),
        h3("4.2 Descripción de la secuencia de compra"),
        p("El usuario confirma el carrito; la API recotiza y crea la orden pendiente; Wompi autoriza el cobro; solo el webhook aprobado dispara YAuctions; el resultado actualiza historial y tableros. Si YAuctions rechaza, la orden entra en compensación sin fingir entrega."),

        h1("5. Prototipos visuales (wireframes y UI/UX)"),
        p("Se entregan wireframes HTML interactivos en documentacion/Fase-II/prototipos/wireframes-ui.html y la interfaz funcional implementada en codigo/frontend (Next.js). Decisiones de UX:"),
        bullet("Una sola composición de marca en el primer viewport (CompraLatino como señal dominante)."),
        bullet("Flujo corto: catálogo → ficha → carrito → checkout Wompi → historial."),
        bullet("Panel admin separado por rol, orientado a KPIs de decisión, no a decoración."),
        bullet("Diseño responsive con tipografía Fraunces + DM Sans y atmósfera visual propia (no plantilla genérica)."),

        h1("6. Presupuesto de implementación"),
        p("El presupuesto de implementación detalla la Fase II–VII a partir de la estimación de Fase I, actualizada a costos de puesta en marcha."),
        center("Tabla 1. Presupuesto de implementación (USD)", { italics: true }),
        table([
          ["Rubro", "Detalle", "USD"],
          ["Diseño técnico y UML", "Modelo datos, contratos, prototipos", "1,600"],
          ["API ASP.NET Core + SQL", "Dominio, estados, bitácoras", "2,800"],
          ["Frontend Next.js + Auth", "Responsive + Firebase Hosting", "2,400"],
          ["Integración Wompi", "Checkout, webhook, conciliación", "1,200"],
          ["Integración YAuctions", "Adaptador y compensaciones", "1,600"],
          ["Recomendaciones + Admin BI", "Motor historial y tableros", "1,400"],
          ["Pruebas y despliegue", "Seguridad, aceptación, go-live", "1,000"],
          ["Contingencia 10%", "Riesgos de integración", "1,200"],
          ["Total implementación", "", "13,200"],
        ]),
        p("Costo operativo mensual de arranque (sin comisiones Wompi): USD 40–160 (Hosting, Auth, App Service, SQL). Las comisiones Wompi son variables y se cubren con el margen de intermediación."),

        h1("7. Trazabilidad requisitos–componentes"),
        table([
          ["Requisito", "Componente principal", "Evidencia de diseño"],
          ["RF-01/02 Cuenta", "Firebase Auth + API perfil", "AuthService / login-register"],
          ["RF-03/04 Búsqueda", "Next.js + CatalogService", "Catálogo y ficha"],
          ["RF-05/06 Pago", "OrderService + WompiClient", "Checkout y webhook"],
          ["RF-07 YAuctions", "YAuctionsClient", "Adaptador backend"],
          ["RF-08/09 Historial", "SQL + RecommendationService", "Historial / Para ti"],
          ["RF-10/11/12 Admin", "BiService + Admin API", "Panel BI"],
        ]),

        h1("8. Cierre de la Fase II"),
        p("Con esta Fase II, CompraLatino dispone del diseño técnico suficiente para construir: componentes, interfaces, diagramas UML, prototipos UI/UX y presupuesto de implementación. La arquitectura elegida permanece alineada al enunciado y a la Fase I. La Fase III agrega la solución de inteligencia de negocios y el código fuente funcional de la primera versión."),

        h1("Referencias"),
        p("Bass, L., Clements, P., & Kazman, R. (2013). Software architecture in practice (3.ª ed.). Addison-Wesley."),
        p("Google. (s. f.). Firebase documentation. https://firebase.google.com/docs"),
        p("Microsoft. (s. f.). ASP.NET Core documentation. https://learn.microsoft.com/aspnet/core"),
        p("Object Management Group. (2017). Unified Modeling Language (UML) version 2.5.1."),
        p("Wompi. (s. f.). Documentación para desarrolladores. https://docs.wompi.co"),
      ],
    }],
  });

  const buf = await Packer.toBuffer(doc);
  const file = path.join(outDir2, "CompraLatino_Fase_II_Arquitectura_Tecnica.docx");
  fs.writeFileSync(file, buf);
  console.log("Wrote", file);
}

async function buildFase3() {
  const doc = new Document({
    ...commonHeaderFooter("Fase III"),
    sections: [{
      properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
      children: [
        ...cover({
          fase: "Fase III — Desarrollo, solución de BI y primera versión funcional",
          subtitle: "Documento acumulativo: arquitectura BI, prototipos de paneles, código fuente y conclusiones",
          date: "10 de octubre de 2026",
        }),
        h1("Índice"),
        p("1. Introducción"),
        p("2. Línea base acumulativa (Fases I y II)"),
        p("3. Descripción de la arquitectura de la solución de BI"),
        p("4. Prototipos de la solución de BI"),
        p("5. Descripción del código fuente funcional"),
        p("6. Conclusiones y recomendaciones"),
        p("Referencias"),
        new Paragraph({ children: [], pageBreak: true }),

        h1("1. Introducción"),
        p("Esta Fase III actualiza la introducción con el contenido de construcción: se entrega la primera versión funcional del software CompraLatino y se describe la solución de inteligencia de negocios (BI) necesaria para que la empresa gestione y monitoree la información generada, facilitando la toma de decisiones. El documento es acumulativo respecto de las Fases I y II e incorpora la evidencia de implementación en el repositorio de código."),
        p("La necesidad de conocimiento del caso de estudio no se limita a operar compras: CompraLatino debe saber qué se vende, dónde se pierde conversión de pago, dónde falla la ejecución en Japón y qué categorías impulsan la demanda. Por ello el BI no es un anexo decorativo, sino un producto analítico sobre los mismos hechos transaccionales."),

        h1("2. Línea base acumulativa (Fases I y II)"),
        p("Se mantienen objetivos, SRS (RF-01–RF-12), viabilidad, arquitectura cliente-servidor en capas, integraciones Wompi/YAuctions y diseño UML/UI de Fase II. El código fuente implementa esa línea base en un monorepo con backend ASP.NET Core y frontend Next.js, listo para demostración académica y evolución a Firebase Auth + SQL Server administrado en producción."),

        h1("3. Descripción de la arquitectura de la solución de BI"),
        h2("3.1 Enfoque"),
        p("Se adopta un BI operacional embebido: el almacén analítico de arranque es el mismo SQL Server (o SQLite en demo) que registra órdenes, pagos y eventos de integración. Un servicio BiService materializa KPIs y series mediante consultas agregadas expuestas por endpoints administrativos protegidos por rol. Esta decisión evita, en la primera versión, un data warehouse separado, reduciendo costo y latencia de decisión para el volumen inicial."),
        h2("3.2 Estructuras de datos"),
        bullet("Hechos: Order, OrderItem, Payment, IntegrationEvent."),
        bullet("Dimensiones naturales: fecha (CreatedAtUtc), categoría (CategorySnapshot), estado de orden, estado de pago, proveedor de integración (Wompi/YAuctions), usuario."),
        bullet("Indicadores: órdenes totales, ingresos de órdenes completadas, tasa de aprobación Wompi, tasa de éxito YAuctions, órdenes en compensación, clientes con compra, ventas por día, top categorías, embudo de pago."),
        h2("3.3 Plataformas y tecnologías"),
        bullet("Origen: API ASP.NET Core + EF Core + SQL."),
        bullet("Servicio semántico: BiService (agregaciones)."),
        bullet("Consumo: panel Next.js /admin con autorización Admin."),
        bullet("Evolución recomendada: vistas materializadas o Power BI/Metabase sobre réplica de lectura cuando el volumen lo justifique."),
        h2("3.4 Calidad y gobierno"),
        p("Los indicadores se calculan solo sobre hechos persistidos tras webhooks y adaptadores, no sobre clics de vitrina. El rol Admin es obligatorio. Las bitácoras de integración permiten auditar discrepancias entre pago aprobado y ejecución fallida."),

        h1("4. Prototipos"),
        p("Se entregan esquemas descriptivos del producto final y de los paneles BI en:"),
        bullet("documentacion/Fase-III/prototipos-bi/paneles-bi.html"),
        bullet("Aplicación funcional: codigo/frontend/src/app/admin (KPIs, series y tabla de órdenes)."),
        p("Los paneles componen: tarjetas KPI, ventas por día, top categorías, embudo Wompi y resultados YAuctions. El producto final de tienda (catálogo, cuenta, checkout, historial, recomendaciones) está implementado en las rutas del frontend."),

        h1("5. Descripción del código fuente funcional"),
        p("El código fuente se organiza en:"),
        bullet("codigo/backend — API CompraLatino.Api (.NET), dominio, servicios, controladores, seed de catálogo y usuarios demo."),
        bullet("codigo/frontend — Next.js 15 + TypeScript + Tailwind, UI responsive sin comentarios en el código fuente."),
        bullet("documentacion — Fases I–III, diagramas y prototipos."),
        p("Cuentas demo: cliente@demo.com / Cliente123! y admin@compralatino.com / Admin123!. El checkout simula Wompi (approve/decline) y dispara el adaptador YAuctions. El repositorio público queda alojado en la cuenta GitHub del estudiante (FTranly / Zank123-F), no en cuentas corporativas ajenas al curso."),

        h1("6. Conclusiones y recomendaciones"),
        h2("6.1 Conclusiones"),
        p("1. Es viable construir CompraLatino como intermediario digital con separación clara entre vitrina (Next.js/Firebase) y núcleo transaccional (API C#/SQL)."),
        p("2. El diseño de estados de orden y adaptadores permite absorber fallas de Wompi o YAuctions sin corrupar la verdad operativa."),
        p("3. La solución BI embebida satisface la necesidad de conocimiento del caso de estudio en la primera versión, con KPIs accionables para operación diaria."),
        p("4. El código funcional demuestra cuenta, búsqueda multi-dispositivo, cobro, ejecución remota, recomendaciones por historial y monitoreo administrativo."),
        h2("6.2 Recomendaciones"),
        bullet("Completar afiliación real a Wompi y contrato de interfaz YAuctions antes del go-live."),
        bullet("Sustituir el JWT de desarrollo por validación de ID token de Firebase Authentication en producción."),
        bullet("Migrar SQLite de demo a Azure SQL / SQL Server administrado con respaldos."),
        bullet("Definir runbook de compensación (reintento, reembolso, soporte) con dueño de negocio."),
        bullet("Cuando crezca el volumen, separar réplica analítica o conectar Power BI sin alterar el OLTP."),
        bullet("Incorporar pruebas automatizadas de webhook, idempotencia y autorización de rol Admin."),

        h1("Referencias"),
        p("Kimball, R., & Ross, M. (2013). The data warehouse toolkit (3.ª ed.). Wiley."),
        p("Microsoft. (s. f.). Business intelligence documentation. https://learn.microsoft.com/analysis-services"),
        p("Pressman, R. S., & Maxim, B. R. (2020). Software engineering: A practitioner’s approach (9.ª ed.). McGraw-Hill."),
        p("Bass, L., Clements, P., & Kazman, R. (2013). Software architecture in practice (3.ª ed.). Addison-Wesley."),
      ],
    }],
  });

  const buf = await Packer.toBuffer(doc);
  const file = path.join(outDir3, "CompraLatino_Fase_III_BI_y_Desarrollo.docx");
  fs.writeFileSync(file, buf);
  console.log("Wrote", file);
}

(async () => {
  await buildFase2();
  await buildFase3();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
