# Publications Service (Spring Boot)

Microservicio **publications-service** para gestionar publicaciones y su ciclo editorial.  
Integra una dependencia controlada hacia **authors-service** para validar el `authorId`.

## Stack
- Java 17
- Spring Boot 4.0.2
- Spring Web MVC + Validation + Spring Data JPA
- Spring REST Client (RestTemplate)
- PostgreSQL

## Configuración (por defecto)
Archivo: `application.yml`

- **Puerto:** `8082`
- **Datasource:**
  - URL: `jdbc:postgresql://localhost:5434/publications_db`
  - User: `publications_user`
  - Pass: `publications_pass`
- **Dependencia a Authors**
  - `authors.base-url`: `http://localhost:8081`

## Levantar PostgreSQL rápido (Docker)
```bash
docker run --name publications-db -e POSTGRES_DB=publications_db -e POSTGRES_USER=publications_user -e POSTGRES_PASSWORD=publications_pass \
  -p 5434:5432 -d postgres:16
```

## Ejecutar el microservicio
```bash
mvn spring-boot:run
```
El servicio queda disponible en: `http://localhost:8082`

> Importante: asegúrate de tener **authors-service** corriendo en `http://localhost:8081`.

## Endpoints
Base path: `/publications`

- `POST /publications` – crear publicación (**valida authorId** en Authors)
- `GET /publications/{id}` – obtener por id
- `GET /publications?authorId=&status=` – listar con filtros opcionales
- `PUT /publications/{id}` – actualizar datos (sin cambiar status)
- `PATCH /publications/{id}/status` – cambiar estado editorial
- `DELETE /publications/{id}` – eliminar

### Ejemplos de payload

**Crear publicación (por ahora solo soporta `ARTICLE`)**
```json
{
  "publicationType": "ARTICLE",
  "authorId": 1,
  "title": "Arquitectura de Microservicios",
  "content": "Contenido de ejemplo...",
  "category": "Tecnologia"
}
```

**Cambiar estado**
```json
{
  "status": "IN_REVIEW"
}
```

## Estados editoriales
Enum `EditorialStatus`:
- `DRAFT`, `IN_REVIEW`, `APPROVED`, `PUBLISHED`, `REJECTED`

### Reglas de transición (StatusTransitionValidator)
- `DRAFT → IN_REVIEW`
- `IN_REVIEW → APPROVED | REJECTED`
- `APPROVED → PUBLISHED`
- `REJECTED → DRAFT`
- `PUBLISHED` (sin transiciones)

## Diseño (patrones usados en el código)
- **Adapter:** `AuthorsClient` + `RestAuthorsClient` (oculta detalles HTTP hacia Authors)
- **Factory:** `PublicationFactory` crea instancias según `publicationType` (actualmente `ARTICLE`)
- **Repository:** `PublicationRepository` (Spring Data JPA)
- **Strategy/Validator:** `StatusTransitionValidator` centraliza reglas de negocio (transiciones)

## Formato de error estándar
Igual que Authors: `timestamp`, `status`, `error`, `message`, `path`.
