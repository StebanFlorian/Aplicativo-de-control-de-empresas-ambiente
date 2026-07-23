import Link from "next/link";
import { Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ObraCard } from "@/components/obras/ObraCard";
import { AsignarUsuarioObraSelect } from "@/components/admin/AsignarUsuarioObraSelect";
import { prisma } from "@/lib/prisma";

export default async function AdminObrasPage({
  searchParams,
}: {
  searchParams: Promise<{ centro?: string }>;
}) {
  const { centro } = await searchParams;

  const [obras, centros, usuarios] = await Promise.all([
    prisma.obra.findMany({
      where: centro ? { centroDeTrabajoId: centro } : undefined,
      include: { user: { select: { numeroDocumento: true } }, centroDeTrabajo: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.centroDeTrabajo.findMany({ orderBy: { nombre: "asc" } }),
    prisma.user.findMany({
      orderBy: { numeroDocumento: "asc" },
      select: { id: true, numeroDocumento: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Asignación de obras</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Todas las obras registradas en la plataforma. Reasigna el usuario propietario desde
          cada tarjeta.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          render={<Link href="/admin/obras" />}
          variant={!centro ? "default" : "outline"}
          size="sm"
        >
          Todos los centros
        </Button>
        {centros.map((c) => (
          <Button
            key={c.id}
            render={<Link href={`/admin/obras?centro=${c.id}`} />}
            variant={centro === c.id ? "default" : "outline"}
            size="sm"
          >
            {c.nombre}
          </Button>
        ))}
      </div>

      <div className="mt-6">
        {obras.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Building2 className="size-6" />
            </div>
            <p className="text-sm text-muted-foreground">No hay obras registradas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {obras.map((obra) => (
              <div key={obra.id} className="space-y-2">
                <ObraCard
                  obra={{
                    id: obra.id,
                    nombre: obra.nombre,
                    ciudad: obra.ciudad,
                    departamento: obra.departamento,
                    area: Number(obra.area),
                    clasificacion: obra.clasificacion,
                    tamano: obra.tamano,
                    periodicidadReporte: obra.periodicidadReporte,
                    centroDeTrabajo: obra.centroDeTrabajo?.nombre,
                    usuario: obra.user.numeroDocumento,
                  }}
                />
                <AsignarUsuarioObraSelect
                  obraId={obra.id}
                  usuarioActualId={obra.userId}
                  usuarios={usuarios}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
