import { z } from "zod";

export const centroSchema = z.object({
  nombre: z.string().min(1, "El nombre del centro de trabajo es obligatorio."),
  descripcion: z
    .union([z.string(), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),
});

export type CentroInput = z.infer<typeof centroSchema>;
