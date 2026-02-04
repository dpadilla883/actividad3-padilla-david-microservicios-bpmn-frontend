
# Actividad 3 — Microservicios + Frontend + BPMN (Camunda)

# Nombre: David Padilla

# NRC: 29692

Solución para la **Actividad de Aprendizaje 3**: 2 microservicios (**Authors** y **Publications**), un **frontend React**, y el **proceso editorial en BPMN (Camunda Modeler)**.

---

## 1) Estructura del repositorio (requerida por la guía)

```
/
├─ authors-service/
├─ publications-service/
├─ frontend/
├─ bpmn/                 # archivo .bpmn + evidencias de Token Simulation
├─ docker-compose.yml    # obligatorio en la raíz
└─ README.md
```

> Nota: si tu carpeta se llama **Frontend**, renómbrala a **frontend** (minúscula) para cumplir la guía.

---

## 2) Tecnologías

- **Backend**: Java 17 + Spring Boot + Spring Data JPA  
- **BD**: PostgreSQL (**una base por microservicio**)  
- **Frontend**: Vite + React + TypeScript + PrimeReact  
- **BPMN**: Camunda Modeler (BPMN 2.0 + Token Simulation)  
- **Deploy**: Docker + Docker Compose  

---

## 3) Puertos y URLs

- Frontend: `http://localhost:5173`
- Authors API: `http://localhost:8081`
- Publications API: `http://localhost:8082`
- PostgreSQL Authors (host): `localhost:5433`  *(si mapeas 5433→5432)*
- PostgreSQL Publications (host): `localhost:5434` *(si mapeas 5434→5432)*

---

## 4) Levantar TODO con Docker Compose (recomendado / obligatorio)

En la raíz del proyecto (donde está `docker-compose.yml`):

```bash
docker compose up --build
```

Para detener:

```bash
docker compose down
```

> Importante: el `docker-compose.yml` debe levantar **5 contenedores** como mínimo:
> `db-authors`, `db-publications`, `authors-service`, `publications-service`, `frontend`.

### Variables que deben ir por Docker (muy importante)
Tus `application.yml` usan `localhost`. Dentro de Docker, **localhost NO es la BD**, por eso en Compose debes setear:

- `authors-service`
  - `SPRING_DATASOURCE_URL=jdbc:postgresql://db-authors:5432/authors_db`
  - `SPRING_DATASOURCE_USERNAME=authors_user`
  - `SPRING_DATASOURCE_PASSWORD=authors_pass`

- `publications-service`
  - `SPRING_DATASOURCE_URL=jdbc:postgresql://db-publications:5432/publications_db`
  - `SPRING_DATASOURCE_USERNAME=publications_user`
  - `SPRING_DATASOURCE_PASSWORD=publications_pass`
  - `AUTHORS_BASE_URL=http://authors-service:8081`  *(para validar authorId por HTTP)*

> Si tu código lee `authors.base-url`, asegúrate de mapear `AUTHORS_BASE_URL` a esa propiedad.

---

## 5) Ejecutar local SIN Docker (modo desarrollo)

### 5.1 Levantar bases (rápido con Docker solo para DB)
Ejemplo (Authors):

```bash
docker run --name db-authors -e POSTGRES_DB=authors_db -e POSTGRES_USER=authors_user -e POSTGRES_PASSWORD=authors_pass -p 5433:5432 -d postgres:16
```

Publications:

```bash
docker run --name db-publications -e POSTGRES_DB=publications_db -e POSTGRES_USER=publications_user -e POSTGRES_PASSWORD=publications_pass -p 5434:5432 -d postgres:16
```

### 5.2 Backend
En `authors-service/`:

```bash
mvn spring-boot:run
```

En `publications-service/`:

```bash
mvn spring-boot:run
```

> Asegúrate que Publications tenga:
> `authors.base-url: http://localhost:8081`

### 5.3 Frontend
En `frontend/`:

```bash
npm install
npm run dev
```

Archivo `.env` (ejemplo):

```env
VITE_AUTHORS_API=http://localhost:8081
VITE_PUBLICATIONS_API=http://localhost:8082
```

---

## 6) Endpoints principales

### Authors
- `POST /authors`
- `GET /authors`
- `GET /authors/{id}`
- `PUT /authors/{id}`
- `DELETE /authors/{id}`

### Publications
- `POST /publications` *(valida authorId consultando Authors)*
- `GET /publications`
- `GET /publications/{id}`
- `PATCH /publications/{id}/status`

Estados editoriales mínimos:
`DRAFT`, `IN_REVIEW`, `APPROVED`, `PUBLISHED`, `REJECTED`

---

## 7) BPMN (Camunda Modeler) — requisito obligatorio

En `/bpmn` incluir:

- Archivo `*.bpmn` exportado
- Evidencia de Token Simulation (3 escenarios)

### Variables mínimas (Token Simulation)
- `aprobado: true/false`
- `requiereCambios: true/false`

### Escenarios a evidenciar (mínimo 3)
1. Aprobación directa → Final “Publicado”
2. Rechazo → Final “Rechazado”
3. Requiere cambios → vuelve a autor → luego aprobación → “Publicado”

---

## 8) Evidencias recomendadas para el informe

- Captura de Docker Desktop con los 5 contenedores corriendo
- Capturas Postman: crear autor, crear publicación, error por authorId inexistente, cambios de estado
- Capturas del Frontend: pantalla de autores y publicaciones
- Capturas Token Simulation: 3 escenarios

---

## 9) Troubleshooting rápido

- **CORS**: si el frontend no puede llamar a los backends, agrega CORS en Spring (o proxy en Vite).
- **Publications no valida authorId**: revisa `authors.base-url` / `AUTHORS_BASE_URL`.
- **Error BD en Docker**: confirma que `SPRING_DATASOURCE_URL` use `db-authors` / `db-publications` (no `localhost`).
- **Vite no toma variables**: verifica prefijo `VITE_` y reinicia `npm run dev`.

