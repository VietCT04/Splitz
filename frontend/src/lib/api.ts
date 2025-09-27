const API = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = new URL(path.replace(/^\/+/, ""), API).toString(); // safe join
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}