"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { api, saveAuth } from "@/lib/api";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await api.register(email, password, fullName);
      saveAuth(user);
      window.dispatchEvent(new Event("cl-sync"));
      window.location.href = "/catalogo";
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md panel p-6">
      <h1 className="font-display text-3xl text-[#0b1f33]">Crear cuenta</h1>
      <form className="mt-6 space-y-3" onSubmit={onSubmit}>
        <input className="input" placeholder="Nombre completo" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        <input className="input" type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Contrasena" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn w-full" disabled={loading}>{loading ? "Creando..." : "Registrarme"}</button>
      </form>
      <p className="mt-4 text-sm">
        ¿Ya tienes cuenta? <Link className="text-[#1f6f8b]" href="/login">Entrar</Link>
      </p>
    </div>
  );
}
