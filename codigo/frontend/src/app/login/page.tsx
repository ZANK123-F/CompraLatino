"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { api, saveAuth } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("cliente@demo.com");
  const [password, setPassword] = useState("Cliente123!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await api.login(email, password);
      saveAuth(user);
      window.dispatchEvent(new Event("cl-sync"));
      window.location.href = user.role === "Admin" ? "/admin" : "/catalogo";
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md panel p-6">
      <h1 className="font-display text-3xl text-[#0b1f33]">Entrar</h1>
      <p className="mt-1 text-sm text-slate-600">Demo: cliente@demo.com / Cliente123!</p>
      <form className="mt-6 space-y-3" onSubmit={onSubmit}>
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn w-full" disabled={loading}>{loading ? "Entrando..." : "Iniciar sesion"}</button>
      </form>
      <p className="mt-4 text-sm">
        ¿No tienes cuenta? <Link className="text-[#1f6f8b]" href="/register">Registrate</Link>
      </p>
    </div>
  );
}
