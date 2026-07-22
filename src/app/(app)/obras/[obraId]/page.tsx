import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { isOwnerOrAdmin, requireSession } from "@/lib/rbac";
import { nombreFormularioReporte, textoNormativaAplicable } from "@/lib/regulacion";

export default async function ObraDetailPage({
  params,
}: {
  params: Promise<{ obraId: string }>;
}) {
  const { obraId } = await params;
  const session = await requireSession();

  const obra = await prisma.obra.findUnique({
    where: { id: obraId },
    include: { metas: { orderBy: { periodoInicio: "asc" } } },
  });

  if (!obra || !isOwnerOrAdmin(session, obra.userId)) {
    notFound();
  }

  const formatter = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{obra.nombre}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {obra.tipoVia} {obra.direccion} · {obra.ciudad}, {obra.departamento}
          </p>
        </div>
        <Button render={<Link href={`/obras/${obra.id}/editar`} />} variant="outline">
          Editar
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Badge>{obra.clasificacion}</Badge>
        <Badge variant="secondary">
          {obra.tamano === "MAYOR_2000" ? "Área > 2000 m²" : "Área < 2000 m²"}
        </Badge>
        <Badge variant="outline">Reporte {obra.periodicidadReporte.toLowerCase()}</Badge>
      </div>

      <div className="mt-4 rounded-md border bg-muted/40 p-4 text-sm">
        <p className="font-medium">Normativa aplicable</p>
        <p className="mt-1 text-muted-foreground">{textoNormativaAplicable(obra.clasificacion)}</p>
        <p className="mt-2 font-medium">Formulario de reporte correspondiente</p>
        <p className="mt-1 text-muted-foreground">
          {nombreFormularioReporte(obra.clasificacion, obra.tamano)}
        </p>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Calendario de metas</h2>
          <Button render={<Link href={`/obras/${obra.id}/reportes/nuevo`} />} size="sm">
            Nuevo reporte
          </Button>
        </div>
        <p className="mt-1 rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          Estimación provisional: se reparte linealmente la cantidad de RCD proyectada en una
          ventana de 12 meses desde la fecha de inicio. Ajustable cuando se defina la fórmula
          oficial de metas.
        </p>

        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Periodo</TableHead>
              <TableHead className="text-right">Cantidad esperada (Ton)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {obra.metas.map((meta) => (
              <TableRow key={meta.id}>
                <TableCell>
                  {formatter.format(meta.periodoInicio)} — {formatter.format(meta.periodoFin)}
                </TableCell>
                <TableCell className="text-right">
                  {Number(meta.cantidadEsperadaTon).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
