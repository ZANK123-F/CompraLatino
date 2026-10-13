# CompraLatino

Plataforma intermediaria para compras en YAuctions (Japón), con cobro Wompi, API ASP.NET Core, frontend Next.js y panel BI.

## Documentación de entrega

- `documentacion/Fase-I/CompraLatino_Fase_I_Propuesta_de_Arquitectura.docx`
- `documentacion/Fase-II/CompraLatino_Fase_II_Diseno_Arquitectura.docx`
- `documentacion/Fase-III/CompraLatino_Fase_III_Desarrollo_y_BI.docx`

## Código

- `codigo/backend` — API .NET
- `codigo/frontend` — Next.js

Si la API no está disponible, el frontend muestra datos de muestra sin interrumpir la experiencia.

## Ejecución

```bash
cd codigo/backend
dotnet run --launch-profile http

cd codigo/frontend
npm install
npm run dev
```

Cuentas demo:

- `cliente@demo.com` / `Cliente123!`
- `admin@compralatino.com` / `Admin123!`
