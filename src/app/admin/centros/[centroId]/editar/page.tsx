import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";

import { CentroDeTrabajoForm } from "@/components/forms/CentroDeTrabajoForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { actualizarCentro } from "@/lib/actions/centro.actions";
import { prisma } from "@/lib/prisma";

export default async function EditarCentroPage({
  params,
}: {
  params: Promise<{ centroId: string }>;
}) {
  const { centroId } = await params;
  const centro = await prisma.centroDeTrabajo.findUnique({ where: { id: centroId } });
  if (!centro) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Pencil className="size-5 text-primary" />
            Editar centro de trabajo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CentroDeTrabajoForm
            onSubmit={actualizarCentro.bind(null, centroId)}
            defaultValues={{
              nombre: centro.nombre,
              descripcion: centro.descripcion ?? undefined,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
