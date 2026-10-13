"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Product, api, getCart, money, saveCart } from "@/lib/api";

export default function ProductoPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.product(Number(params.id))
      .then(setProduct)
      .catch((err) => setError(err instanceof Error ? err.message : "Producto no encontrado"));
  }, [params.id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!product) return <p>Cargando...</p>;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="panel overflow-hidden">
        <div className="min-h-[320px] bg-slate-200" style={{ backgroundImage: `url(${product.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      </div>
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-wide text-[#1f6f8b]">{product.category}</p>
        <h1 className="font-display text-3xl text-[#0b1f33]">{product.title}</h1>
        <p className="text-slate-600">{product.description}</p>
        <div className="panel p-4">
          <p className="text-sm text-slate-500">Precio origen</p>
          <p className="text-lg">JPY {product.priceJpy.toLocaleString()}</p>
          <p className="mt-2 text-sm text-slate-500">Precio cobro estimado</p>
          <p className="text-2xl font-semibold text-[#c45c26]">{money(product.priceLocal, product.currency)}</p>
          <p className="mt-1 text-xs text-slate-500">Tasa FX {product.fxRate} · ID YAuctions {product.externalId}</p>
        </div>
        <button
          className="btn"
          onClick={() => {
            const cart = getCart();
            const existing = cart.find((c) => c.product.id === product.id);
            if (existing) existing.quantity += 1;
            else cart.push({ product, quantity: 1 });
            saveCart(cart);
            window.dispatchEvent(new Event("cl-sync"));
            window.location.href = "/carrito";
          }}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}