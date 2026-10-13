"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Order, api, getAuth, money } from "@/lib/api";

export default function HistorialPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getAuth()) {
      window.location.href = "/login";
      return;
    }
    api.myOrders().then(setOrders).catch((err) => setError(err instanceof Error ? err.message : "Error"));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-[#0b1f33]">Historial de compras</h1>
      {error && <p className="text-red-600">{error}</p>}
      {orders.length === 0 ? (
        <div className="panel p-6">
          <p>Aun no tienes ordenes.</p>
          <Link className="btn mt-4" href="/catalogo">Comprar ahora</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <article key={o.id} className="panel p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-medium">{o.code}</h2>
                <span className="rounded-full bg-[#e8eef3] px-3 py-1 text-xs">{o.status}</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{new Date(o.createdAtUtc).toLocaleString()} · {money(o.totalLocal, o.currency)}</p>
              <p className="mt-1 text-sm">Pago Wompi: {o.payment?.status || "N/A"}</p>
              <ul className="mt-3 space-y-1 text-sm">
                {o.items.map((i, idx) => (
                  <li key={idx}>{i.quantity} x {i.title} ({money(i.unitPriceLocal)})</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
