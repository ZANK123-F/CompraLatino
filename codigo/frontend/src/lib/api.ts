export type AuthUser = {
  token: string;
  email: string;
  fullName: string;
  role: string;
  firebaseUid: string;
};

export type Product = {
  id: number;
  externalId: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  priceJpy: number;
  priceLocal: number;
  fxRate: number;
  currency: string;
};

export type CartItem = { product: Product; quantity: number };

export type Order = {
  id: number;
  code: string;
  status: string;
  totalLocal: number;
  currency: string;
  createdAtUtc: string;
  items: Array<{
    productId: number;
    title: string;
    category: string;
    quantity: number;
    unitPriceLocal: number;
    unitPriceJpy: number;
  }>;
  payment?: {
    wompiTransactionId: string;
    status: string;
    amount: number;
    currency: string;
  } | null;
};

export type Recommendation = {
  productId: number;
  title: string;
  category: string;
  imageUrl: string;
  priceLocal: number;
  reason: string;
};

export type BiDashboard = {
  kpis: Array<{ key: string; label: string; value: number; unit: string }>;
  salesByDay: Array<{ label: string; value: number }>;
  topCategories: Array<{ label: string; value: number }>;
  paymentFunnel: Array<{ label: string; value: number }>;
  yAuctionsResults: Array<{ label: string; value: number }>;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5062";

function authHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem("cl_auth");
  if (!raw) return {};
  const user = JSON.parse(raw) as AuthUser;
  return { Authorization: `Bearer ${user.token}` };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    let message = "Error de solicitud";
    try {
      const body = await res.json();
      message = body.message || message;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}

export const api = {
  register: (email: string, password: string, fullName: string) =>
    request<AuthUser>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, fullName }),
    }),
  login: (email: string, password: string) =>
    request<AuthUser>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  products: (q?: string, category?: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    const qs = params.toString();
    return request<Product[]>(`/api/products${qs ? `?${qs}` : ""}`);
  },
  product: (id: number) => request<Product>(`/api/products/${id}`),
  checkout: (items: Array<{ productId: number; quantity: number }>) =>
    request<{ order: Order; checkoutUrl: string; wompiTransactionId: string }>("/api/orders/checkout", {
      method: "POST",
      body: JSON.stringify({ items }),
    }),
  myOrders: () => request<Order[]>("/api/orders/mine"),
  recommendations: () => request<Recommendation[]>("/api/recommendations"),
  simulatePayment: (transactionId: string, status = "Approved") =>
    request<Order>("/api/payments/wompi/simulate", {
      method: "POST",
      body: JSON.stringify({ transactionId, status }),
    }),
  biDashboard: () => request<BiDashboard>("/api/admin/bi/dashboard"),
  adminOrders: () => request<Order[]>("/api/admin/orders"),
};

export function saveAuth(user: AuthUser) {
  localStorage.setItem("cl_auth", JSON.stringify(user));
}

export function getAuth(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("cl_auth");
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

export function clearAuth() {
  localStorage.removeItem("cl_auth");
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("cl_cart");
  return raw ? (JSON.parse(raw) as CartItem[]) : [];
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem("cl_cart", JSON.stringify(items));
}

export function money(value: number, currency = "USD") {
  return new Intl.NumberFormat("es-SV", { style: "currency", currency }).format(value);
}

