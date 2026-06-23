# Sondre Kile Portfolio

Tomt startskjelett for en React-frontend og et .NET API.

## Lokal kjøring

Krever Node.js 20+ og .NET 8 SDK.

```powershell
# Terminal 1: frontend
cd frontend
npm install
npm run dev

# Terminal 2: API
cd backend/SondrePortfolio.Api
dotnet run
```

Frontend kjører normalt på `http://localhost:5173`, og API-et på en lokal HTTP(S)-adresse som skrives i terminalen.

## Utrulling

Netlify skal publisere `frontend` som en statisk Vite-side. `.NET`-prosjektet er klart for API-kode, men må publiseres hos en .NET-vert (for eksempel Azure, Render eller Railway) når det tas i bruk.
