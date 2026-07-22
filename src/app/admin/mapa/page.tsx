import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ObrasMapLoader } from "@/components/map/ObrasMapLoader";
import { prisma } from "@/lib/prisma";

export default async function AdminMapaPage({
  searchParams,
}: {
  searchParams: Promise<{ centro?: string }>;
}) {
  const { centro } = await searchParams;
  const centros = await prisma.centroDeTrabajo.findMany({ orderBy: { nombre: "asc" } });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Mapa de obras</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Punto redondo = obra Distrital, punto cuadrado = obra Nacional. Verde = al día, rojo =
        atrasado, gris = sin calendario de metas.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button render={<Link href="/admin/mapa" />} variant={!centro ? "default" : "outline"} size="sm">
          Todos los centros
        </Button>
        {centros.map((c) => (
          <Button
            key={c.id}
            render={<Link href={`/admin/mapa?centro=${c.id}`} />}
            variant={centro === c.id ? "default" : "outline"}
            size="sm"
          >
            {c.nombre}
          </Button>
        ))}
      </div>

      <div className="mt-6">
        <ObrasMapLoader centro={centro} />
      </div>
    </div>
  );
}
