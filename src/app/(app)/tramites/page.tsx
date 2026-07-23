import Link from "next/link";
import { Gavel, Plus } from "lucide-react";

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
import { ETIQUETAS_ESTADO } from "@/components/tramites/EstadoTramiteSelect";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";

export default async function TramitesPage() {
  const session = await requireSession();
  const esAdmin = session.user.rol === "ADMIN";

  const tramites = await prisma.tramiteAmbiental.findMany({
    where: esAdmin ? undefined : { obra: { userId: session.user.id } },
    include: { obra: { select: { id: true, nombre: true } } },
    orderBy: { createdAt: "desc" },
  });

  const formatter = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Trámites ante la Autoridad Ambiental
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Permisos, licencias y radicados asociados a tus obras.
          </p>
        </div>
        <Button render={<Link href="/tramites/nuevo" />} className="gap-1.5">
          <Plus className="size-4" />
          Nuevo trámite
        </Button>
      </div>

      <div className="mt-6">
        {tramites.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Gavel className="size-6" />
            </div>
            <p className="text-sm text-muted-foreground">Aún no hay trámites registrados.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trámite</TableHead>
                <TableHead>Obra</TableHead>
                <TableHead>Entidad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Radicado</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {tramites.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">{t.obra.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">{t.entidad ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={t.estado === "APROBADO" ? "default" : "secondary"}>
                      {ETIQUETAS_ESTADO[t.estado]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {t.fechaRadicado ? formatter.format(t.fechaRadicado) : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button render={<Link href={`/tramites/${t.id}`} />} variant="ghost" size="sm">
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
