"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { TIPOS_VIA, LOCALIDADES_BOGOTA } from "@/lib/colombia-geo";
import {
  usuarioPerfilSchema,
  usuarioRegistroSchema,
  type UsuarioPerfilInput,
  type UsuarioRegistroInput,
} from "@/lib/validators/usuario.schema";

type Mode = "registro" | "perfil";

type FormValues = UsuarioRegistroInput | UsuarioPerfilInput;

export function FormularioUsuarioForm({
  mode,
  defaultValues,
  onSubmit,
  successRedirect,
}: {
  mode: Mode;
  defaultValues?: Partial<UsuarioPerfilInput>;
  onSubmit: (data: FormValues) => Promise<{ error?: string }>;
  successRedirect?: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const schema = mode === "registro" ? usuarioRegistroSchema : usuarioPerfilSchema;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      tipoDocumento: "CC",
      tipoVia: "CL",
      ...defaultValues,
    },
  });

  const tipoVia = watch("tipoVia");
  const tipoDocumento = watch("tipoDocumento");
  const localidad = watch("localidad");

  async function submit(data: FormValues) {
    setSubmitting(true);
    const result = await onSubmit(data);
    setSubmitting(false);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success(mode === "registro" ? "Usuario registrado correctamente." : "Perfil actualizado.");
    if (successRedirect) router.push(successRedirect);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tipoDocumento">Natural o Jurídica</Label>
          <Select
            value={tipoDocumento}
            onValueChange={(v) => setValue("tipoDocumento", v as "NIT" | "CC")}
            disabled={mode === "perfil"}
          >
            <SelectTrigger id="tipoDocumento">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CC">CC (Natural)</SelectItem>
              <SelectItem value="NIT">NIT (Jurídica)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="numeroDocumento">Número de documento</Label>
          <Input
            id="numeroDocumento"
            disabled={mode === "perfil"}
            {...register("numeroDocumento")}
          />
          {errors.numeroDocumento && (
            <p className="text-sm text-destructive">{errors.numeroDocumento.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="correo">Correo electrónico</Label>
        <Input id="correo" type="email" {...register("correo")} />
        {errors.correo && <p className="text-sm text-destructive">{errors.correo.message}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tipoVia">Tipo de vía</Label>
          <Select value={tipoVia} onValueChange={(v) => setValue("tipoVia", v)}>
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
          <Label htmlFor="direccion">Dirección de notificación</Label>
          <Input id="direccion" placeholder="Ej: 45 # 12-34" {...register("direccion")} />
          {errors.direccion && (
            <p className="text-sm text-destructive">{errors.direccion.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="localidad">Localidad (opcional)</Label>
        <Select
          value={localidad ? String(localidad) : "none"}
          onValueChange={(v) => setValue("localidad", v === "none" ? undefined : Number(v))}
        >
          <SelectTrigger id="localidad">
            <SelectValue placeholder="Sin localidad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sin localidad</SelectItem>
            {LOCALIDADES_BOGOTA.map((l) => (
              <SelectItem key={l.value} value={String(l.value)}>
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" {...register("telefono")} />
          {errors.telefono && (
            <p className="text-sm text-destructive">{errors.telefono.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefono2">Teléfono 2 (opcional)</Label>
          <Input id="telefono2" {...register("telefono2")} />
        </div>
      </div>

      {mode === "registro" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              {...register("password" as keyof FormValues)}
            />
            {"password" in errors && (
              <p className="text-sm text-destructive">
                {(errors as { password?: { message?: string } }).password?.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword" as keyof FormValues)}
            />
            {"confirmPassword" in errors && (
              <p className="text-sm text-destructive">
                {(errors as { confirmPassword?: { message?: string } }).confirmPassword?.message}
              </p>
            )}
          </div>
        </div>
      )}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Guardando..." : mode === "registro" ? "Registrarme" : "Guardar cambios"}
      </Button>
    </form>
  );
}
