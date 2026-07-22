import { Network } from "lucide-react";

import { CentroDeTrabajoForm } from "@/components/forms/CentroDeTrabajoForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { crearCentro } from "@/lib/actions/centro.actions";

export default function NuevoCentroPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Network className="size-5 text-primary" />
            Nuevo centro de trabajo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CentroDeTrabajoForm onSubmit={crearCentro} />
        </CardContent>
      </Card>
    </div>
  );
}
