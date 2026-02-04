// src/utils/editorialStatus.ts
export const STATUSES = ["DRAFT", "IN_REVIEW", "APPROVED", "PUBLISHED", "REJECTED"] as const;

export const NEXT_STATUS: Record<string, string[]> = {
  DRAFT: ["IN_REVIEW"],
  IN_REVIEW: ["APPROVED", "REJECTED"],
  APPROVED: ["PUBLISHED"],
  REJECTED: ["DRAFT"],
  PUBLISHED: [],
};

export function getNextStatuses(current: string): string[] {
  return NEXT_STATUS[current] ?? [];
}
