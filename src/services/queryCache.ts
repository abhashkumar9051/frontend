import AsyncStorage from "@react-native-async-storage/async-storage";

type Entry<T> = { value: T; savedAt: number };
const PREFIX = "genzexam.cache.v1:";
const memory = new Map<string, Entry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

async function read<T>(key: string): Promise<T | undefined> {
  const current = memory.get(key) as Entry<T> | undefined;
  if (current) return current.value;
  try {
    const raw = await AsyncStorage.getItem(`${PREFIX}${key}`);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Entry<T>;
    memory.set(key, parsed);
    return parsed.value;
  } catch {
    return undefined;
  }
}

async function write<T>(key: string, value: T) {
  const entry = { value, savedAt: Date.now() };
  memory.set(key, entry);
  try { await AsyncStorage.setItem(`${PREFIX}${key}`, JSON.stringify(entry)); } catch { /* Memory cache still works if storage is full/unavailable. */ }
}

/** Stale-while-revalidate: return saved data immediately and refresh it quietly. */
export async function queryCached<T>(key: string, fetcher: () => Promise<T>, forceRefresh = false): Promise<T> {
  if (!forceRefresh) {
    const cached = await read<T>(key);
    if (cached !== undefined) {
      if (!inflight.has(key)) {
        const refresh = fetcher().then((value) => write(key, value)).catch(() => undefined).finally(() => inflight.delete(key));
        inflight.set(key, refresh);
      }
      return cached;
    }
  }
  const existing = inflight.get(key) as Promise<T> | undefined;
  if (existing) return existing;
  const request = fetcher().then(async (value) => { await write(key, value); return value; }).finally(() => inflight.delete(key));
  inflight.set(key, request);
  return request;
}

/** Read-through API cache used by screen loaders and Home's background prefetcher. */
export function getCachedJson<T>(key: string, url: string, token?: string | null): Promise<T> {
  return queryCached(key, async () => {
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}`, Accept: "application/json" } : { Accept: "application/json" },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.message || "Unable to load data.");
    return data as T;
  });
}

export async function clearQueryCache() {
  memory.clear();
  inflight.clear();
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter((key) => key.startsWith(PREFIX));
    await Promise.all(cacheKeys.map((key) => AsyncStorage.removeItem(key)));
  } catch { /* Cache cleanup is best-effort. */ }
}
