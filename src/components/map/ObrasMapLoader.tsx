"use client";

import dynamic from "next/dynamic";

const ObrasMap = dynamic(() => import("./ObrasMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[600px] items-center justify-center rounded-md border text-sm text-muted-foreground">
      Cargando mapa...
    </div>
  ),
});

export function ObrasMapLoader({ centro }: { centro?: string }) {
  return <ObrasMap centro={centro} />;
}
