import Link from "next/link";

import { EliminarCentroButton } from "@/components/admin/EliminarCentroButton";
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

export default async function AdminCentrosPage() {
  const centros = await prisma.centroDeTrabajo.findMany({
    orderBy: { nombre: "asc" },
    include: { _count: { select: { obras: true } } },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Centros de trabajo</h1>
        <Button render={<Link href="/admin/centros/nuevo" />}>Nuevo centro</Button>
      </div>

      <div className="mt-6">
        {centros.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay centros de trabajo creados.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Obras asignadas</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {centros.map((centro) => (
                <TableRow key={centro.id}>
                  <TableCell className="font-medium">{centro.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {centro.descripcion ?? "—"}
                  </TableCell>
                  <TableCell>{centro._count.obras}</TableCell>
                  <TableCell className="flex justify-end gap-2 text-right">
                    <Button
                      render={<Link href={`/admin/centros/${centro.id}/editar`} />}
                      variant="outline"
                      size="sm"
                    >
                      Editar
                    </Button>
                    <EliminarCentroButton centroId={centro.id} />
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
