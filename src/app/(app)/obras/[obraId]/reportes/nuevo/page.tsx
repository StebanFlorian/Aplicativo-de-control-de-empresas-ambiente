import { notFound } from "next/navigation";

import { Formulario31Form } from "@/components/forms/formulario31/Formulario31Form";
import { ReporteStubForm } from "@/components/forms/reportesStub/ReporteStubForm";
import { crearReporte31 } from "@/lib/actions/reporte.actions";
import { prisma } from "@/lib/prisma";
import { isOwnerOrAdmin, requireSession } from "@/lib/rbac";
import { buildCatalogTree } from "@/lib/rcd-catalog";
import { nombreFormularioReporte } from "@/lib/regulacion";

export default async function NuevoReportePage({
  params,
}: {
  params: Promise<{ obraId: string }>;
}) {
  const { obraId } = await params;
  const session = await requireSession();

  const obra = await prisma.obra.findUnique({ where: { id: obraId } });
  if (!obra || !isOwnerOrAdmin(session, obra.userId)) notFound();

  const esFormulario31 = obra.clasificacion === "DISTRITAL" && obra.tamano === "MAYOR_2000";

  const catalogo = await prisma.rcdCatalogItem.findMany({ orderBy: { codigo: "asc" } });
  const catalogTree = buildCatalogTree(catalogo);

  if (!esFormulario31) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold">Nuevo reporte — {obra.nombre}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {obra.clasificacion} · {obra.tamano === "MAYOR_2000" ? ">2000 m²" : "<2000 m²"}
        </p>
        <div className="mt-6">
          <ReporteStubForm
            catalogTree={catalogTree}
            formularioNombre={nombreFormularioReporte(obra.clasificacion, obra.tamano)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold">Formulario 3.1 — {obra.nombre}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Obra Distrital &gt; 2000 m². Registra el periodo, las adquisiciones de material valorizado
        y las cantidades por tipo de RCD generado.
      </p>

      <div className="mt-6">
        <Formulario31Form
          catalogTree={catalogTree}
          onSubmit={crearReporte31.bind(null, obraId)}
          successRedirect={`/obras/${obraId}/reportes`}
        />
      </div>
    </div>
  );
}
