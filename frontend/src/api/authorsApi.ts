// src/api/authorsApi.ts
import { http } from "./http";
import type { AuthorCreateRequest, AuthorResponse } from "../types/author";

const BASE = import.meta.env.VITE_AUTHORS_API;

export const authorsApi = {
  async list(): Promise<AuthorResponse[]> {
    const { data } = await http.get(`${BASE}/authors`);
    return data;
  },

  async getById(id: number): Promise<AuthorResponse> {
    const { data } = await http.get(`${BASE}/authors/${id}`);
    return data;
  },

  async create(payload: AuthorCreateRequest): Promise<AuthorResponse> {
    const { data } = await http.post(`${BASE}/authors`, payload);
    return data;
  },

  async update(id: number, payload: AuthorCreateRequest): Promise<AuthorResponse> {
    const { data } = await http.put(`${BASE}/authors/${id}`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await http.delete(`${BASE}/authors/${id}`);
  },
};
