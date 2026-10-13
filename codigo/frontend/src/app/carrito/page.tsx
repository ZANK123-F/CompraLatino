"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CartItem, getAuth, getCart, money, saveCart, syncUi } from "@/lib/api";

export default function CarritoPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => setItems(getCart()), []);
  const total = items.reduce((a, b) => a + b.product.priceLocal * b.quantity, 0);

  function update(id: number, quantity: number) {
    const next = getCart().map((x) => (x.product.id === id ? { ...x, quantity } : x)).filter((x) => x.quantity > 0);
    saveCart(next);
    setItems(next);
    syncUi();
  }

  return (
    <div className="space-y-6">
      <div className="surface p-6">
        <h1 className="font-display text-4xl">Carrito</h1>
        <p className="mt-2 text-sm text-slate-600">Revisa cantidades antes de iniciar el cobro con Wompi.</p>
      </div>
      {items.length === 0 ? (
        <div className="surface p-6">
          <p>Tu carrito esta vacio.</p>
          <Link className="btn mt-4" href="/catalogo">Ir al catalogo</Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.product.id} className="surface flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-xl bg-slate-200" style={{ backgroundImage: `url(${item.product.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                  <div>
                    <h2 className="font-semibold">{item.product.title}</h2>
                    <p className="text-sm text-slate-500">{money(item.product.priceLocal)} c/u</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input className="input w-24" type="number" min={1} value={item.quantity} onChange={(e) => update(item.product.id, Number(e.target.value))} />
                  <button className="btn-secondary" onClick={() => update(item.product.id, 0)}>Quitar</button>
                </div>
              </div>
            ))}
          </div>
          <div className="surface flex flex-wrap items-center justify-between gap-3 p-5">
            <p className="text-xl font-semibold">Total {money(total)}</p>
            <button className="btn" onClick={() => { if (!getAuth()) { window.location.href = "/login"; return; } window.location.href = "/checkout"; }}>
              Continuar a Wompi
            </button>
          </div>
        </>
      )}
    </div>
  );
}