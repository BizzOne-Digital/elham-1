import type { Types } from "mongoose";

export function serializeId(value: Types.ObjectId | string | undefined): string | undefined {
  if (!value) return undefined;
  return String(value);
}

export function serializeDoc<T>(doc: unknown): T | null {
  if (!doc) return null;
  return JSON.parse(JSON.stringify(doc)) as T;
}

export function serializeDocs<T>(docs: unknown): T[] {
  return JSON.parse(JSON.stringify(docs)) as T[];
}
