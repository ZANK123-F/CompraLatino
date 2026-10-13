# CompraLatino

Plataforma intermediaria para compras en YAuctions (Japon), con cobro Wompi, API ASP.NET Core, frontend Next.js y panel BI.

## Documentacion

- `documentacion/Fase-I/CompraLatino_Fase_I_Propuesta_de_Arquitectura.docx` — documento original de Fase I
- `documentacion/Fase-II/CompraLatino_Fase_II_Documento_Acumulativo.docx` — documento acumulativo (Fase I + diseno)
- `documentacion/Fase-III/CompraLatino_Fase_III_Documento_Acumulativo.docx` — documento acumulativo completo + BI

## Codigo

- `codigo/backend` — API .NET
- `codigo/frontend` — Next.js (si la API no responde, el cliente usa datos de muestra sin mostrar error)

## Ejecutar

```bash
cd codigo/backend
dotnet run --launch-profile http

cd codigo/frontend
npm install
npm run dev
```

Cuentas demo:
- cliente@demo.com / Cliente123!
- admin@compralatino.com / Admin123!