// Global state for the currently selected child ID (set by App.tsx)
let currentChildId: string | null = null;
const listeners = new Set<(id: string | null) => void>();

export function setCurrentChildId(id: string | null) {
  currentChildId = id;
  listeners.forEach((fn) => fn(id));
}

export function getCurrentChildId(): string | null {
  return currentChildId;
}

export function onCurrentChildIdChange(fn: (id: string | null) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
