export function readPreference<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(`academy:${key}`); return raw === null ? fallback : JSON.parse(raw) as T; } catch { return fallback; }
}
export function savePreference(key: string, value: unknown): void {
  try { localStorage.setItem(`academy:${key}`, JSON.stringify(value)); } catch { /* A leitura continua com estado em memória. */ }
}
export function readProgress(): Record<string, boolean> {
  const value = readPreference<unknown>('progress', {});
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([,v]) => typeof v === 'boolean'));
}
