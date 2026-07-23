import { z } from "zod";

export const ESTADOS_TRAMITE = [
  "PENDIENTE",
  "RADICADO",
  "EN_REVISION",
  "APROBADO",
  "RECHAZADO",
] as const;

export type EstadoTramite = (typeof ESTADOS_TRAMITE)[number];

export const tramiteSchema = z.object({
  obraId: z.string().min(1, "Selecciona una obra."),
  nombre: z.string().min(1, "El nombre del trámite es obligatorio."),
  entidad: z
    .union([z.string(), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),
  fechaRadicado: z
    .union([z.coerce.date(), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),
  observaciones: z
    .union([z.string(), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),
});

export type TramiteInput = z.infer<typeof tramiteSchema>;
