import { notFound } from "next/navigation";

import { Formulario31Form } from "@/components/forms/formulario31/Formulario31Form";
import { prisma } from "@/lib/prisma";
import { isOwnerOrAdmin, requireSession } from "@/lib/rbac";
import { buildCatalogTree } from "@/lib/rcd-catalog";

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
    include: { adquisiciones: true, itemsRcd: true },
  });
  if (!reporte || reporte.obraId !== obraId) notFound();

  if (reporte.tipoFormulario !== "FORM_3_1") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Reporte</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Este tipo de formulario aún no tiene una vista de detalle disponible.
        </p>
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
      <h1 className="text-2xl font-semibold">Reporte Formulario 3.1 — {obra.nombre}</h1>

      <div className="mt-6">
        <Formulario31Form
          catalogTree={catalogTree}
          readOnly
          defaultValues={{
            periodoInicio: reporte.periodoInicio,
            periodoFin: reporte.periodoFin,
            adquisiciones: reporte.adquisiciones.map((a) => ({
              cantidadTon: Number(a.cantidadTon),
              proveedor: a.proveedor,
            })),
            items,
          }}
        />
      </div>
    </div>
  );
}
