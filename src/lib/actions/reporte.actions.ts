"use server";

import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";

import { prisma } from "@/lib/prisma";
import { isOwnerOrAdmin, requireSession } from "@/lib/rbac";
import { reporte31Schema } from "@/lib/validators/reporte31.schema";

// Formularios que aún no tienen reglas de negocio propias (ver Milestone 7) y
// por ahora se cubren con un reporte "manual": mismo catálogo RCD que el
// Formulario 3.1, o un archivo adjunto preparado fuera del aplicativo.
const TIPOS_FORMULARIO_MANUAL = ["FORM_3_2", "OBRA_DISTRITAL_MENOR", "OBRA_NACIONAL"] as const;
type TipoFormularioManual = (typeof TIPOS_FORMULARIO_MANUAL)[number];

function esTipoFormularioManual(valor: string): valor is TipoFormularioManual {
  return (TIPOS_FORMULARIO_MANUAL as readonly string[]).includes(valor);
}

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
              rcdCatalogItemId: a.rcdCatalogItemId,
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

// Reporte manual con el mismo catálogo RCD del Formulario 3.1, para obras
// cuyo formulario oficial (3.2, 4, 5 o 6) todavía no tiene reglas de negocio
// propias. Sirve como reporte real mientras se definen esas reglas.
export async function crearReporteManual(
  obraId: string,
  tipoFormulario: string,
  input: unknown,
): Promise<{ error?: string; reporteId?: string }> {
  const session = await requireSession();

  if (!esTipoFormularioManual(tipoFormulario)) {
    return { error: "Tipo de formulario inválido." };
  }

  const obra = await prisma.obra.findUnique({ where: { id: obraId } });
  if (!obra) return { error: "La obra no existe." };
  if (!isOwnerOrAdmin(session, obra.userId)) {
    return { error: "No tienes permiso para reportar sobre esta obra." };
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
        tipoFormulario,
        periodoInicio: data.periodoInicio,
        periodoFin: data.periodoFin,
        estado: "ENVIADO",
        fechaEnvio: new Date(),
        adquisiciones: {
          createMany: {
            data: data.adquisiciones.map((a) => ({
              rcdCatalogItemId: a.rcdCatalogItemId,
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

const TAMANO_MAX_ARCHIVO = 15 * 1024 * 1024; // 15 MB

// Reporte enviado como archivo adjunto (PDF/Excel preparado fuera del
// aplicativo), para los mismos formularios que crearReporteManual cubre.
export async function crearReporteArchivo(
  obraId: string,
  tipoFormulario: string,
  formData: FormData,
): Promise<{ error?: string; reporteId?: string }> {
  const session = await requireSession();

  if (!esTipoFormularioManual(tipoFormulario)) {
    return { error: "Tipo de formulario inválido." };
  }

  const obra = await prisma.obra.findUnique({ where: { id: obraId } });
  if (!obra) return { error: "La obra no existe." };
  if (!isOwnerOrAdmin(session, obra.userId)) {
    return { error: "No tienes permiso para reportar sobre esta obra." };
  }

  const archivo = formData.get("archivo");
  const periodoInicioRaw = formData.get("periodoInicio");
  const periodoFinRaw = formData.get("periodoFin");

  if (!(archivo instanceof File) || archivo.size === 0) {
    return { error: "Adjunta un archivo." };
  }
  if (archivo.size > TAMANO_MAX_ARCHIVO) {
    return { error: "El archivo no puede superar 15 MB." };
  }
  if (typeof periodoInicioRaw !== "string" || typeof periodoFinRaw !== "string") {
    return { error: "Indica el periodo del reporte." };
  }

  const periodoInicio = new Date(periodoInicioRaw);
  const periodoFin = new Date(periodoFinRaw);
  if (Number.isNaN(periodoInicio.getTime()) || Number.isNaN(periodoFin.getTime())) {
    return { error: "Periodo inválido." };
  }

  try {
    const blob = await put(`reportes-rcd/${obraId}/${Date.now()}-${archivo.name}`, archivo, {
      access: "private",
      addRandomSuffix: true,
    });

    const reporte = await prisma.reporteRCD.create({
      data: {
        obraId,
        tipoFormulario,
        periodoInicio,
        periodoFin,
        estado: "ENVIADO",
        fechaEnvio: new Date(),
        archivoUrl: blob.url,
        archivoNombreOriginal: archivo.name,
      },
    });

    revalidatePath(`/obras/${obraId}/reportes`);
    return { reporteId: reporte.id };
  } catch (error) {
    console.error(error);
    return { error: "No se pudo subir el archivo. Intenta de nuevo." };
  }
}
