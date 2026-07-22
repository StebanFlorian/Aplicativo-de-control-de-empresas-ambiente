import Link from "next/link";
import { Building2, MapPin, Ruler } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export interface ObraCardData {
  id: string;
  nombre: string;
  ciudad: string;
  departamento: string;
  area: number;
  clasificacion: "DISTRITAL" | "NACIONAL";
  tamano: "MAYOR_2000" | "MENOR_2000";
  periodicidadReporte: "MENSUAL" | "TRIMESTRAL";
  centroDeTrabajo?: string | null;
  usuario?: string | null;
}

export function ObraCard({ obra }: { obra: ObraCardData }) {
  return (
    <Link href={`/obras/${obra.id}`} className="group block">
      <Card className="h-full transition-all group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-md">
        <CardHeader className="flex-row items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="size-4.5" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold leading-tight">{obra.nombre}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" />
                {obra.ciudad}, {obra.departamento}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <Badge variant={obra.clasificacion === "DISTRITAL" ? "default" : "secondary"}>
              {obra.clasificacion}
            </Badge>
            <Badge variant="outline">
              {obra.tamano === "MAYOR_2000" ? "> 2000 m²" : "< 2000 m²"}
            </Badge>
            <Badge variant="outline">{obra.periodicidadReporte.toLowerCase()}</Badge>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Ruler className="size-3" />
              {obra.area.toLocaleString("es-CO")} m²
            </span>
            {obra.centroDeTrabajo && <span className="truncate">{obra.centroDeTrabajo}</span>}
          </div>
          {obra.usuario && (
            <p className="text-xs text-muted-foreground">Usuario: {obra.usuario}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
