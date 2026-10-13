"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Product, api, getCart, money, saveCart, syncUi } from "@/lib/api";

export default function ProductoPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    api.product(Number(params.id)).then(setProduct);
  }, [params.id]);

  if (!product) return <div className="surface p-6">Cargando ficha...</div>;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="surface overflow-hidden">
        <div className="min-h-[420px] bg-slate-200" style={{ backgroundImage: `url(${product.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      </div>
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--sea)]">{product.category}</p>
        <h1 className="font-display text-4xl">{product.title}</h1>
        <p className="text-slate-600">{product.description}</p>
        <div className="surface p-5">
          <p className="text-sm text-slate-500">Precio origen YAuctions</p>
          <p className="text-lg font-semibold">JPY {product.priceJpy.toLocaleString()}</p>
          <p className="mt-3 text-sm text-slate-500">Precio de cobro estimado</p>
          <p className="text-3xl font-bold text-[color:var(--accent)]">{money(product.priceLocal, product.currency)}</p>
          <p className="mt-2 text-xs text-slate-500">FX {product.fxRate} · External ID {product.externalId}</p>
        </div>
        <button
          className="btn"
          onClick={() => {
            const cart = getCart();
            const existing = cart.find((c) => c.product.id === product.id);
            if (existing) existing.quantity += 1;
            else cart.push({ product, quantity: 1 });
            saveCart(cart);
            syncUi();
            window.location.href = "/carrito";
          }}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}