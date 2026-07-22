import { notFound } from "next/navigation";
import { UserRound } from "lucide-react";

import { FormularioUsuarioForm } from "@/components/forms/FormularioUsuarioForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { actualizarPerfil } from "@/lib/actions/usuario.actions";
import { requireSession } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export default async function PerfilPage() {
  const session = await requireSession();
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <UserRound className="size-5 text-primary" />
            Mi perfil
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Actualiza tus datos de contacto y notificación.
          </p>
        </CardHeader>
        <CardContent>
          <FormularioUsuarioForm
            mode="perfil"
            onSubmit={actualizarPerfil}
            defaultValues={{
              tipoDocumento: user.tipoDocumento,
              numeroDocumento: user.numeroDocumento,
              correo: user.correo,
              tipoVia: user.tipoVia,
              direccion: user.direccion,
              localidad: user.localidad ?? undefined,
              telefono: user.telefono,
              telefono2: user.telefono2 ?? undefined,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
