import { z } from "zod";

const soloNumeros = /^[0-9]+$/;

// Campos comunes del "Formulario Usuario" (hoja "1. Formulario Usuario").
export const usuarioBaseSchema = z.object({
  tipoDocumento: z.enum(["NIT", "CC"], {
    message: "Selecciona NIT o CC.",
  }),
  numeroDocumento: z
    .string()
    .min(1, "El NIT o CC es obligatorio.")
    .regex(soloNumeros, "El NIT o CC debe ser numérico."),
  correo: z.string().min(1, "El correo es obligatorio.").email("Correo electrónico inválido."),
  tipoVia: z.string().min(1, "Selecciona el tipo de vía."),
  direccion: z.string().min(1, "La dirección de notificación es obligatoria."),
  localidad: z
    .union([z.coerce.number().int().min(1).max(19), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),
  telefono: z
    .string()
    .min(1, "El teléfono es obligatorio.")
    .regex(soloNumeros, "El teléfono debe ser numérico."),
  telefono2: z
    .union([z.string().regex(soloNumeros, "El teléfono 2 debe ser numérico."), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),
});

export type UsuarioBaseInput = z.infer<typeof usuarioBaseSchema>;

export const usuarioRegistroSchema = usuarioBaseSchema
  .extend({
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
    confirmPassword: z.string().min(1, "Confirma la contraseña."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export type UsuarioRegistroInput = z.infer<typeof usuarioRegistroSchema>;

export const usuarioPerfilSchema = usuarioBaseSchema;

export type UsuarioPerfilInput = z.infer<typeof usuarioPerfilSchema>;
