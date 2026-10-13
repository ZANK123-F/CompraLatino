"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Product, api, money } from "@/lib/api";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.products().then((items) => setProducts(items.slice(0, 4))).catch(() => setProducts([]));
  }, []);

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl bg-[#0b1f33] text-[#f3e6c8]">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1555529902-5261145633bf?w=1600)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 max-w-xl px-8 py-16 md:px-12 md:py-20">
          <p className="font-display text-4xl leading-tight md:text-5xl">CompraLatino</p>
          <h1 className="mt-4 text-xl text-white/90 md:text-2xl">
            Compra en YAuctions Japon desde Latinoamerica
          </h1>
          <p className="mt-3 text-sm text-slate-200/90">
            Cuenta propia, cobro local con Wompi y ejecucion automatica en origen.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn" href="/catalogo">
              Explorar catalogo
            </Link>
            <Link className="btn-ghost border-white/30 bg-white/10 text-white hover:bg-white/20" href="/register">
              Crear cuenta
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-2xl text-[#0b1f33]">Destacados</h2>
          <Link href="/catalogo" className="text-sm text-[#1f6f8b]">
            Ver todo
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <Link key={p.id} href={`/producto/${p.id}`} className="panel overflow-hidden">
              <div
                className="h-40 bg-slate-200"
                style={{ backgroundImage: `url(${p.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
              />
              <div className="space-y-1 p-4">
                <p className="text-xs uppercase tracking-wide text-[#1f6f8b]">{p.category}</p>
                <h3 className="line-clamp-2 text-sm font-medium">{p.title}</h3>
                <p className="text-sm font-semibold text-[#c45c26]">{money(p.priceLocal, p.currency)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
