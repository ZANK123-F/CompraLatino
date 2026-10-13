"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Order, api, getAuth, money } from "@/lib/api";

export default function HistorialPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    if (!getAuth()) { window.location.href = "/login"; return; }
    api.myOrders().then(setOrders);
  }, []);

  return (
    <div className="space-y-6">
      <div className="surface p-6">
        <h1 className="font-display text-4xl">Historial de compras</h1>
        <p className="mt-2 text-sm text-slate-600">Estados de pago, ejecucion y detalle de cada orden.</p>
      </div>
      {orders.length === 0 ? (
        <div className="surface p-6">
          <p>Aun no tienes ordenes.</p>
          <Link className="btn mt-4" href="/catalogo">Comprar ahora</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <article key={o.id} className="surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-semibold">{o.code}</h2>
                <span className="badge-info">{o.status}</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{new Date(o.createdAtUtc).toLocaleString()} · {money(o.totalLocal, o.currency)}</p>
              <p className="mt-1 text-sm">Pago Wompi: {o.payment?.status || "N/A"} · Tx {o.payment?.wompiTransactionId || "-"}</p>
              <ul className="mt-3 space-y-1 text-sm">
                {o.items.map((i, idx) => <li key={idx}>{i.quantity} x {i.title}</li>)}
              </ul>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}