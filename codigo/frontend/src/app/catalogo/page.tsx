"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Product, api, getCart, money, saveCart, syncUi } from "@/lib/api";

function CatalogoInner() {
  const params = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("category") || "");

  useEffect(() => {
    api.products(q || undefined, category || undefined).then(setProducts);
  }, [q, category]);

  return (
    <div className="space-y-6">
      <div className="surface p-6">
        <h1 className="font-display text-4xl">Catalogo intermediado</h1>
        <p className="mt-2 text-sm text-slate-600">Busca productos de YAuctions y agrega al carrito.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_220px_auto]">
          <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre o descripcion" />
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Todas las categorias</option>
            <option value="Electronica">Electronica</option>
            <option value="Moda">Moda</option>
            <option value="Coleccionables">Coleccionables</option>
            <option value="Hogar">Hogar</option>
            <option value="Musica">Musica</option>
          </select>
          <button className="btn" onClick={() => api.products(q || undefined, category || undefined).then(setProducts)}>Buscar</button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <article key={p.id} className="surface overflow-hidden">
            <Link href={`/producto/${p.id}`}>
              <div className="h-48 bg-slate-200" style={{ backgroundImage: `url(${p.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }} />
            </Link>
            <div className="space-y-3 p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--sea)]">{p.category}</p>
                <h2 className="mt-1 font-semibold">{p.title}</h2>
                <p className="mt-1 text-sm text-slate-500">JPY {p.priceJpy.toLocaleString()} · {money(p.priceLocal, p.currency)}</p>
              </div>
              <div className="flex gap-2">
                <Link className="btn-secondary" href={`/producto/${p.id}`}>Ver ficha</Link>
                <button className="btn" onClick={() => {
                  const cart = getCart();
                  const existing = cart.find((c) => c.product.id === p.id);
                  if (existing) existing.quantity += 1;
                  else cart.push({ product: p, quantity: 1 });
                  saveCart(cart);
                  syncUi();
                }}>Agregar</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={<div className="surface p-6">Cargando catalogo...</div>}>
      <CatalogoInner />
    </Suspense>
  );
}