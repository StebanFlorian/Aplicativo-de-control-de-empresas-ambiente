import { notFound } from "next/navigation";

import { FormularioObraForm } from "@/components/forms/FormularioObraForm";
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
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Editar obra</h1>

      <div className="mt-6">
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
      </div>
    </div>
  );
}
