"use client";

import { useEffect, useState } from "react";

type ApiState = "checking" | "ok" | "down";

export function ApiStatus() {
  const [status, setStatus] = useState<ApiState>("checking");

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const url = `${baseUrl.replace(/\/$/, "")}/swagger/doc.json`;

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(`HTTP ${res.status}`);
      })
      .then(() => setStatus("ok"))
      .catch(() => setStatus("down"))
      .finally(() => clearTimeout(timeoutId));

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const color = status === "ok" ? "bg-green-500" : status === "down" ? "bg-red-500" : "bg-zinc-400";
  const label = status === "ok" ? "API: OK" : status === "down" ? "API: DOWN" : "API: Checking...";

  return (
    <div className="fixed top-4 right-4 inline-flex items-center gap-2 rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 shadow-sm bg-background/70 backdrop-blur">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span className="text-sm text-foreground/80">{label}</span>
    </div>
  );
}


