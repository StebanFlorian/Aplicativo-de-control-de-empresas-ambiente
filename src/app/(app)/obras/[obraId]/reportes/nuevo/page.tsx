import { notFound } from "next/navigation";

import { Formulario31Form } from "@/components/forms/formulario31/Formulario31Form";
import { ReporteManualPicker } from "@/components/forms/reportesStub/ReporteManualPicker";
import {
  crearReporte31,
  crearReporteArchivo,
  crearReporteManual,
} from "@/lib/actions/reporte.actions";
import { prisma } from "@/lib/prisma";
import { isOwnerOrAdmin, requireSession } from "@/lib/rbac";
import { buildCatalogTree } from "@/lib/rcd-catalog";
import { nombreFormularioReporte, tipoFormularioParaObra } from "@/lib/regulacion";

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
    const tipoFormulario = tipoFormularioParaObra(obra.clasificacion, obra.tamano);

    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold">Nuevo reporte — {obra.nombre}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {obra.clasificacion} · {obra.tamano === "MAYOR_2000" ? ">2000 m²" : "<2000 m²"}
        </p>
        <div className="mt-6">
          <ReporteManualPicker
            catalogTree={catalogTree}
            formularioNombre={nombreFormularioReporte(obra.clasificacion, obra.tamano)}
            onSubmitGenerico={crearReporteManual.bind(null, obraId, tipoFormulario)}
            onSubmitArchivo={crearReporteArchivo.bind(null, obraId, tipoFormulario)}
            successRedirect={`/obras/${obraId}/reportes`}
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

      <div className="mt-10 border-t pt-8">
        <h2 className="text-lg font-semibold">Formulario 3.2 (mientras se define su estructura)</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          El Formulario 3.2 aún no tiene reglas de negocio propias en el aplicativo. Puedes
          registrarlo con el mismo catálogo genérico de RCD o adjuntando el archivo preparado.
        </p>
        <div className="mt-4">
          <ReporteManualPicker
            catalogTree={catalogTree}
            formularioNombre="Formulario 3.2"
            onSubmitGenerico={crearReporteManual.bind(null, obraId, "FORM_3_2")}
            onSubmitArchivo={crearReporteArchivo.bind(null, obraId, "FORM_3_2")}
            successRedirect={`/obras/${obraId}/reportes`}
          />
        </div>
      </div>
    </div>
  );
}
