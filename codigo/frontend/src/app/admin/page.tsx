"use client";

import { useEffect, useState } from "react";
import { BiDashboard, Order, api, getAuth, money } from "@/lib/api";

export default function AdminPage() {
  const [bi, setBi] = useState<BiDashboard | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getAuth();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (user.role !== "Admin") {
      setError("Acceso solo para administradores. Usa admin@compralatino.com / Admin123!");
      return;
    }
    Promise.all([api.biDashboard(), api.adminOrders()])
      .then(([dashboard, list]) => {
        setBi(dashboard);
        setOrders(list);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Error admin"));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!bi) return <p>Cargando panel BI...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-[#0b1f33]">Panel administrativo BI</h1>
        <p className="text-sm text-slate-600">Monitoreo de ordenes, pagos Wompi e integracion YAuctions.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bi.kpis.map((k) => (
          <div key={k.key} className="panel p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">{k.label}</p>
            <p className="mt-2 font-display text-3xl text-[#0b1f33]">
              {k.unit === "USD" ? money(k.value) : `${k.value}${k.unit === "%" ? "%" : ""}`}
            </p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartPanel title="Ventas por dia" points={bi.salesByDay} />
        <ChartPanel title="Top categorias" points={bi.topCategories} />
        <ChartPanel title="Embudo Wompi" points={bi.paymentFunnel} />
        <ChartPanel title="Resultados YAuctions" points={bi.yAuctionsResults} />
      </div>
      <section className="panel p-4">
        <h2 className="font-display text-xl">Ordenes recientes</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="py-2 pr-4">Codigo</th>
                <th className="py-2 pr-4">Estado</th>
                <th className="py-2 pr-4">Pago</th>
                <th className="py-2 pr-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-slate-100">
                  <td className="py-2 pr-4">{o.code}</td>
                  <td className="py-2 pr-4">{o.status}</td>
                  <td className="py-2 pr-4">{o.payment?.status}</td>
                  <td className="py-2 pr-4">{money(o.totalLocal, o.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ChartPanel({ title, points }: { title: string; points: Array<{ label: string; value: number }> }) {
  const max = Math.max(...points.map((p) => p.value), 1);
  return (
    <div className="panel p-4">
      <h2 className="font-display text-xl">{title}</h2>
      <div className="mt-4 space-y-2">
        {points.map((p) => (
          <div key={p.label}>
            <div className="mb-1 flex justify-between text-xs text-slate-600">
              <span>{p.label}</span>
              <span>{p.value}</span>
            </div>
            <div className="h-2 rounded bg-slate-100">
              <div className="h-2 rounded bg-[#1f6f8b]" style={{ width: `${(p.value / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
