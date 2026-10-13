"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Product, api, money } from "@/lib/api";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.products().then((items) => setProducts(items.slice(0, 4)));
  }, []);

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[28px] border border-[color:var(--line)] bg-[color:var(--ink)] text-[color:var(--paper)] shadow-[0_20px_50px_rgba(16,38,61,0.2)]">
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1555529902-5261145633bf?w=1800)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#10263d] via-[#10263de6] to-transparent" />
        <div className="relative z-10 max-w-xl px-8 py-16 md:px-12 md:py-24">
          <p className="font-display text-5xl leading-none md:text-6xl">CompraLatino</p>
          <h1 className="mt-5 text-xl text-white/90 md:text-2xl">
            Compra en YAuctions Japon con cuenta local y cobro Wompi
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-200">
            Catalogo intermediado, ejecucion automatica en origen y seguimiento operativo para cada orden.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn" href="/catalogo">
              Explorar catalogo
            </Link>
            <Link className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/20" href="/register">
              Crear cuenta
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Cuenta propia", "Registro e identidad para historial, recomendaciones y seguimiento."],
          ["Cobro Wompi", "Pago local antes de disparar la compra en YAuctions."],
          ["Monitoreo", "Tableros y bitacoras para decisiones de operacion."],
        ].map(([title, text]) => (
          <article key={title} className="surface p-5">
            <h2 className="font-display text-2xl">{title}</h2>
            <p className="mt-2 text-sm text-slate-600">{text}</p>
          </article>
        ))}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl">Destacados del catalogo</h2>
            <p className="text-sm text-slate-600">Seleccion intermediada desde YAuctions.</p>
          </div>
          <Link className="btn-secondary" href="/catalogo">
            Ver todo
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <Link key={p.id} href={`/producto/${p.id}`} className="surface overflow-hidden transition hover:-translate-y-0.5">
              <div
                className="h-44 bg-slate-200"
                style={{ backgroundImage: `url(${p.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
              />
              <div className="space-y-1 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--sea)]">{p.category}</p>
                <h3 className="line-clamp-2 text-sm font-semibold">{p.title}</h3>
                <p className="text-sm font-bold text-[color:var(--accent)]">{money(p.priceLocal, p.currency)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
