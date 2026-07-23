import { notFound } from "next/navigation";

import { Formulario31Form } from "@/components/forms/formulario31/Formulario31Form";
import { DocumentosSection } from "@/components/documentos/DocumentosSection";
import { eliminarDocumento, subirDocumentosReporte } from "@/lib/actions/documento.actions";
import { prisma } from "@/lib/prisma";
import { isOwnerOrAdmin, requireSession } from "@/lib/rbac";
import { buildCatalogTree } from "@/lib/rcd-catalog";
import { nombreFormularioPorTipo } from "@/lib/regulacion";

export default async function ReporteDetailPage({
  params,
}: {
  params: Promise<{ obraId: string; reporteId: string }>;
}) {
  const { obraId, reporteId } = await params;
  const session = await requireSession();

  const obra = await prisma.obra.findUnique({ where: { id: obraId } });
  if (!obra || !isOwnerOrAdmin(session, obra.userId)) notFound();

  const reporte = await prisma.reporteRCD.findUnique({
    where: { id: reporteId },
    include: {
      adquisiciones: true,
      itemsRcd: true,
      documentos: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!reporte || reporte.obraId !== obraId) notFound();

  const nombreFormulario = nombreFormularioPorTipo(reporte.tipoFormulario);
  const documentosSection = (
    <div className="mt-10 border-t pt-8">
      <DocumentosSection
        documentos={reporte.documentos}
        onUpload={subirDocumentosReporte.bind(null, reporte.id)}
        onDelete={eliminarDocumento}
        titulo="Documentos del reporte"
      />
    </div>
  );

  const esReporteSoloArchivo = reporte.adquisiciones.length === 0 && reporte.itemsRcd.length === 0;

  if (esReporteSoloArchivo) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-semibold">
          Reporte {nombreFormulario} — {obra.nombre}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Periodo: {reporte.periodoInicio.toLocaleDateString("es-CO")} —{" "}
          {reporte.periodoFin.toLocaleDateString("es-CO")}
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Este reporte se registró como archivo(s) adjunto(s).
        </p>
        {documentosSection}
      </div>
    );
  }

  const catalogo = await prisma.rcdCatalogItem.findMany({ orderBy: { codigo: "asc" } });
  const catalogTree = buildCatalogTree(catalogo);
  const leafIds = catalogo.filter((c) => c.nivel === "ITEM").map((c) => c.id);

  const items = leafIds.map((id) => {
    const existente = reporte.itemsRcd.find((i) => i.rcdCatalogItemId === id);
    return {
      rcdCatalogItemId: id,
      cantidadTon: existente ? Number(existente.cantidadTon) : 0,
      tratamiento: existente?.tratamiento ?? undefined,
      lugarDisposicionFinal: existente?.lugarDisposicionFinal ?? undefined,
    };
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold">
        Reporte {nombreFormulario} — {obra.nombre}
      </h1>

      <div className="mt-6">
        <Formulario31Form
          catalogTree={catalogTree}
          readOnly
          defaultValues={{
            periodoInicio: reporte.periodoInicio,
            periodoFin: reporte.periodoFin,
            adquisiciones: reporte.adquisiciones.map((a) => ({
              rcdCatalogItemId: a.rcdCatalogItemId,
              cantidadTon: Number(a.cantidadTon),
              proveedor: a.proveedor,
            })),
            items,
          }}
        />
      </div>

      {documentosSection}
    </div>
  );
}
