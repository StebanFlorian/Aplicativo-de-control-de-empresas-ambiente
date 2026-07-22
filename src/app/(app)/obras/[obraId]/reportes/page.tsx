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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reportes RCD — {obra.nombre}</h1>
        <Button render={<Link href={`/obras/${obraId}/reportes/nuevo`} />}>Nuevo reporte</Button>
      </div>

      <div className="mt-6">
        {reportes.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aún no hay reportes registrados.</p>
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
                  <TableCell>{r.tipoFormulario}</TableCell>
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
