import { notFound } from "next/navigation";

import { FormularioUsuarioForm } from "@/components/forms/FormularioUsuarioForm";
import { actualizarPerfil } from "@/lib/actions/usuario.actions";
import { requireSession } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export default async function PerfilPage() {
  const session = await requireSession();
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Mi perfil</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Actualiza tus datos de contacto y notificación.
      </p>

      <div className="mt-6">
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
      </div>
    </div>
  );
}
