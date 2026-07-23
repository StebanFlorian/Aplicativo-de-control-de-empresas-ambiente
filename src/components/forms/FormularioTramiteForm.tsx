"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tramiteSchema, type TramiteInput } from "@/lib/validators/tramite.schema";

function toDateInputValue(date?: Date) {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export function FormularioTramiteForm({
  obras,
  defaultObraId,
  onSubmit,
}: {
  obras: { id: string; nombre: string }[];
  defaultObraId?: string;
  onSubmit: (data: TramiteInput) => Promise<{ error?: string; tramiteId?: string }>;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const resolver: Resolver<TramiteInput> = async (values, context, options) => {
    const zodValidate = zodResolver(tramiteSchema) as unknown as Resolver<TramiteInput>;
    return zodValidate(values, context, options);
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TramiteInput>({
    resolver,
    defaultValues: { obraId: defaultObraId ?? obras[0]?.id },
  });

  const obraId = watch("obraId");
  const fechaRadicado = watch("fechaRadicado");

  async function submit(data: TramiteInput) {
    setSubmitting(true);
    const result = await onSubmit(data);
    setSubmitting(false);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Trámite guardado correctamente.");
    if (result.tramiteId) router.push(`/tramites/${result.tramiteId}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="max-w-xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="obraId">Obra</Label>
        <Select value={obraId} onValueChange={(v) => v && setValue("obraId", v)}>
          <SelectTrigger id="obraId" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {obras.map((o) => (
              <SelectItem key={o.id} value={o.id}>
                {o.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.obraId && <p className="text-sm text-destructive">{errors.obraId.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre del trámite</Label>
        <Input
          id="nombre"
          placeholder="Ej: Permiso de vertimientos"
          {...register("nombre")}
        />
        {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="entidad">Entidad ambiental (opcional)</Label>
          <Input id="entidad" placeholder="Ej: Secretaría Distrital de Ambiente" {...register("entidad")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fechaRadicado">Fecha de radicado (opcional)</Label>
          <Input
            id="fechaRadicado"
            type="date"
            value={toDateInputValue(fechaRadicado)}
            onChange={(e) =>
              setValue("fechaRadicado", e.target.value ? new Date(e.target.value) : undefined)
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="observaciones">Observaciones (opcional)</Label>
        <Input id="observaciones" {...register("observaciones")} />
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? "Guardando..." : "Guardar trámite"}
      </Button>
    </form>
  );
}
