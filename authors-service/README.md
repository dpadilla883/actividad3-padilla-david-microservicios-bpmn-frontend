# Authors Service (Spring Boot)

Microservicio **authors-service** para gestionar autores de tipo **PERSON** u **ORG**.  
Forma parte de la Actividad 3 (Arquitectura basada en microservicios + Frontend + BPMN).

## Stack
- Java 17
- Spring Boot 4.0.2
- Spring Web MVC + Validation + Spring Data JPA
- PostgreSQL

## Configuración (por defecto)
Archivo: `application.yml`

- **Puerto:** `8081`
- **Datasource:**
  - URL: `jdbc:postgresql://localhost:5433/authors_db`
  - User: `authors_user`
  - Pass: `authors_pass`

> Nota: también existe `application.properties` (puede variar en `ddl-auto`). Usa **uno** para evitar confusión.

## Levantar PostgreSQL rápido (Docker)
```bash
docker run --name authors-db -e POSTGRES_DB=authors_db -e POSTGRES_USER=authors_user -e POSTGRES_PASSWORD=authors_pass \
  -p 5433:5432 -d postgres:16
```

## Ejecutar el microservicio
```bash
mvn spring-boot:run
```
El servicio queda disponible en: `http://localhost:8081`

## Endpoints
Base path: `/authors`

- `POST /authors` – crear autor  
- `GET /authors` – listar autores  
- `GET /authors/{id}` – obtener por id  
- `PUT /authors/{id}` – actualizar  
- `DELETE /authors/{id}` – eliminar

### Ejemplos de payload

**Crear PERSON**
```json
{
  "authorType": "PERSON",
  "fullName": "Juan Perez",
  "email": "juan.perez@mail.com"
}
```

**Crear ORG**
```json
{
  "authorType": "ORG",
  "organizationName": "Editorial Andina",
  "contactEmail": "contacto@editorial.com"
}
```

## Modelo
- `Author` (abstracta) + derivadas `PersonAuthor`, `OrganizationAuthor`
- Enum `AuthorType`: `PERSON`, `ORG`
- Herencia JPA `SINGLE_TABLE` con discriminador (`dtype`)

## Formato de error estándar
El backend estandariza errores con un objeto tipo:
- `timestamp`, `status`, `error`, `message`, `path`

Esto está pensado para que el frontend pueda mostrar `message` directamente.
