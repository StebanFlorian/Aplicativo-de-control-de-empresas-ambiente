import Link from "next/link";

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

export default async function AdminObrasPage({
  searchParams,
}: {
  searchParams: Promise<{ centro?: string }>;
}) {
  const { centro } = await searchParams;

  const [obras, centros] = await Promise.all([
    prisma.obra.findMany({
      where: centro ? { centroDeTrabajoId: centro } : undefined,
      include: { user: { select: { numeroDocumento: true } }, centroDeTrabajo: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.centroDeTrabajo.findMany({ orderBy: { nombre: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Obras (todas)</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          render={<Link href="/admin/obras" />}
          variant={!centro ? "default" : "outline"}
          size="sm"
        >
          Todos los centros
        </Button>
        {centros.map((c) => (
          <Button
            key={c.id}
            render={<Link href={`/admin/obras?centro=${c.id}`} />}
            variant={centro === c.id ? "default" : "outline"}
            size="sm"
          >
            {c.nombre}
          </Button>
        ))}
      </div>

      <div className="mt-6">
        {obras.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay obras registradas.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Centro de trabajo</TableHead>
                <TableHead>Clasificación</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {obras.map((obra) => (
                <TableRow key={obra.id}>
                  <TableCell className="font-medium">{obra.nombre}</TableCell>
                  <TableCell>{obra.user.numeroDocumento}</TableCell>
                  <TableCell>{obra.centroDeTrabajo?.nombre ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={obra.clasificacion === "DISTRITAL" ? "default" : "secondary"}>
                      {obra.clasificacion} · {obra.tamano === "MAYOR_2000" ? ">2000m²" : "<2000m²"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button render={<Link href={`/obras/${obra.id}`} />} variant="ghost" size="sm">
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
