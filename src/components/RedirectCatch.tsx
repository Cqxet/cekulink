"use client";

import { useEffect, useState } from "react";
import {
  decodeDest,
  extractCode,
  pathSegmentsFromLocation,
} from "@/lib/code";

export function RedirectCatch() {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = extractCode(
      pathSegmentsFromLocation(url.pathname),
      url.searchParams,
    );
    const dest = code ? decodeDest(code) : null;
    if (dest) {
      window.location.replace(dest);
      return;
    }
    setFailed(true);
  }, []);

  const home = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/` || "/";

  if (!failed) {
    return (
      <main className="mx-auto flex max-w-lg flex-col items-center gap-3 px-4 py-24 text-center">
        <p className="text-sm text-zinc-500">Yönlendiriliyor…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-lg flex-col items-center gap-3 px-4 py-24 text-center">
      <h1 className="text-3xl text-red-300" style={{ fontFamily: "var(--font-display)" }}>
        Boş
      </h1>
      <p className="text-sm text-zinc-500">Bu yolda bir hedef yok.</p>
      <a href={home} className="text-sm text-red-400 underline">Ana sayfa</a>
    </main>
  );
}
