"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Recommendation, api, getAuth, money } from "@/lib/api";

export default function RecomendacionesPage() {
  const [items, setItems] = useState<Recommendation[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getAuth()) {
      window.location.href = "/login";
      return;
    }
    api.recommendations().then(setItems).catch((err) => setError(err instanceof Error ? err.message : "Error"));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-[#0b1f33]">Recomendados para ti</h1>
      <p className="text-sm text-slate-600">Sugerencias basadas en tu historial de compras.</p>
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link key={item.productId} href={`/producto/${item.productId}`} className="panel overflow-hidden">
            <div className="h-40 bg-slate-200" style={{ backgroundImage: `url(${item.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }} />
            <div className="space-y-1 p-4">
              <p className="text-xs text-[#1f6f8b]">{item.reason}</p>
              <h2 className="font-medium">{item.title}</h2>
              <p className="text-sm text-slate-500">{item.category}</p>
              <p className="font-semibold text-[#c45c26]">{money(item.priceLocal)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
