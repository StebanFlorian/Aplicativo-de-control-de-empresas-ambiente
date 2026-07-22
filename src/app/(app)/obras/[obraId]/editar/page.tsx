import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";

import { FormularioObraForm } from "@/components/forms/FormularioObraForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { actualizarObra } from "@/lib/actions/obra.actions";
import { prisma } from "@/lib/prisma";
import { isOwnerOrAdmin, requireSession } from "@/lib/rbac";

export default async function EditarObraPage({
  params,
}: {
  params: Promise<{ obraId: string }>;
}) {
  const { obraId } = await params;
  const session = await requireSession();

  const obra = await prisma.obra.findUnique({ where: { id: obraId } });
  if (!obra || !isOwnerOrAdmin(session, obra.userId)) {
    notFound();
  }

  const centros = await prisma.centroDeTrabajo.findMany({
    orderBy: { nombre: "asc" },
    select: { id: true, nombre: true },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Pencil className="size-5 text-primary" />
            Editar obra
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormularioObraForm
            onSubmit={actualizarObra.bind(null, obraId)}
            successRedirect={`/obras/${obraId}`}
            centros={centros}
            defaultValues={{
              nombre: obra.nombre,
              telefono: obra.telefono ?? undefined,
              tipoVia: obra.tipoVia,
              direccion: obra.direccion,
              departamento: obra.departamento,
              ciudad: obra.ciudad,
              localidad: obra.localidad ?? undefined,
              area: Number(obra.area),
              fechaInicio: obra.fechaInicio,
              cantidadRcdProyectada: Number(obra.cantidadRcdProyectada),
              cantidadMaterialAUsar: obra.cantidadMaterialAUsar
                ? Number(obra.cantidadMaterialAUsar)
                : undefined,
              lat: obra.lat ? Number(obra.lat) : undefined,
              lng: obra.lng ? Number(obra.lng) : undefined,
              centroDeTrabajoId: obra.centroDeTrabajoId ?? undefined,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
