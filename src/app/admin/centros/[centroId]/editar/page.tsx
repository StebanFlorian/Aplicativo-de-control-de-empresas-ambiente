import { notFound } from "next/navigation";

import { CentroDeTrabajoForm } from "@/components/forms/CentroDeTrabajoForm";
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
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Editar centro de trabajo</h1>
      <div className="mt-6">
        <CentroDeTrabajoForm
          onSubmit={actualizarCentro.bind(null, centroId)}
          defaultValues={{
            nombre: centro.nombre,
            descripcion: centro.descripcion ?? undefined,
          }}
        />
      </div>
    </div>
  );
}
