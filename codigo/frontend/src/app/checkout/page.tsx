"use client";

import { useEffect, useState } from "react";
import { api, getAuth, getCart, money, saveCart } from "@/lib/api";

export default function CheckoutPage() {
  const [status, setStatus] = useState("Preparando orden...");
  const [error, setError] = useState("");
  const [tx, setTx] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function run() {
      if (!getAuth()) {
        window.location.href = "/login";
        return;
      }
      const cart = getCart();
      if (cart.length === 0) {
        window.location.href = "/carrito";
        return;
      }
      try {
        const result = await api.checkout(cart.map((c) => ({ productId: c.product.id, quantity: c.quantity })));
        setTx(result.wompiTransactionId);
        setOrderCode(result.order.code);
        setTotal(result.order.totalLocal);
        setStatus("Orden creada. Confirma el pago simulado de Wompi.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo crear la orden");
      }
    }
    run();
  }, []);

  async function pay(approved: boolean) {
    try {
      setStatus(approved ? "Confirmando pago y ejecutando YAuctions..." : "Registrando declinacion...");
      await api.simulatePayment(tx, approved ? "Approved" : "Declined");
      saveCart([]);
      window.dispatchEvent(new Event("cl-sync"));
      window.location.href = "/historial";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fallo el pago");
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-4 panel p-6">
      <h1 className="font-display text-3xl text-[#0b1f33]">Checkout Wompi</h1>
      <p className="text-sm text-slate-600">{status}</p>
      {orderCode && (
        <div className="rounded-lg bg-[#e8eef3] p-4 text-sm">
          <p>Orden: <strong>{orderCode}</strong></p>
          <p>Transaccion: <strong>{tx}</strong></p>
          <p>Total: <strong>{money(total)}</strong></p>
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {tx && (
        <div className="flex gap-3">
          <button className="btn" onClick={() => pay(true)}>Aprobar pago</button>
          <button className="btn-ghost" onClick={() => pay(false)}>Declinar</button>
        </div>
      )}
    </div>
  );
}
