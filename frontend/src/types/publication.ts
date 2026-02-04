// src/types/publication.ts
export interface AuthorDto {
  id: number;
  authorType: "PERSON" | "ORG";
  fullName?: string;
  email?: string;
  organizationName?: string;
  contactEmail?: string;
}

export interface PublicationCreateRequest {
  publicationType: string;
  authorId: number;
  title: string;
  content?: string;
  category?: string;
}

export type PublicationUpdateRequest = PublicationCreateRequest;


export interface PublicationResponse {
  id: number;
  authorId: number;
  title: string;
  content?: string;
  status: string; // DRAFT/IN_REVIEW/...
  createdAt?: string;
  publicationType?: string; // "ARTICLE"
  category?: string;
  author?: AuthorDto | null;
}
