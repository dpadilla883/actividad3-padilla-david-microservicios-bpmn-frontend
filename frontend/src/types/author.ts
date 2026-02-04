// src/types/author.ts
export type AuthorType = "PERSON" | "ORG";

export interface AuthorCreateRequest {
  authorType: AuthorType;
  fullName?: string;
  email?: string;
  organizationName?: string;
  contactEmail?: string;
}

export interface AuthorResponse {
  id: number;
  authorType: AuthorType;
  fullName?: string;
  email?: string;
  organizationName?: string;
  contactEmail?: string;
}
