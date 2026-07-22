import { Building2 } from "lucide-react";

import { FormularioObraForm } from "@/components/forms/FormularioObraForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { crearObra } from "@/lib/actions/obra.actions";
import { prisma } from "@/lib/prisma";

export default async function NuevaObraPage() {
  const centros = await prisma.centroDeTrabajo.findMany({
    orderBy: { nombre: "asc" },
    select: { id: true, nombre: true },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Building2 className="size-5 text-primary" />
            Registrar obra
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Con estos datos calculamos automáticamente qué normativa aplica y la periodicidad de
            reporte.
          </p>
        </CardHeader>
        <CardContent>
          <FormularioObraForm onSubmit={crearObra} redirectToObraDetail centros={centros} />
        </CardContent>
      </Card>
    </div>
  );
}
