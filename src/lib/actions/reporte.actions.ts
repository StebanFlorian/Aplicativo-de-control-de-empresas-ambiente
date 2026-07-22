"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { isOwnerOrAdmin, requireSession } from "@/lib/rbac";
import { reporte31Schema } from "@/lib/validators/reporte31.schema";

export async function crearReporte31(
  obraId: string,
  input: unknown,
): Promise<{ error?: string; reporteId?: string }> {
  const session = await requireSession();

  const obra = await prisma.obra.findUnique({ where: { id: obraId } });
  if (!obra) return { error: "La obra no existe." };
  if (!isOwnerOrAdmin(session, obra.userId)) {
    return { error: "No tienes permiso para reportar sobre esta obra." };
  }
  if (obra.clasificacion !== "DISTRITAL" || obra.tamano !== "MAYOR_2000") {
    return {
      error:
        "El Formulario 3.1 solo aplica a obras Distritales con área mayor a 2000 m². Esta obra usa otro formulario (próximamente disponible).",
    };
  }

  const parsed = reporte31Schema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const data = parsed.data;
  const itemsConCantidad = data.items.filter((i) => i.cantidadTon > 0);

  try {
    const reporte = await prisma.reporteRCD.create({
      data: {
        obraId,
        tipoFormulario: "FORM_3_1",
        periodoInicio: data.periodoInicio,
        periodoFin: data.periodoFin,
        estado: "ENVIADO",
        fechaEnvio: new Date(),
        adquisiciones: {
          createMany: {
            data: data.adquisiciones.map((a) => ({
              cantidadTon: a.cantidadTon,
              proveedor: a.proveedor,
            })),
          },
        },
        itemsRcd: {
          createMany: {
            data: itemsConCantidad.map((i) => ({
              rcdCatalogItemId: i.rcdCatalogItemId,
              cantidadTon: i.cantidadTon,
              tratamiento: i.tratamiento,
              lugarDisposicionFinal: i.lugarDisposicionFinal,
            })),
          },
        },
      },
    });

    revalidatePath(`/obras/${obraId}/reportes`);
    return { reporteId: reporte.id };
  } catch (error) {
    console.error(error);
    return { error: "No se pudo guardar el reporte. Intenta de nuevo." };
  }
}
