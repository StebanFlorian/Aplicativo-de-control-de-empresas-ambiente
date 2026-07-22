import { z } from "zod";

import { BOGOTA_CIUDAD, BOGOTA_DEPARTAMENTO } from "@/lib/colombia-geo";

const soloNumeros = /^[0-9]+$/;

const obraObjectSchema = z.object({
  nombre: z.string().min(1, "El nombre de la obra es obligatorio."),
  telefono: z
    .union([z.string().regex(soloNumeros, "El teléfono debe ser numérico."), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),
  tipoVia: z.string().min(1, "Selecciona el tipo de vía."),
  direccion: z.string().min(1, "La dirección es obligatoria."),

  departamento: z.string().min(1, "Selecciona el departamento."),
  ciudad: z.string().min(1, "Selecciona la ciudad."),
  localidad: z
    .union([z.coerce.number().int().min(1).max(19), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),

  area: z.coerce.number().positive("El área debe ser mayor a 0."),
  fechaInicio: z.coerce.date({ message: "Fecha de inicio inválida." }),
  cantidadRcdProyectada: z.coerce
    .number()
    .positive("La cantidad de RCD a generar debe ser mayor a 0."),
  cantidadMaterialAUsar: z
    .union([z.coerce.number().nonnegative(), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),

  lat: z
    .union([z.coerce.number().min(-90).max(90), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),
  lng: z
    .union([z.coerce.number().min(-180).max(180), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),

  centroDeTrabajoId: z
    .union([z.string(), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),
});

// La hoja de cálculo marca "Localidad" como obligatoria en Formulario Obra,
// pero las localidades (1-19) solo existen dentro de Bogotá D.C. — se exige
// solo cuando departamento/ciudad = Bogotá D.C.
export const obraSchema = obraObjectSchema.superRefine((data, ctx) => {
  const esBogota = data.departamento === BOGOTA_DEPARTAMENTO && data.ciudad === BOGOTA_CIUDAD;
  if (esBogota && data.localidad === undefined) {
    ctx.addIssue({
      code: "custom",
      message: "La localidad es obligatoria para obras en Bogotá D.C.",
      path: ["localidad"],
    });
  }
});

export type ObraInput = z.infer<typeof obraObjectSchema>;
