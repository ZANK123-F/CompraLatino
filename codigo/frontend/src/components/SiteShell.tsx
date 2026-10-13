"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AuthUser, clearAuth, getAuth, getCart, syncUi } from "@/lib/api";

const categories = ["Electronica", "Moda", "Coleccionables", "Hogar", "Musica"];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setUser(getAuth());
      setCartCount(getCart().reduce((a, b) => a + b.quantity, 0));
    };
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("cl-sync", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("cl-sync", refresh);
    };
  }, []);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    window.location.href = `/catalogo?q=${encodeURIComponent(q)}`;
  }

  return (
    <div className="min-h-screen">
      <div className="border-b border-[color:var(--line)] bg-[color:var(--ink)] text-[color:var(--paper)]">
        <div className="shell flex flex-wrap items-center justify-between gap-2 py-2 text-xs">
          <p>Intermediacion YAuctions Japon · Cobro local con Wompi · Envio a Latinoamerica</p>
          <div className="flex items-center gap-3">
            <Link href="/historial">Seguimiento de ordenes</Link>
            <Link href="/admin">Centro operativo</Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-[color:var(--line)] bg-[color:var(--paper)]/95 backdrop-blur">
        <div className="shell py-3">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="font-display text-2xl font-bold tracking-tight text-[color:var(--ink)]">
              CompraLatino
            </Link>
            <form onSubmit={onSearch} className="hidden flex-1 md:flex">
              <input
                className="input rounded-r-none"
                placeholder="Buscar en el catalogo intermediado..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button className="btn rounded-l-none" type="submit">
                Buscar
              </button>
            </form>
            <div className="flex items-center gap-2">
              <Link className="btn-secondary" href="/carrito">
                Carrito ({cartCount})
              </Link>
              {user ? (
                <button
                  className="btn"
                  onClick={() => {
                    clearAuth();
                    syncUi();
                    window.location.href = "/";
                  }}
                >
                  Salir
                </button>
              ) : (
                <Link className="btn" href="/login">
                  Entrar
                </Link>
              )}
              <button className="btn-secondary md:hidden" onClick={() => setMenuOpen((v) => !v)}>
                Menu
              </button>
            </div>
          </div>

          <nav className={`mt-3 flex-wrap items-center gap-1 ${menuOpen ? "flex" : "hidden md:flex"}`}>
            <Link className="admin-link" href="/catalogo">
              Catalogo
            </Link>
            {categories.map((c) => (
              <Link key={c} className="admin-link" href={`/catalogo?category=${encodeURIComponent(c)}`}>
                {c}
              </Link>
            ))}
            <Link className="admin-link" href="/recomendaciones">
              Para ti
            </Link>
            <Link className="admin-link" href="/historial">
              Historial
            </Link>
            {user?.role === "Admin" && (
              <Link className="admin-link" href="/admin">
                Admin BI
              </Link>
            )}
            {!user && (
              <Link className="admin-link" href="/register">
                Crear cuenta
              </Link>
            )}
            {user && (
              <span className="ml-auto text-xs text-slate-500">
                {user.fullName} · {user.role}
              </span>
            )}
          </nav>
        </div>
      </header>

      {isAdmin ? (
        <div className="shell grid gap-6 py-8 lg:grid-cols-[240px_1fr]">
          <aside className="surface h-fit p-3">
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Operacion</p>
            <div className="flex flex-col gap-1">
              <Link className={pathname === "/admin" ? "admin-link-active" : "admin-link"} href="/admin">
                Tablero BI
              </Link>
              <Link className={pathname === "/admin/ordenes" ? "admin-link-active" : "admin-link"} href="/admin/ordenes">
                Ordenes
              </Link>
              <Link className={pathname === "/admin/bitacoras" ? "admin-link-active" : "admin-link"} href="/admin/bitacoras">
                Bitacoras
              </Link>
              <Link className="admin-link" href="/catalogo">
                Volver a tienda
              </Link>
            </div>
          </aside>
          <div>{children}</div>
        </div>
      ) : (
        <main className="shell py-8">{children}</main>
      )}

      <footer className="mt-10 border-t border-[color:var(--line)] bg-[color:var(--ink)] text-[color:var(--paper)]">
        <div className="shell grid gap-8 py-10 md:grid-cols-4">
          <div>
            <p className="font-display text-2xl">CompraLatino</p>
            <p className="mt-3 text-sm text-slate-300">
              Plataforma intermediaria para adquirir productos de YAuctions Japon con cuenta local y cobro Wompi.
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">Comprar</p>
            <div className="flex flex-col gap-2 text-sm text-slate-300">
              <Link href="/catalogo">Catalogo</Link>
              <Link href="/recomendaciones">Recomendaciones</Link>
              <Link href="/carrito">Carrito</Link>
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">Cuenta</p>
            <div className="flex flex-col gap-2 text-sm text-slate-300">
              <Link href="/login">Iniciar sesion</Link>
              <Link href="/register">Crear cuenta</Link>
              <Link href="/historial">Historial</Link>
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">Operacion</p>
            <div className="flex flex-col gap-2 text-sm text-slate-300">
              <Link href="/admin">Tablero BI</Link>
              <Link href="/admin/bitacoras">Bitacoras Wompi / YAuctions</Link>
              <p>Soporte: soporte@compralatino.com</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
