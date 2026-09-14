const DIRS = [
  "system32",
  "windows-update",
  "tmp",
  "hidden",
  "cache",
  "drivers",
  "backup",
  "runtime",
  "admin",
  "logs",
];

const FILES = [
  "critical-patch",
  "security-fix",
  "webcam-driver",
  "runtime-install",
  "not-a-virus",
  "system-repair",
  "free-reward",
  "password-backup",
  "invoice-unpaid",
  "kernel-hotfix",
];

const EXTS = ["exe", "bat", "scr", "dll", "cmd", "js", "msi"];

const QUERY = ["sid", "token", "ref", "scan", "payload", "session"];

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)]!;
}

function rand(n = 5): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < n; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export function randomCreepyPath(code: string): string {
  const dir = pick(DIRS);
  const file = `${pick(FILES)}-${rand(4)}`;
  const ext = pick(EXTS);
  const q = pick(QUERY);
  return `/${dir}/${file}.${ext}?${q}=${rand(6)}&x=${code}`;
}

function utf8ToBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  const b64 =
    typeof btoa === "function"
      ? btoa(bin)
      : Buffer.from(bytes).toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToUtf8(raw: string): string {
  const pad = raw.replace(/-/g, "+").replace(/_/g, "/");
  const padded = pad + "=".repeat((4 - (pad.length % 4)) % 4);
  let bin: string;
  if (typeof atob === "function") {
    bin = atob(padded);
  } else {
    bin = Buffer.from(padded, "base64").toString("binary");
  }
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeDest(url: string): string {
  return utf8ToBase64Url(url);
}

export function decodeDest(code: string): string | null {
  try {
    const raw = code.trim();
    if (!raw) return null;
    const dest = new URL(base64UrlToUtf8(raw));
    if (dest.protocol !== "http:" && dest.protocol !== "https:") return null;
    return dest.toString();
  } catch {
    return null;
  }
}

export function pathSegmentsFromLocation(pathname: string): string[] {
  const parts = pathname.split("/").filter(Boolean);
  const base = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/^\//, "");
  if (base && parts[0] === base) return parts.slice(1);
  return parts;
}

export function extractCode(
  pathSegments: string[],
  search: URLSearchParams,
): string | null {
  const candidates = [
    search.get("x"),
    search.get("kod"),
    ...search.values(),
    pathSegments.at(-1),
  ];
  for (const c of candidates) {
    if (c && decodeDest(c)) return c;
  }
  return null;
}

export function normalizeTarget(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const u = new URL(/^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.toString();
  } catch {
    return null;
  }
}
