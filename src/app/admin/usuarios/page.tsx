import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CambiarRolButton } from "@/components/admin/CambiarRolButton";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";

export default async function AdminUsuariosPage() {
  const session = await requireSession();

  const usuarios = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { obras: true } } },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Usuarios</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Administra el acceso y los roles de la plataforma.
        </p>
      </div>

      <Card className="mt-6">
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">NIT/CC</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Obras</TableHead>
                <TableHead className="pr-6" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="pl-6 font-medium">{u.numeroDocumento}</TableCell>
                  <TableCell className="text-muted-foreground">{u.correo}</TableCell>
                  <TableCell>
                    <Badge variant={u.rol === "ADMIN" ? "default" : "secondary"}>{u.rol}</Badge>
                  </TableCell>
                  <TableCell>{u._count.obras}</TableCell>
                  <TableCell className="pr-6 text-right">
                    {u.id !== session.user.id && (
                      <CambiarRolButton userId={u.id} rolActual={u.rol} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
