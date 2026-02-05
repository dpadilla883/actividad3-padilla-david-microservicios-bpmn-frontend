# Frontend (React + TypeScript + Vite)

Interfaz web para consumir **authors-service** y **publications-service**.  
Incluye pantallas para: listar/crear/editar autores y publicaciones, además de cambiar estados editoriales.

## Stack
- React + TypeScript + Vite
- Axios (cliente HTTP)
- PrimeReact + PrimeFlex + PrimeIcons (UI)
- React Router

## Requisitos
- Node.js 18+ (recomendado)
- NPM (incluido con Node)

## Variables de entorno
El frontend lee:
- `VITE_AUTHORS_API` (ej. `http://localhost:8081`)
- `VITE_PUBLICATIONS_API` (ej. `http://localhost:8082`)

Archivo `.env` actual en el proyecto:

```env
VITE_AUTHORS_API=http://localhost:8081
VITE_PUBLICATIONS_API=http://localhost:8082
```

## Ejecutar en desarrollo
```bash
npm install
npm run dev
```

Vite mostrará la URL local del navegador (por defecto suele ser `http://localhost:5173`).

## Build y preview
```bash
npm run build
npm run preview
```

## Estructura relevante
- `src/api/http.ts` – instancia Axios y helper `getErrorMessage()` (lee `message` de ApiError del backend)
- `src/api/authorsApi.ts` – llamadas a Authors (`/authors`)
- `src/api/publicationsApi.ts` – llamadas a Publications (`/publications`)
- `src/pages/AuthorsPage.tsx` y `src/pages/PublicationsPage.tsx` – pantallas principales

## Flujo recomendado para probar
1. Levanta PostgreSQL (en Docker) para ambos servicios.
2. Ejecuta `authors-service` (puerto 8081).
3. Ejecuta `publications-service` (puerto 8082) apuntando a Authors con `authors.base-url`.
4. Ejecuta el frontend (`npm run dev`).
