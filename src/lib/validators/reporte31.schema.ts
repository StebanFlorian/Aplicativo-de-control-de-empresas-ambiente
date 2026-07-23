import { z } from "zod";

export const tipoTratamientoSchema = z.enum([
  "DISPOSICION_FINAL",
  "REUTILIZACION",
  "RECICLAJE",
  "OTROS",
]);

export const adquisicionMaterialSchema = z.object({
  rcdCatalogItemId: z.string().min(1, "Selecciona el tipo de material."),
  cantidadTon: z.coerce.number().positive("La cantidad debe ser mayor a 0."),
  proveedor: z.string().min(1, "El proveedor es obligatorio."),
});

export const reporteRcdItemSchema = z
  .object({
    rcdCatalogItemId: z.string().min(1),
    cantidadTon: z.coerce.number().nonnegative().default(0),
    tratamiento: tipoTratamientoSchema.optional(),
    lugarDisposicionFinal: z
      .union([z.string(), z.literal("")])
      .optional()
      .transform((v) => (v === "" || v === undefined ? undefined : v)),
  })
  .superRefine((data, ctx) => {
    if (data.cantidadTon > 0 && !data.tratamiento) {
      ctx.addIssue({
        code: "custom",
        message: "Selecciona el tipo de tratamiento para este residuo.",
        path: ["tratamiento"],
      });
    }
    if (data.tratamiento === "DISPOSICION_FINAL" && !data.lugarDisposicionFinal) {
      ctx.addIssue({
        code: "custom",
        message: "Indica el lugar de disposición final.",
        path: ["lugarDisposicionFinal"],
      });
    }
  });

export const reporte31Schema = z
  .object({
    periodoInicio: z.coerce.date({ message: "Fecha de inicio del periodo inválida." }),
    periodoFin: z.coerce.date({ message: "Fecha de fin del periodo inválida." }),
    adquisiciones: z.array(adquisicionMaterialSchema).default([]),
    items: z.array(reporteRcdItemSchema).default([]),
  })
  .superRefine((data, ctx) => {
    const algunaCantidad = data.items.some((i) => i.cantidadTon > 0);
    if (!algunaCantidad) {
      ctx.addIssue({
        code: "custom",
        message: "Registra al menos una cantidad de RCD mayor a 0.",
        path: ["items"],
      });
    }
  });

export type Reporte31Input = z.infer<typeof reporte31Schema>;
export type ReporteRcdItemInput = z.infer<typeof reporteRcdItemSchema>;
export type AdquisicionMaterialInput = z.infer<typeof adquisicionMaterialSchema>;
