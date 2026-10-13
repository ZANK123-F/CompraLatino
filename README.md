# CompraLatino

Plataforma intermediaria de comercio electronico para compras en YAuctions (Japon), con cobro Wompi, API ASP.NET Core, frontend Next.js y panel BI administrativo.

## Estructura

- `codigo/backend` — API .NET
- `codigo/frontend` — Next.js
- `documentacion/Fase-I` — Entrega Fase I
- `documentacion/Fase-II` — Arquitectura tecnica, UML, prototipos, presupuesto
- `documentacion/Fase-III` — Solucion BI, prototipos y conclusiones

## Requisitos

- .NET 10 SDK
- Node.js 20+

## Ejecutar backend

```bash
cd codigo/backend
dotnet run --launch-profile http
```

API: http://localhost:5062

## Ejecutar frontend

```bash
cd codigo/frontend
npm install
npm run dev
```

App: http://localhost:3000

## Cuentas demo

- Cliente: `cliente@demo.com` / `Cliente123!`
- Admin BI: `admin@compralatino.com` / `Admin123!`

## Documentacion

Los documentos APA de Fase II y Fase III estan en `documentacion/`. Diagramas Mermaid en `documentacion/Fase-II/diagramas/`. Wireframes en `documentacion/Fase-II/prototipos/` y paneles BI en `documentacion/Fase-III/prototipos-bi/`.
