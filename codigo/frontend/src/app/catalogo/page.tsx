"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Product, api, getCart, money, saveCart } from "@/lib/api";

export default function CatalogoPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setProducts(await api.products(q || undefined, category || undefined));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el catalogo");
    }
  }, [q, category]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-[#0b1f33]">Catalogo YAuctions</h1>
        <p className="text-sm text-slate-600">Busca y compra desde computadora, tablet o smartphone.</p>
      </div>
      <div className="panel flex flex-col gap-3 p-4 md:flex-row">
        <input className="input" placeholder="Buscar producto" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input md:max-w-xs" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Todas las categorias</option>
          <option value="Coleccionables">Coleccionables</option>
          <option value="Electronica">Electronica</option>
          <option value="Moda">Moda</option>
          <option value="Hogar">Hogar</option>
          <option value="Musica">Musica</option>
        </select>
        <button className="btn" onClick={() => void load()}>Buscar</button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <article key={p.id} className="panel overflow-hidden">
            <Link href={`/producto/${p.id}`}>
              <div className="h-44 bg-slate-200" style={{ backgroundImage: `url(${p.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }} />
            </Link>
            <div className="space-y-2 p-4">
              <p className="text-xs uppercase tracking-wide text-[#1f6f8b]">{p.category}</p>
              <h2 className="font-medium">{p.title}</h2>
              <p className="text-sm text-slate-500">JPY {p.priceJpy.toLocaleString()} · {money(p.priceLocal, p.currency)}</p>
              <div className="flex gap-2">
                <Link className="btn-ghost" href={`/producto/${p.id}`}>Ver</Link>
                <button
                  className="btn"
                  onClick={() => {
                    const cart = getCart();
                    const existing = cart.find((c) => c.product.id === p.id);
                    if (existing) existing.quantity += 1;
                    else cart.push({ product: p, quantity: 1 });
                    saveCart(cart);
                    window.dispatchEvent(new Event("cl-sync"));
                  }}
                >
                  Agregar
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}