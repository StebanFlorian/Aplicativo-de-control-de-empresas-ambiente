import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, FileText, MapPin, Pencil, Plus, ScrollText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DocumentosSection } from "@/components/documentos/DocumentosSection";
import { eliminarDocumento, subirDocumentosObra } from "@/lib/actions/documento.actions";
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
    include: {
      metas: { orderBy: { periodoInicio: "asc" } },
      documentos: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!obra || !isOwnerOrAdmin(session, obra.userId)) {
    notFound();
  }

  const formatter = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" });

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{obra.nombre}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5" />
            {obra.tipoVia} {obra.direccion} · {obra.ciudad}, {obra.departamento}
          </p>
        </div>
        <Button render={<Link href={`/obras/${obra.id}/editar`} />} variant="outline" className="gap-1.5">
          <Pencil className="size-3.5" />
          Editar
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge>{obra.clasificacion}</Badge>
        <Badge variant="secondary">
          {obra.tamano === "MAYOR_2000" ? "Área > 2000 m²" : "Área < 2000 m²"}
        </Badge>
        <Badge variant="outline">Reporte {obra.periodicidadReporte.toLowerCase()}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ScrollText className="size-4 text-primary" />
            Normativa aplicable
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">{textoNormativaAplicable(obra.clasificacion)}</p>
          <div>
            <p className="font-medium">Formulario de reporte correspondiente</p>
            <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
              <FileText className="size-3.5" />
              {nombreFormularioReporte(obra.clasificacion, obra.tamano)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarClock className="size-4 text-primary" />
            Calendario de metas
          </CardTitle>
          <Button
            render={<Link href={`/obras/${obra.id}/reportes/nuevo`} />}
            size="sm"
            className="gap-1.5"
          >
            <Plus className="size-3.5" />
            Nuevo reporte
          </Button>
        </CardHeader>
        <CardContent>
          <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="size-4 text-primary" />
            Documentos de la obra
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentosSection
            documentos={obra.documentos}
            onUpload={subirDocumentosObra.bind(null, obra.id)}
            onDelete={eliminarDocumento}
            titulo="Fotos, actas, permisos y otros documentos"
          />
        </CardContent>
      </Card>
    </div>
  );
}
