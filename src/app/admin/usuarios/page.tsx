import { Badge } from "@/components/ui/badge";
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
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Usuarios</h1>

      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NIT/CC</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Obras</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.numeroDocumento}</TableCell>
                <TableCell>{u.correo}</TableCell>
                <TableCell>
                  <Badge variant={u.rol === "ADMIN" ? "default" : "secondary"}>{u.rol}</Badge>
                </TableCell>
                <TableCell>{u._count.obras}</TableCell>
                <TableCell className="text-right">
                  {u.id !== session.user.id && (
                    <CambiarRolButton userId={u.id} rolActual={u.rol} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
