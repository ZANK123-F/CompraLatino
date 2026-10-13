"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Recommendation, api, getAuth, money } from "@/lib/api";

export default function RecomendacionesPage() {
  const [items, setItems] = useState<Recommendation[]>([]);
  useEffect(() => {
    if (!getAuth()) { window.location.href = "/login"; return; }
    api.recommendations().then(setItems);
  }, []);

  return (
    <div className="space-y-6">
      <div className="surface p-6">
        <h1 className="font-display text-4xl">Recomendados para ti</h1>
        <p className="mt-2 text-sm text-slate-600">Sugerencias generadas a partir de tu historial de compras.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link key={item.productId} href={`/producto/${item.productId}`} className="surface overflow-hidden">
            <div className="h-44 bg-slate-200" style={{ backgroundImage: `url(${item.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }} />
            <div className="space-y-1 p-4">
              <p className="text-xs font-semibold text-[color:var(--sea)]">{item.reason}</p>
              <h2 className="font-semibold">{item.title}</h2>
              <p className="text-sm text-slate-500">{item.category}</p>
              <p className="font-bold text-[color:var(--accent)]">{money(item.priceLocal)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}