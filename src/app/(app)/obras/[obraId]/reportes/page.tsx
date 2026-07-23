import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, Plus } from "lucide-react";

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
import { nombreFormularioPorTipo } from "@/lib/regulacion";

export default async function ReportesObraPage({
  params,
}: {
  params: Promise<{ obraId: string }>;
}) {
  const { obraId } = await params;
  const session = await requireSession();

  const obra = await prisma.obra.findUnique({ where: { id: obraId } });
  if (!obra || !isOwnerOrAdmin(session, obra.userId)) notFound();

  const reportes = await prisma.reporteRCD.findMany({
    where: { obraId },
    orderBy: { periodoInicio: "desc" },
  });

  const formatter = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Reportes RCD — {obra.nombre}</h1>
        <Button render={<Link href={`/obras/${obraId}/reportes/nuevo`} />} className="gap-1.5">
          <Plus className="size-4" />
          Nuevo reporte
        </Button>
      </div>

      <div className="mt-6">
        {reportes.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <FileText className="size-6" />
            </div>
            <p className="text-sm text-muted-foreground">Aún no hay reportes registrados.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Periodo</TableHead>
                <TableHead>Formulario</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportes.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    {formatter.format(r.periodoInicio)} — {formatter.format(r.periodoFin)}
                  </TableCell>
                  <TableCell>{nombreFormularioPorTipo(r.tipoFormulario)}</TableCell>
                  <TableCell>
                    <Badge variant={r.estado === "ENVIADO" ? "default" : "secondary"}>
                      {r.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      render={<Link href={`/obras/${obraId}/reportes/${r.id}`} />}
                      variant="ghost"
                      size="sm"
                    >
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
