import { FormularioObraForm } from "@/components/forms/FormularioObraForm";
import { crearObra } from "@/lib/actions/obra.actions";
import { prisma } from "@/lib/prisma";

export default async function NuevaObraPage() {
  const centros = await prisma.centroDeTrabajo.findMany({
    orderBy: { nombre: "asc" },
    select: { id: true, nombre: true },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Registrar obra</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Con estos datos calculamos automáticamente qué normativa aplica y la periodicidad de
        reporte.
      </p>

      <div className="mt-6">
        <FormularioObraForm onSubmit={crearObra} redirectToObraDetail centros={centros} />
      </div>
    </div>
  );
}
