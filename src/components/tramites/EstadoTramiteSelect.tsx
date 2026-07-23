"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { actualizarEstadoTramite } from "@/lib/actions/tramite.actions";
import { ESTADOS_TRAMITE, type EstadoTramite } from "@/lib/validators/tramite.schema";

const ETIQUETAS_ESTADO: Record<EstadoTramite, string> = {
  PENDIENTE: "Pendiente",
  RADICADO: "Radicado",
  EN_REVISION: "En revisión",
  APROBADO: "Aprobado",
  RECHAZADO: "Rechazado",
};

export function EstadoTramiteSelect({
  tramiteId,
  estadoActual,
}: {
  tramiteId: string;
  estadoActual: EstadoTramite;
}) {
  const router = useRouter();

  async function handleChange(estado: string | null) {
    if (!estado || estado === estadoActual) return;

    const result = await actualizarEstadoTramite(tramiteId, estado as EstadoTramite);
    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Estado del trámite actualizado.");
    router.refresh();
  }

  return (
    <Select value={estadoActual} onValueChange={handleChange}>
      <SelectTrigger size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ESTADOS_TRAMITE.map((estado) => (
          <SelectItem key={estado} value={estado}>
            {ETIQUETAS_ESTADO[estado]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { ETIQUETAS_ESTADO };
