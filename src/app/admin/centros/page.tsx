import Link from "next/link";
import { Network, Plus } from "lucide-react";

import { CentroCard } from "@/components/centros/CentroCard";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export default async function AdminCentrosPage() {
  const centros = await prisma.centroDeTrabajo.findMany({
    orderBy: { nombre: "asc" },
    include: { _count: { select: { obras: true } } },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Centros de trabajo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Agrupa las obras por zona o regional para facilitar el control.
          </p>
        </div>
        <Button render={<Link href="/admin/centros/nuevo" />} className="gap-1.5">
          <Plus className="size-4" />
          Nuevo centro
        </Button>
      </div>

      <div className="mt-8">
        {centros.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Network className="size-6" />
            </div>
            <p className="text-sm text-muted-foreground">No hay centros de trabajo creados.</p>
            <Button render={<Link href="/admin/centros/nuevo" />} className="mt-2 gap-1.5">
              <Plus className="size-4" />
              Nuevo centro
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {centros.map((centro) => (
              <CentroCard
                key={centro.id}
                centro={{
                  id: centro.id,
                  nombre: centro.nombre,
                  descripcion: centro.descripcion,
                  obrasCount: centro._count.obras,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
