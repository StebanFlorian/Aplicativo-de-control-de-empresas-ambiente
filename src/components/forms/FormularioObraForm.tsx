"use client";

import { useMemo, useState } from "react";
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
import {
  CIUDADES_POR_DEPARTAMENTO,
  DEPARTAMENTOS,
  LOCALIDADES_BOGOTA,
  TIPOS_VIA,
  esBogota,
} from "@/lib/colombia-geo";
import { obraSchema, type ObraInput } from "@/lib/validators/obra.schema";

function toDateInputValue(date?: Date) {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export function FormularioObraForm({
  defaultValues,
  onSubmit,
  successRedirect,
  redirectToObraDetail,
  centros = [],
}: {
  defaultValues?: Partial<ObraInput>;
  onSubmit: (data: ObraInput) => Promise<{ error?: string; obraId?: string }>;
  successRedirect?: string;
  redirectToObraDetail?: boolean;
  centros?: { id: string; nombre: string }[];
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const resolver: Resolver<ObraInput> = async (values, context, options) => {
    const zodValidate = zodResolver(obraSchema) as unknown as Resolver<ObraInput>;
    return zodValidate(values, context, options);
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ObraInput>({
    resolver,
    defaultValues: {
      tipoVia: "CL",
      departamento: "Bogotá D.C.",
      ciudad: "Bogotá D.C.",
      ...defaultValues,
      fechaInicio: defaultValues?.fechaInicio ?? new Date(),
    },
  });

  const tipoVia = watch("tipoVia");
  const departamento = watch("departamento");
  const ciudad = watch("ciudad");
  const localidad = watch("localidad");
  const fechaInicio = watch("fechaInicio");
  const centroDeTrabajoId = watch("centroDeTrabajoId");

  const ciudades = useMemo(
    () => CIUDADES_POR_DEPARTAMENTO[departamento] ?? [],
    [departamento],
  );
  const requiereLocalidad = esBogota(departamento, ciudad);

  async function submit(data: ObraInput) {
    setSubmitting(true);
    const result = await onSubmit(data);
    setSubmitting(false);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Obra guardada correctamente.");
    if (redirectToObraDetail && result.obraId) {
      router.push(`/obras/${result.obraId}`);
    } else if (successRedirect) {
      router.push(successRedirect);
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre de la obra</Label>
        <Input id="nombre" {...register("nombre")} />
        {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefono">Teléfono (opcional)</Label>
        <Input id="telefono" inputMode="numeric" {...register("telefono")} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tipoVia">Tipo de vía</Label>
          <Select value={tipoVia} onValueChange={(v) => v && setValue("tipoVia", v)}>
            <SelectTrigger id="tipoVia">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIPOS_VIA.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2 space-y-2">
          <Label htmlFor="direccion">Dirección</Label>
          <Input id="direccion" placeholder="Ej: 45 # 12-34" {...register("direccion")} />
          {errors.direccion && (
            <p className="text-sm text-destructive">{errors.direccion.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="departamento">Departamento</Label>
          <Select
            value={departamento}
            onValueChange={(v) => {
              if (!v) return;
              setValue("departamento", v);
              const primeraCiudad = CIUDADES_POR_DEPARTAMENTO[v]?.[0] ?? "";
              setValue("ciudad", primeraCiudad);
              setValue("localidad", undefined);
            }}
          >
            <SelectTrigger id="departamento">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DEPARTAMENTOS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.departamento && (
            <p className="text-sm text-destructive">{errors.departamento.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="ciudad">Ciudad</Label>
          <Select value={ciudad} onValueChange={(v) => v && setValue("ciudad", v)}>
            <SelectTrigger id="ciudad">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ciudades.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.ciudad && <p className="text-sm text-destructive">{errors.ciudad.message}</p>}
        </div>
      </div>

      {requiereLocalidad && (
        <div className="space-y-2">
          <Label htmlFor="localidad">Localidad</Label>
          <Select
            value={localidad ? String(localidad) : ""}
            onValueChange={(v) => setValue("localidad", v ? Number(v) : undefined)}
          >
            <SelectTrigger id="localidad">
              <SelectValue placeholder="Selecciona la localidad" />
            </SelectTrigger>
            <SelectContent>
              {LOCALIDADES_BOGOTA.map((l) => (
                <SelectItem key={l.value} value={String(l.value)}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.localidad && (
            <p className="text-sm text-destructive">{errors.localidad.message}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="area">Área (m²)</Label>
          <Input id="area" type="number" step="0.01" {...register("area")} />
          {errors.area && <p className="text-sm text-destructive">{errors.area.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="fechaInicio">Fecha de inicio</Label>
          <Input
            id="fechaInicio"
            type="date"
            value={toDateInputValue(fechaInicio)}
            onChange={(e) => setValue("fechaInicio", new Date(e.target.value))}
          />
          {errors.fechaInicio && (
            <p className="text-sm text-destructive">{errors.fechaInicio.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cantidadRcdProyectada">Cantidad de RCD a generar (Ton)</Label>
          <Input
            id="cantidadRcdProyectada"
            type="number"
            step="0.01"
            {...register("cantidadRcdProyectada")}
          />
          {errors.cantidadRcdProyectada && (
            <p className="text-sm text-destructive">{errors.cantidadRcdProyectada.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cantidadMaterialAUsar">Cantidad de material a usar (opcional)</Label>
          <Input
            id="cantidadMaterialAUsar"
            type="number"
            step="0.01"
            {...register("cantidadMaterialAUsar")}
          />
        </div>
      </div>

      {centros.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="centroDeTrabajoId">Centro de trabajo (opcional)</Label>
          <Select
            value={centroDeTrabajoId ?? "none"}
            onValueChange={(v) =>
              setValue("centroDeTrabajoId", !v || v === "none" ? undefined : v)
            }
          >
            <SelectTrigger id="centroDeTrabajoId">
              <SelectValue placeholder="Sin centro de trabajo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sin centro de trabajo</SelectItem>
              {centros.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lat">Latitud (opcional, para el mapa)</Label>
          <Input id="lat" type="number" step="any" {...register("lat")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lng">Longitud (opcional, para el mapa)</Label>
          <Input id="lng" type="number" step="any" {...register("lng")} />
        </div>
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? "Guardando..." : "Guardar obra"}
      </Button>
    </form>
  );
}
