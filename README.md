# Sondre Kile Portfolio

Innholdsbasert React/Vite-portfolio med et separat .NET API-skjellet.

## Redigere innhold

Hver side har én felles `structure.ts` og egne språkfiler under
`frontend/src/data/pages/<side>/`. Norsk innhold ligger i `no.ts`; `en.ts` er
foreløpig en uferdig oversettelseskladd. Engelsk er ikke aktivert.

Se [redigeringsguiden](docs/EDITING_CONTENT.md) for å finne tekst, bilder og stil,
og [innholdsarkitekturen](docs/CONTENT_ARCHITECTURE.md) for tekniske detaljer.

Kontroller endringer fra `frontend/` med `npm.cmd run test:content` og
`npm.cmd run build`.

## Lokal kjøring

Krever Node.js 20+ og .NET 8 SDK.

```powershell
# Terminal 1: frontend
cd "F:\9. Utvikling\Portfolio-Website\frontend"
npm.cmd run dev

# Terminal 2: API
cd "F:\9. Utvikling\Portfolio-Website\backend/SondrePortfolio.Api"
dotnet run
```

Frontend kjører normalt på `http://localhost:5173`, og API-et på en lokal HTTP(S)-adresse som skrives i terminalen.

## Utrulling

Netlify skal publisere `frontend` som en statisk Vite-side. `.NET`-prosjektet er klart for API-kode, men må publiseres hos en .NET-vert (for eksempel Azure, Render eller Railway) når det tas i bruk.
