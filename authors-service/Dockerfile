# ---------- build stage ----------
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copiamos primero pom.xml para cachear dependencias
COPY pom.xml ./
RUN mvn -q -DskipTests dependency:go-offline

# Copiamos código y construimos el JAR
COPY src ./src
RUN mvn -q -DskipTests package

# ---------- runtime stage ----------
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copia el jar construido (ajusta el patrón si tu jar tiene nombre distinto)
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8081
ENV SERVER_PORT=8081
ENTRYPOINT ["java","-jar","/app/app.jar"]
