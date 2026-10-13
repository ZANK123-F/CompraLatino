import type { AuthUser, BiDashboard, Order, Product, Recommendation } from "./types";

export const mockProducts: Product[] = [
  {
    id: 1,
    externalId: "YA-1001",
    title: "Figura coleccionable edicion limitada",
    category: "Coleccionables",
    description: "Figura importada desde YAuctions con embalaje original y certificado de autenticidad.",
    imageUrl: "https://images.unsplash.com/photo-1601814938122-77c0d41d4f5a?w=900",
    priceJpy: 12800,
    priceLocal: 102.53,
    fxRate: 0.0068,
    currency: "USD",
  },
  {
    id: 2,
    externalId: "YA-1002",
    title: "Camara compacta usada premium",
    category: "Electronica",
    description: "Camara compacta en excelente estado, lote japones revisado.",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900",
    priceJpy: 45500,
    priceLocal: 359.26,
    fxRate: 0.0068,
    currency: "USD",
  },
  {
    id: 3,
    externalId: "YA-1003",
    title: "Reloj automatico vintage",
    category: "Moda",
    description: "Reloj mecanico con pulsera de acero, subasta rapida.",
    imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=900",
    priceJpy: 28900,
    priceLocal: 239.45,
    fxRate: 0.0068,
    currency: "USD",
  },
  {
    id: 4,
    externalId: "YA-1004",
    title: "Consola retro portatil",
    category: "Electronica",
    description: "Consola portatil restaurada con juegos incluidos.",
    imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=900",
    priceJpy: 19800,
    priceLocal: 158.72,
    fxRate: 0.0068,
    currency: "USD",
  },
  {
    id: 5,
    externalId: "YA-1005",
    title: "Kit de cocina japonesa",
    category: "Hogar",
    description: "Set de cuchillos y utensilios de marca japonesa.",
    imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=900",
    priceJpy: 15600,
    priceLocal: 124.26,
    fxRate: 0.0068,
    currency: "USD",
  },
  {
    id: 6,
    externalId: "YA-1006",
    title: "Vinilo edicion japonesa",
    category: "Musica",
    description: "Disco de vinilo importado con obi strip original.",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=900",
    priceJpy: 4200,
    priceLocal: 35.7,
    fxRate: 0.0068,
    currency: "USD",
  },
  {
    id: 7,
    externalId: "YA-1007",
    title: "Lente fotografico usado",
    category: "Electronica",
    description: "Lente compatible con monturas populares, revision optica.",
    imageUrl: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=900",
    priceJpy: 67200,
    priceLocal: 525.05,
    fxRate: 0.0068,
    currency: "USD",
  },
  {
    id: 8,
    externalId: "YA-1008",
    title: "Bolso de disenador outlet",
    category: "Moda",
    description: "Articulo de moda con autenticidad verificada en origen.",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900",
    priceJpy: 33400,
    priceLocal: 274.98,
    fxRate: 0.0068,
    currency: "USD",
  },
];

export const mockCustomer: AuthUser = {
  token: "mock-customer-token",
  email: "cliente@demo.com",
  fullName: "Cliente Demo",
  role: "Customer",
  firebaseUid: "uid-cliente-001",
};

export const mockAdmin: AuthUser = {
  token: "mock-admin-token",
  email: "admin@compralatino.com",
  fullName: "Admin CompraLatino",
  role: "Admin",
  firebaseUid: "uid-admin-001",
};

export const mockOrders: Order[] = [
  {
    id: 101,
    code: "CL-20261010-482193",
    status: "Completed",
    totalLocal: 261.25,
    currency: "USD",
    createdAtUtc: new Date(Date.now() - 86400000 * 2).toISOString(),
    items: [
      {
        productId: 1,
        title: "Figura coleccionable edicion limitada",
        category: "Coleccionables",
        quantity: 1,
        unitPriceLocal: 102.53,
        unitPriceJpy: 12800,
      },
      {
        productId: 4,
        title: "Consola retro portatil",
        category: "Electronica",
        quantity: 1,
        unitPriceLocal: 158.72,
        unitPriceJpy: 19800,
      },
    ],
    payment: {
      wompiTransactionId: "wompi_demo_approved_101",
      status: "Approved",
      amount: 261.25,
      currency: "USD",
    },
  },
  {
    id: 102,
    code: "CL-20261011-119844",
    status: "Compensation",
    totalLocal: 239.45,
    currency: "USD",
    createdAtUtc: new Date(Date.now() - 86400000).toISOString(),
    items: [
      {
        productId: 3,
        title: "Reloj automatico vintage",
        category: "Moda",
        quantity: 1,
        unitPriceLocal: 239.45,
        unitPriceJpy: 28900,
      },
    ],
    payment: {
      wompiTransactionId: "wompi_demo_approved_102",
      status: "Approved",
      amount: 239.45,
      currency: "USD",
    },
  },
  {
    id: 103,
    code: "CL-20261012-778201",
    status: "Paid",
    totalLocal: 35.7,
    currency: "USD",
    createdAtUtc: new Date().toISOString(),
    items: [
      {
        productId: 6,
        title: "Vinilo edicion japonesa",
        category: "Musica",
        quantity: 1,
        unitPriceLocal: 35.7,
        unitPriceJpy: 4200,
      },
    ],
    payment: {
      wompiTransactionId: "wompi_demo_pending_103",
      status: "Approved",
      amount: 35.7,
      currency: "USD",
    },
  },
];

export const mockRecommendations: Recommendation[] = mockProducts.slice(0, 4).map((p) => ({
  productId: p.id,
  title: p.title,
  category: p.category,
  imageUrl: p.imageUrl,
  priceLocal: p.priceLocal,
  reason: "Basado en tu historial de compras",
}));

export const mockBi: BiDashboard = {
  kpis: [
    { key: "orders", label: "Ordenes totales", value: 128, unit: "count" },
    { key: "revenue", label: "Ingresos aprobados", value: 18420.5, unit: "USD" },
    { key: "approval", label: "Tasa aprobacion Wompi", value: 91.4, unit: "%" },
    { key: "ya_success", label: "Exito YAuctions", value: 87.2, unit: "%" },
    { key: "compensation", label: "Ordenes en compensacion", value: 6, unit: "count" },
    { key: "customers", label: "Clientes con compra", value: 74, unit: "count" },
  ],
  salesByDay: [
    { label: "06/10", value: 820 },
    { label: "07/10", value: 1140 },
    { label: "08/10", value: 980 },
    { label: "09/10", value: 1560 },
    { label: "10/10", value: 1320 },
    { label: "11/10", value: 1785 },
    { label: "12/10", value: 1490 },
  ],
  topCategories: [
    { label: "Electronica", value: 6420 },
    { label: "Moda", value: 4180 },
    { label: "Coleccionables", value: 2910 },
    { label: "Hogar", value: 1840 },
    { label: "Musica", value: 970 },
  ],
  paymentFunnel: [
    { label: "Pendientes", value: 11 },
    { label: "Aprobados", value: 102 },
    { label: "Declinados", value: 15 },
  ],
  yAuctionsResults: [
    { label: "Exito", value: 94 },
    { label: "Rechazo", value: 14 },
  ],
};

export type IntegrationLog = {
  id: number;
  createdAtUtc: string;
  provider: "Wompi" | "YAuctions" | "API";
  action: string;
  result: string;
  orderCode: string;
  detail: string;
};

export const mockLogs: IntegrationLog[] = [
  {
    id: 1,
    createdAtUtc: new Date(Date.now() - 3600000).toISOString(),
    provider: "Wompi",
    action: "Webhook",
    result: "Approved",
    orderCode: "CL-20261012-778201",
    detail: "Pago confirmado y conciliado con orden",
  },
  {
    id: 2,
    createdAtUtc: new Date(Date.now() - 7200000).toISOString(),
    provider: "YAuctions",
    action: "ExecutePurchase",
    result: "Success",
    orderCode: "CL-20261010-482193",
    detail: "Compra ejecutada YAEXEC-202610101210-4412",
  },
  {
    id: 3,
    createdAtUtc: new Date(Date.now() - 10800000).toISOString(),
    provider: "YAuctions",
    action: "ExecutePurchase",
    result: "Rejected",
    orderCode: "CL-20261011-119844",
    detail: "Lote no disponible. Orden enviada a compensacion",
  },
  {
    id: 4,
    createdAtUtc: new Date(Date.now() - 14400000).toISOString(),
    provider: "Wompi",
    action: "CreateTransaction",
    result: "Pending",
    orderCode: "CL-20261012-778201",
    detail: "Transaccion creada para checkout",
  },
  {
    id: 5,
    createdAtUtc: new Date(Date.now() - 18000000).toISOString(),
    provider: "API",
    action: "Recotizar",
    result: "OK",
    orderCode: "CL-20261010-482193",
    detail: "FX 0.0068 aplicada con margen comercial",
  },
];
