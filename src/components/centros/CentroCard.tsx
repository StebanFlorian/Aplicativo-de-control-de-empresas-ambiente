import Link from "next/link";
import { Network, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EliminarCentroButton } from "@/components/admin/EliminarCentroButton";

export function CentroCard({
  centro,
}: {
  centro: { id: string; nombre: string; descripcion: string | null; obrasCount: number };
}) {
  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader className="flex-row items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Network className="size-4.5" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold leading-tight">{centro.nombre}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {centro.descripcion || "Sin descripción"}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Badge variant="outline">
          {centro.obrasCount} {centro.obrasCount === 1 ? "obra asignada" : "obras asignadas"}
        </Badge>
        <div className="flex gap-2">
          <Button
            render={<Link href={`/admin/centros/${centro.id}/editar`} />}
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            <Pencil className="size-3.5" />
            Editar
          </Button>
          <EliminarCentroButton centroId={centro.id} />
        </div>
      </CardContent>
    </Card>
  );
}
