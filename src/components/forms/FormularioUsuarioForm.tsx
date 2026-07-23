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
import { TIPOS_VIA, LOCALIDADES_BOGOTA } from "@/lib/colombia-geo";
import {
  usuarioAdminCreateSchema,
  usuarioPerfilSchema,
  usuarioRegistroSchema,
  type UsuarioAdminCreateInput,
  type UsuarioPerfilInput,
  type UsuarioRegistroInput,
} from "@/lib/validators/usuario.schema";

type Mode = "registro" | "perfil" | "admin-crear";

// Se usa siempre la forma "superset" (admin-crear) como tipo del formulario;
// en los otros modos simplemente no se registran/envían algunos campos.
type FormValues = UsuarioAdminCreateInput;

export function FormularioUsuarioForm({
  mode,
  defaultValues,
  onSubmit,
  successRedirect,
}: {
  mode: Mode;
  defaultValues?: Partial<UsuarioPerfilInput>;
  onSubmit: (
    data: UsuarioRegistroInput | UsuarioPerfilInput | UsuarioAdminCreateInput,
  ) => Promise<{ error?: string }>;
  successRedirect?: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const resolver: Resolver<FormValues> = async (values, context, options) => {
    const schema =
      mode === "admin-crear"
        ? usuarioAdminCreateSchema
        : mode === "registro"
          ? usuarioRegistroSchema
          : usuarioPerfilSchema;
    const zodValidate = zodResolver(schema) as unknown as Resolver<FormValues>;
    return zodValidate(values, context, options);
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver,
    defaultValues: {
      tipoDocumento: "CC",
      tipoVia: "CL",
      rol: "USUARIO",
      ...defaultValues,
    },
  });

  const tipoVia = watch("tipoVia");
  const tipoDocumento = watch("tipoDocumento");
  const localidad = watch("localidad");
  const rol = watch("rol");

  async function submit(data: FormValues) {
    setSubmitting(true);
    const result = await onSubmit(data);
    setSubmitting(false);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success(
      mode === "perfil" ? "Perfil actualizado." : "Usuario registrado correctamente.",
    );
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
            onValueChange={(v) => v && setValue("tipoDocumento", v as "NIT" | "CC")}
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
          onValueChange={(v) =>
            setValue("localidad", !v || v === "none" ? undefined : Number(v))
          }
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

      {(mode === "registro" || mode === "admin-crear") && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>
      )}

      {mode === "admin-crear" && (
        <div className="space-y-2">
          <Label htmlFor="rol">Rol</Label>
          <Select value={rol} onValueChange={(v) => v && setValue("rol", v as "ADMIN" | "USUARIO")}>
            <SelectTrigger id="rol">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USUARIO">Usuario común</SelectItem>
              <SelectItem value="ADMIN">Administrador</SelectItem>
            </SelectContent>
          </Select>
          {errors.rol && <p className="text-sm text-destructive">{errors.rol.message}</p>}
        </div>
      )}

      <Button type="submit" disabled={submitting}>
        {submitting
          ? "Guardando..."
          : mode === "perfil"
            ? "Guardar cambios"
            : mode === "admin-crear"
              ? "Crear usuario"
              : "Registrarme"}
      </Button>
    </form>
  );
}
