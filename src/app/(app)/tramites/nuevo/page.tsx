import { Gavel } from "lucide-react";

import { FormularioTramiteForm } from "@/components/forms/FormularioTramiteForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { crearTramite } from "@/lib/actions/tramite.actions";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";

export default async function NuevoTramitePage() {
  const session = await requireSession();
  const esAdmin = session.user.rol === "ADMIN";

  const obras = await prisma.obra.findMany({
    where: esAdmin ? undefined : { userId: session.user.id },
    orderBy: { nombre: "asc" },
    select: { id: true, nombre: true },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Gavel className="size-5 text-primary" />
            Nuevo trámite
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Registra un permiso, licencia o radicado ante la autoridad ambiental.
          </p>
        </CardHeader>
        <CardContent>
          {obras.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Primero debes registrar una obra antes de crear un trámite.
            </p>
          ) : (
            <FormularioTramiteForm obras={obras} onSubmit={crearTramite} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
