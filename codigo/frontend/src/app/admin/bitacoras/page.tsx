"use client";

import { useEffect, useState } from "react";
import { IntegrationLog, api, getAuth } from "@/lib/api";

export default function BitacorasPage() {
  const [logs, setLogs] = useState<IntegrationLog[]>([]);

  useEffect(() => {
    if (!getAuth()) {
      window.location.href = "/login";
      return;
    }
    api.integrationLogs().then(setLogs);
  }, []);

  return (
    <div className="space-y-6">
      <div className="surface p-6">
        <h1 className="font-display text-4xl">Bitacoras de integracion</h1>
        <p className="mt-2 text-sm text-slate-600">
          Traza de eventos Wompi, YAuctions y recotizacion para auditoria operativa.
        </p>
      </div>
      <div className="surface overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[color:var(--paper-2)] text-slate-500">
            <tr>
              <th className="px-5 py-3">Fecha</th>
              <th className="px-5 py-3">Proveedor</th>
              <th className="px-5 py-3">Accion</th>
              <th className="px-5 py-3">Resultado</th>
              <th className="px-5 py-3">Orden</th>
              <th className="px-5 py-3">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t border-[color:var(--line)] align-top">
                <td className="px-5 py-3 whitespace-nowrap">{new Date(log.createdAtUtc).toLocaleString()}</td>
                <td className="px-5 py-3 font-medium">{log.provider}</td>
                <td className="px-5 py-3">{log.action}</td>
                <td className="px-5 py-3">{log.result}</td>
                <td className="px-5 py-3">{log.orderCode}</td>
                <td className="px-5 py-3 text-slate-600">{log.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}