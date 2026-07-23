import Link from "next/link";
import { Building2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ObraCard } from "@/components/obras/ObraCard";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";

export default async function ObrasPage() {
  const session = await requireSession();
  const esAdmin = session.user.rol === "ADMIN";

  const obras = await prisma.obra.findMany({
    where: esAdmin ? undefined : { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      centroDeTrabajo: { select: { nombre: true } },
      user: { select: { numeroDocumento: true } },
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Control de obra registrada</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Datos registrados en el formulario de obra y la normativa aplicable a cada proyecto.
          </p>
        </div>
        <Button render={<Link href="/obras/nueva" />} className="gap-1.5">
          <Plus className="size-4" />
          Registrar obra
        </Button>
      </div>

      <div className="mt-8">
        {obras.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Building2 className="size-6" />
            </div>
            <div>
              <p className="font-medium">Aún no tienes obras registradas</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Crea tu primera obra para empezar a llevar el control de RCD.
              </p>
            </div>
            <Button render={<Link href="/obras/nueva" />} className="mt-2 gap-1.5">
              <Plus className="size-4" />
              Registrar obra
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {obras.map((obra) => (
              <ObraCard
                key={obra.id}
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
                  usuario: esAdmin ? obra.user.numeroDocumento : undefined,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
