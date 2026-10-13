"use client";

import { useEffect, useState } from "react";
import { BiDashboard, Order, api, getAuth, money } from "@/lib/api";

export default function AdminPage() {
  const [bi, setBi] = useState<BiDashboard | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const user = getAuth();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    Promise.all([api.biDashboard(), api.adminOrders()]).then(([dashboard, list]) => {
      setBi(dashboard);
      setOrders(list.slice(0, 6));
    });
  }, []);

  if (!bi) {
    return <div className="surface p-6">Cargando centro operativo...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="surface p-6">
        <h1 className="font-display text-4xl">Tablero BI</h1>
        <p className="mt-2 text-sm text-slate-600">
          Indicadores de ordenes, conversion Wompi y ejecucion YAuctions para toma de decisiones.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {bi.kpis.map((k) => (
          <div key={k.key} className="surface p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{k.label}</p>
            <p className="mt-3 font-display text-4xl">
              {k.unit === "USD" ? money(k.value) : `${k.value}${k.unit === "%" ? "%" : ""}`}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartPanel title="Ventas por dia" points={bi.salesByDay} />
        <ChartPanel title="Top categorias" points={bi.topCategories} />
        <ChartPanel title="Embudo Wompi" points={bi.paymentFunnel} />
        <ChartPanel title="Resultados YAuctions" points={bi.yAuctionsResults} />
      </div>

      <section className="surface overflow-hidden">
        <div className="border-b border-[color:var(--line)] px-5 py-4">
          <h2 className="font-display text-2xl">Ordenes recientes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[color:var(--paper-2)] text-slate-500">
              <tr>
                <th className="px-5 py-3">Codigo</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3">Pago</th>
                <th className="px-5 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-[color:var(--line)]">
                  <td className="px-5 py-3 font-medium">{o.code}</td>
                  <td className="px-5 py-3"><StatusBadge value={o.status} /></td>
                  <td className="px-5 py-3">{o.payment?.status}</td>
                  <td className="px-5 py-3">{money(o.totalLocal, o.currency)}</td>
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
    <div className="surface p-5">
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="mt-5 space-y-3">
        {points.map((p) => (
          <div key={p.label}>
            <div className="mb-1 flex justify-between text-xs text-slate-600">
              <span>{p.label}</span>
              <span>{p.value}</span>
            </div>
            <div className="h-2.5 rounded-full bg-[color:var(--paper-2)]">
              <div className="h-2.5 rounded-full bg-[color:var(--sea)]" style={{ width: `${(p.value / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ value }: { value: string }) {
  const cls =
    value === "Completed" ? "badge-ok" :
    value === "Compensation" || value === "PendingPayment" ? "badge-warn" :
    value === "Declined" || value === "Cancelled" ? "badge-bad" : "badge-info";
  return <span className={cls}>{value}</span>;
}