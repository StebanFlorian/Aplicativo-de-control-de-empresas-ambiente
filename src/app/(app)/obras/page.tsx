import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export default async function ObrasPage() {
  const session = await requireSession();

  const obras = await prisma.obra.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Mis obras</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sesión iniciada como {session.user.name} ({session.user.rol}).
          </p>
        </div>
        <Button render={<Link href="/obras/nueva" />}>Registrar obra</Button>
      </div>

      <div className="mt-6">
        {obras.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aún no tienes obras registradas.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead>Clasificación</TableHead>
                <TableHead>Periodicidad</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {obras.map((obra) => (
                <TableRow key={obra.id}>
                  <TableCell className="font-medium">{obra.nombre}</TableCell>
                  <TableCell>{obra.ciudad}</TableCell>
                  <TableCell>
                    <Badge variant={obra.clasificacion === "DISTRITAL" ? "default" : "secondary"}>
                      {obra.clasificacion} · {obra.tamano === "MAYOR_2000" ? ">2000m²" : "<2000m²"}
                    </Badge>
                  </TableCell>
                  <TableCell>{obra.periodicidadReporte}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      render={<Link href={`/obras/${obra.id}`} />}
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
