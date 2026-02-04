# ---------- build stage ----------
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Variables VITE_* se “inyectan” en build time
ARG VITE_AUTHORS_API=http://localhost:8081
ARG VITE_PUBLICATIONS_API=http://localhost:8082
ENV VITE_AUTHORS_API=$VITE_AUTHORS_API
ENV VITE_PUBLICATIONS_API=$VITE_PUBLICATIONS_API

RUN npm run build

# ---------- runtime stage ----------
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
