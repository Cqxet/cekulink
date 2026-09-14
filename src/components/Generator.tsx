"use client";

import { useEffect, useState } from "react";
import { encodeDest, normalizeTarget, randomCreepyPath } from "@/lib/code";

function isLocal(origin: string) {
  return /localhost|127\.0\.0\.1/.test(origin);
}

function jokeMessage(share: string, dest: string) {
  let host = dest;
  try {
    host = new URL(dest).hostname.replace(/^www\./, "");
  } catch {
    /* keep dest */
  }
  return `şaka linki (phishing değil)\n${share}\n\ntıklayınca açılacak yer: ${host}`;
}

export function Generator() {
  const [target, setTarget] = useState("");
  const [origin, setOrigin] = useState("");
  const [share, setShare] = useState<string | null>(null);
  const [dest, setDest] = useState<string | null>(null);
  const [copied, setCopied] = useState<"link" | "joke" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  function generate() {
    const next = normalizeTarget(target);
    if (!next) {
      setShare(null);
      setDest(null);
      setError(target.trim() ? "Bu bir http(s) adresi değil." : "Önce gerçek adresi yapıştır.");
      return;
    }
    setError(null);
    setCopied(null);
    setDest(next);
    const path = randomCreepyPath(encodeDest(next));
    const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
    setShare(`${origin || window.location.origin}${base}${path}`);
  }

  async function copy(kind: "link" | "joke") {
    if (!share || !dest) return;
    const text = kind === "joke" ? jokeMessage(share, dest) : share;
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1600);
  }

  async function nativeShare() {
    if (!share || !dest || !navigator.share) return;
    await navigator.share({ text: jokeMessage(share, dest) });
  }

  const local = origin ? isLocal(origin) : false;

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-8 px-4 py-12 sm:py-20">
      <header className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-red-400/80">şaka linki</p>
        <h1 className="text-5xl text-red-200 sm:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
          CekuLink
        </h1>
        <p className="text-sm text-zinc-400">
          Rickroll, video, meme: gerçek adresi yapıştır. Çıkan korkunç link tıklanınca yine oraya gider.
        </p>
      </header>
      <section className="space-y-4 rounded-lg border border-red-950/80 bg-black/50 p-5">
        <div className="space-y-2">
          <label htmlFor="target" className="block text-xs uppercase tracking-wider text-zinc-500">
            Gerçek adres (arkadaşın gideceği yer)
          </label>
          <input
            id="target"
            value={target}
            onChange={(e) => {
              setTarget(e.target.value);
              setCopied(null);
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") generate();
            }}
            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            className="w-full rounded border border-zinc-800 bg-zinc-950 px-3 py-2.5 font-mono text-sm outline-none focus:border-red-700"
          />
        </div>
        <button type="button" onClick={generate} className="w-full rounded bg-red-800 py-2.5 text-sm text-red-50 hover:bg-red-700">
          {share ? "Yolu yeniden üret" : "Şüpheli link oluştur"}
        </button>
      </section>
      {error ? <p className="text-center text-sm text-red-400">{error}</p> : null}
      {share && dest ? (
        <section className="space-y-4">
          {local ? (
            <p className="rounded border border-amber-900/70 bg-amber-950/40 px-3 py-2 text-sm text-amber-200/90">
              Şu an adres <code className="text-amber-100">{origin}</code> — arkadaş için{" "}
              <code className="text-amber-100">https://cqxet.github.io/cekulink/</code> kullan.
            </p>
          ) : (
            <p className="text-sm text-zinc-500">
              WhatsApp / Discord’a at. Tıklayınca {new URL(dest).hostname} açılır.
            </p>
          )}
          <pre className="overflow-x-auto break-all whitespace-pre-wrap rounded border border-red-900/60 bg-black px-3 py-3 font-mono text-sm text-red-200">
            {share}
          </pre>
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => copy("link")} className="rounded bg-red-800 px-4 py-2 text-sm text-red-50 hover:bg-red-700">
              {copied === "link" ? "Kopyalandı" : "Sadece link (sürpriz)"}
            </button>
            <button type="button" onClick={() => copy("joke")} className="rounded border border-zinc-600 px-4 py-2 text-sm text-zinc-200 hover:border-zinc-400">
              {copied === "joke" ? "Kopyalandı" : "Şaka mesajı + gideceği yer"}
            </button>
            <a href={share} className="rounded border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200">Kendin dene</a>
          </div>
        </section>
      ) : null}
    </main>
  );
}
