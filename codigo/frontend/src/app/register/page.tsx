"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { api, saveAuth, syncUi } from "@/lib/api";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const user = await api.register(email, password, fullName);
    saveAuth(user);
    syncUi();
    window.location.href = "/catalogo";
  }

  return (
    <div className="mx-auto max-w-lg surface p-6">
      <h1 className="font-display text-3xl">Crear cuenta</h1>
      <p className="mt-2 text-sm text-slate-600">Registrate para comprar y guardar tu historial.</p>
      <form className="mt-6 space-y-3" onSubmit={onSubmit}>
        <input className="input" placeholder="Nombre completo" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        <input className="input" type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Contrasena" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn w-full" disabled={loading}>{loading ? "Creando..." : "Crear cuenta"}</button>
      </form>
      <p className="mt-4 text-sm">¿Ya tienes cuenta? <Link className="text-[color:var(--sea)]" href="/login">Entrar</Link></p>
    </div>
  );
}