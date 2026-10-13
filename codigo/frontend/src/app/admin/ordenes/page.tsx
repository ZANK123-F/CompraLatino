"use client";

import { useEffect, useState } from "react";
import { Order, api, getAuth, money } from "@/lib/api";

export default function AdminOrdenesPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!getAuth()) {
      window.location.href = "/login";
      return;
    }
    api.adminOrders().then(setOrders);
  }, []);

  return (
    <div className="space-y-6">
      <div className="surface p-6">
        <h1 className="font-display text-4xl">Gestion de ordenes</h1>
        <p className="mt-2 text-sm text-slate-600">Listado operativo con estado de pago y ejecucion.</p>
      </div>
      <div className="space-y-3">
        {orders.map((o) => (
          <article key={o.id} className="surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{o.code}</h2>
                <p className="text-sm text-slate-500">{new Date(o.createdAtUtc).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{money(o.totalLocal, o.currency)}</p>
                <p className="text-sm text-slate-500">{o.status} · Wompi {o.payment?.status}</p>
              </div>
            </div>
            <ul className="mt-4 space-y-1 text-sm text-slate-700">
              {o.items.map((i, idx) => (
                <li key={idx}>{i.quantity} x {i.title}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}