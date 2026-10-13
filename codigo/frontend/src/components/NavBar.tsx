"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthUser, clearAuth, getAuth, getCart } from "@/lib/api";

export default function NavBar() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setUser(getAuth());
    setCartCount(getCart().reduce((a, b) => a + b.quantity, 0));
    const sync = () => {
      setUser(getAuth());
      setCartCount(getCart().reduce((a, b) => a + b.quantity, 0));
    };
    window.addEventListener("storage", sync);
    window.addEventListener("cl-sync", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("cl-sync", sync);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b1f33]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-display text-xl tracking-wide text-[#f3e6c8]">
          CompraLatino
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
          <Link href="/catalogo">Catalogo</Link>
          <Link href="/recomendaciones">Para ti</Link>
          <Link href="/historial">Historial</Link>
          <Link href="/carrito">Carrito ({cartCount})</Link>
          {user?.role === "Admin" && <Link href="/admin">Admin BI</Link>}
          {user ? (
            <button
              className="rounded-md bg-[#c45c26] px-3 py-1.5 text-white"
              onClick={() => {
                clearAuth();
                window.dispatchEvent(new Event("cl-sync"));
                window.location.href = "/";
              }}
            >
              Salir
            </button>
          ) : (
            <>
              <Link href="/login">Entrar</Link>
              <Link className="rounded-md bg-[#c45c26] px-3 py-1.5 text-white" href="/register">
                Crear cuenta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
