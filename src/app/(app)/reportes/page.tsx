import Link from "next/link";
import { FileText } from "lucide-react";

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
import { requireSession } from "@/lib/rbac";
import { nombreFormularioPorTipo } from "@/lib/regulacion";

export default async function ReportesPage() {
  const session = await requireSession();
  const esAdmin = session.user.rol === "ADMIN";

  const reportes = await prisma.reporteRCD.findMany({
    where: esAdmin ? undefined : { obra: { userId: session.user.id } },
    include: { obra: { select: { id: true, nombre: true } } },
    orderBy: { periodoInicio: "desc" },
  });

  const formatter = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reportes RCD</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Todos los reportes periódicos de tus obras.
        </p>
      </div>

      <div className="mt-6">
        {reportes.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <FileText className="size-6" />
            </div>
            <p className="text-sm text-muted-foreground">Aún no hay reportes registrados.</p>
            <p className="text-xs text-muted-foreground">
              Ingresa a una obra en &quot;Control de obra registrada&quot; para crear su primer reporte.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Obra</TableHead>
                <TableHead>Periodo</TableHead>
                <TableHead>Formulario</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportes.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.obra.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">
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
                      render={<Link href={`/obras/${r.obra.id}/reportes/${r.id}`} />}
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
