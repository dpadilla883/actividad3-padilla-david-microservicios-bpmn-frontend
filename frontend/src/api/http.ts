// src/api/http.ts
import axios, { AxiosError } from "axios";

export const http = axios.create({
  timeout: 15000,
});

// Define cómo luce el error del backend (tu ApiError.java)
type ApiErrorBody = {
  message?: string;
};

function isAxiosError(err: unknown): err is AxiosError<ApiErrorBody> {
  return axios.isAxiosError(err);
}

export function getErrorMessage(err: unknown): string {
  // Si es error Axios, intenta leer err.response.data.message
  if (isAxiosError(err)) {
    const apiMsg = err.response?.data?.message;
    if (typeof apiMsg === "string" && apiMsg.trim().length > 0) return apiMsg;

    const status = err.response?.status;
    if (status) return `Error HTTP ${status}`;

    if (err.message) return err.message;
    return "Error de red";
  }

  // Si es Error normal
  if (err instanceof Error) return err.message;

  return "Error desconocido";
}
