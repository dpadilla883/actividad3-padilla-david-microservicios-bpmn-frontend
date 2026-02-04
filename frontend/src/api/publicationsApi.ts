// src/api/publicationsApi.ts
import { http } from "./http";
import type {
  PublicationCreateRequest,
  PublicationUpdateRequest,
  PublicationResponse,
} from "../types/publication";

const BASE = import.meta.env.VITE_PUBLICATIONS_API;

export const publicationsApi = {
  async list(params?: { authorId?: number; status?: string }): Promise<PublicationResponse[]> {
    const { data } = await http.get(`${BASE}/publications`, { params });
    return data;
  },

  async getById(id: number): Promise<PublicationResponse> {
    const { data } = await http.get(`${BASE}/publications/${id}`);
    return data;
  },

  async create(payload: PublicationCreateRequest): Promise<PublicationResponse> {
    const { data } = await http.post(`${BASE}/publications`, payload);
    return data;
  },

  async update(id: number, payload: PublicationUpdateRequest): Promise<PublicationResponse> {
    const { data } = await http.put(`${BASE}/publications/${id}`, payload);
    return data;
  },

  async changeStatus(id: number, status: string): Promise<PublicationResponse> {
    const { data } = await http.patch(`${BASE}/publications/${id}/status`, { status });
    return data;
  },

  async remove(id: number): Promise<void> {
    await http.delete(`${BASE}/publications/${id}`);
  },
};
