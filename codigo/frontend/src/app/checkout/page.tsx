"use client";

import { useEffect, useState } from "react";
import { api, getAuth, getCart, money, saveCart, syncUi } from "@/lib/api";

export default function CheckoutPage() {
  const [status, setStatus] = useState("Preparando orden y transaccion Wompi...");
  const [tx, setTx] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function run() {
      if (!getAuth()) { window.location.href = "/login"; return; }
      const cart = getCart();
      if (cart.length === 0) { window.location.href = "/carrito"; return; }
      const result = await api.checkout(cart.map((c) => ({ productId: c.product.id, quantity: c.quantity })));
      setTx(result.wompiTransactionId);
      setOrderCode(result.order.code);
      setTotal(result.order.totalLocal);
      setStatus("Orden creada. Confirma el resultado del cobro Wompi.");
    }
    void run();
  }, []);

  async function pay(approved: boolean) {
    setStatus(approved ? "Confirmando pago y ejecutando compra en YAuctions..." : "Registrando declinacion...");
    await api.simulatePayment(tx, approved ? "Approved" : "Declined");
    saveCart([]);
    syncUi();
    window.location.href = "/historial";
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="surface p-6">
        <h1 className="font-display text-4xl">Checkout Wompi</h1>
        <p className="mt-2 text-sm text-slate-600">{status}</p>
        {orderCode && (
          <div className="mt-5 rounded-xl bg-[color:var(--paper-2)] p-4 text-sm">
            <p>Orden: <strong>{orderCode}</strong></p>
            <p>Transaccion: <strong>{tx}</strong></p>
            <p>Total: <strong>{money(total)}</strong></p>
          </div>
        )}
        {tx && (
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="btn" onClick={() => void pay(true)}>Aprobar pago</button>
            <button className="btn-secondary" onClick={() => void pay(false)}>Declinar pago</button>
          </div>
        )}
      </div>
    </div>
  );
}