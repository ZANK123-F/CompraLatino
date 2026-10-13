"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { api, saveAuth, syncUi } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("cliente@demo.com");
  const [password, setPassword] = useState("Cliente123!");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const user = await api.login(email, password);
    saveAuth(user);
    syncUi();
    window.location.href = user.role === "Admin" ? "/admin" : "/catalogo";
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="surface overflow-hidden">
        <div className="h-full min-h-[320px] bg-[color:var(--ink)] p-8 text-[color:var(--paper)]" style={{ backgroundImage: "linear-gradient(160deg, rgba(16,38,61,.92), rgba(15,110,122,.75)), url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200)", backgroundSize: "cover" }}>
          <p className="font-display text-4xl">Tu cuenta CompraLatino</p>
          <p className="mt-4 max-w-md text-sm text-slate-200">Accede para comprar, ver historial y recibir recomendaciones basadas en tus ordenes.</p>
        </div>
      </section>
      <section className="surface p-6">
        <h1 className="font-display text-3xl">Iniciar sesion</h1>
        <p className="mt-2 text-sm text-slate-600">Demo cliente: cliente@demo.com / Cliente123!</p>
        <p className="text-sm text-slate-600">Demo admin: admin@compralatino.com / Admin123!</p>
        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="btn w-full" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
        </form>
        <p className="mt-4 text-sm">¿No tienes cuenta? <Link className="text-[color:var(--sea)]" href="/register">Registrate</Link></p>
      </section>
    </div>
  );
}