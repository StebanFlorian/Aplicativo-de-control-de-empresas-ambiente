"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { centroSchema, type CentroInput } from "@/lib/validators/centro.schema";

export function CentroDeTrabajoForm({
  defaultValues,
  onSubmit,
}: {
  defaultValues?: Partial<CentroInput>;
  onSubmit: (data: CentroInput) => Promise<{ error?: string; centroId?: string }>;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const resolver: Resolver<CentroInput> = async (values, context, options) => {
    const zodValidate = zodResolver(centroSchema) as unknown as Resolver<CentroInput>;
    return zodValidate(values, context, options);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CentroInput>({
    resolver,
    defaultValues,
  });

  async function submit(data: CentroInput) {
    setSubmitting(true);
    const result = await onSubmit(data);
    setSubmitting(false);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Centro de trabajo guardado.");
    router.push("/admin/centros");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="max-w-lg space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input id="nombre" {...register("nombre")} />
        {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción (opcional)</Label>
        <Input id="descripcion" {...register("descripcion")} />
      </div>
      <Button type="submit" disabled={submitting}>
        {submitting ? "Guardando..." : "Guardar"}
      </Button>
    </form>
  );
}
