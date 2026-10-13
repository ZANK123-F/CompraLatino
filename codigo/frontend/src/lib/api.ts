import {
  mockAdmin,
  mockBi,
  mockCustomer,
  mockLogs,
  mockOrders,
  mockProducts,
  mockRecommendations,
  type IntegrationLog,
} from "./mock";
import type { AuthUser, BiDashboard, CartItem, Order, Product, Recommendation } from "./types";

export type { AuthUser, BiDashboard, CartItem, Order, Product, Recommendation, IntegrationLog };

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5062";

function authHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem("cl_auth");
  if (!raw) return {};
  const user = JSON.parse(raw) as AuthUser;
  return { Authorization: `Bearer ${user.token}` };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3500);
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
        ...(init?.headers || {}),
      },
    });
    if (!res.ok) throw new Error("request_failed");
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

async function withMock<T>(live: () => Promise<T>, mock: () => T): Promise<T> {
  try {
    return await live();
  } catch {
    return mock();
  }
}

export const api = {
  register: (email: string, password: string, fullName: string) =>
    withMock(
      () =>
        request<AuthUser>("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({ email, password, fullName }),
        }),
      () => ({
        ...mockCustomer,
        email,
        fullName,
        token: `mock-${Date.now()}`,
        firebaseUid: `uid-${Date.now()}`,
      })
    ),

  login: (email: string, password: string) =>
    withMock(
      () =>
        request<AuthUser>("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        }),
      () => {
        const normalized = email.trim().toLowerCase();
        if (normalized.includes("admin")) return { ...mockAdmin, email: normalized };
        return { ...mockCustomer, email: normalized };
      }
    ),

  products: (q?: string, category?: string) =>
    withMock(
      () => {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (category) params.set("category", category);
        const qs = params.toString();
        return request<Product[]>(`/api/products${qs ? `?${qs}` : ""}`);
      },
      () => {
        let items = [...mockProducts];
        if (q) {
          const term = q.toLowerCase();
          items = items.filter(
            (p) => p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
          );
        }
        if (category) items = items.filter((p) => p.category === category);
        return items;
      }
    ),

  product: (id: number) =>
    withMock(
      () => request<Product>(`/api/products/${id}`),
      () => mockProducts.find((p) => p.id === id) || mockProducts[0]
    ),

  checkout: (items: Array<{ productId: number; quantity: number }>) =>
    withMock(
      () =>
        request<{ order: Order; checkoutUrl: string; wompiTransactionId: string }>("/api/orders/checkout", {
          method: "POST",
          body: JSON.stringify({ items }),
        }),
      () => {
        const lines = items.map((i) => {
          const product = mockProducts.find((p) => p.id === i.productId) || mockProducts[0];
          return {
            productId: product.id,
            title: product.title,
            category: product.category,
            quantity: i.quantity,
            unitPriceLocal: product.priceLocal,
            unitPriceJpy: product.priceJpy,
          };
        });
        const total = lines.reduce((a, b) => a + b.unitPriceLocal * b.quantity, 0);
        const tx = `wompi_mock_${Date.now()}`;
        const order: Order = {
          id: Date.now(),
          code: `CL-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(Math.random() * 900000 + 100000)}`,
          status: "PendingPayment",
          totalLocal: Number(total.toFixed(2)),
          currency: "USD",
          createdAtUtc: new Date().toISOString(),
          items: lines,
          payment: {
            wompiTransactionId: tx,
            status: "Pending",
            amount: Number(total.toFixed(2)),
            currency: "USD",
          },
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("cl_last_order", JSON.stringify(order));
        }
        return { order, checkoutUrl: `/checkout?tx=${tx}`, wompiTransactionId: tx };
      }
    ),

  myOrders: () =>
    withMock(
      () => request<Order[]>("/api/orders/mine"),
      () => {
        const extra =
          typeof window !== "undefined" ? localStorage.getItem("cl_last_order") : null;
        const local = extra ? [JSON.parse(extra) as Order] : [];
        return [...local, ...mockOrders];
      }
    ),

  recommendations: () =>
    withMock(
      () => request<Recommendation[]>("/api/recommendations"),
      () => mockRecommendations
    ),

  simulatePayment: (transactionId: string, status = "Approved") =>
    withMock(
      () =>
        request<Order>("/api/payments/wompi/simulate", {
          method: "POST",
          body: JSON.stringify({ transactionId, status }),
        }),
      () => {
        const raw = typeof window !== "undefined" ? localStorage.getItem("cl_last_order") : null;
        const base = raw ? (JSON.parse(raw) as Order) : mockOrders[0];
        const updated: Order = {
          ...base,
          status: status === "Approved" ? "Completed" : "Declined",
          payment: {
            wompiTransactionId: transactionId,
            status,
            amount: base.totalLocal,
            currency: base.currency,
          },
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("cl_last_order", JSON.stringify(updated));
        }
        return updated;
      }
    ),

  biDashboard: () => withMock(() => request<BiDashboard>("/api/admin/bi/dashboard"), () => mockBi),

  adminOrders: () =>
    withMock(
      () => request<Order[]>("/api/admin/orders"),
      () => mockOrders
    ),

  integrationLogs: async (): Promise<IntegrationLog[]> =>
    withMock(async () => mockLogs, () => mockLogs),
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

export function syncUi() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("cl-sync"));
}
