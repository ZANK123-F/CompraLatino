"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CartItem, getAuth, getCart, money, saveCart } from "@/lib/api";

export default function CarritoPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const total = items.reduce((a, b) => a + b.product.priceLocal * b.quantity, 0);

  function update(id: number, quantity: number) {
    const next = getCart()
      .map((x) => (x.product.id === id ? { ...x, quantity } : x))
      .filter((x) => x.quantity > 0);
    saveCart(next);
    setItems(next);
    window.dispatchEvent(new Event("cl-sync"));
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-[#0b1f33]">Carrito</h1>
      {items.length === 0 ? (
        <div className="panel p-6">
          <p>Tu carrito esta vacio.</p>
          <Link className="btn mt-4" href="/catalogo">Ir al catalogo</Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.product.id} className="panel flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-medium">{item.product.title}</h2>
                  <p className="text-sm text-slate-500">{money(item.product.priceLocal)} c/u</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    className="input w-20"
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => update(item.product.id, Number(e.target.value))}
                  />
                  <button className="btn-ghost" onClick={() => update(item.product.id, 0)}>Quitar</button>
                </div>
              </div>
            ))}
          </div>
          <div className="panel flex items-center justify-between p-4">
            <p className="text-lg font-semibold">Total {money(total)}</p>
            <button
              className="btn"
              onClick={() => {
                if (!getAuth()) {
                  window.location.href = "/login";
                  return;
                }
                window.location.href = "/checkout";
              }}
            >
              Ir a pagar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
