"use server";

import { revalidatePath } from "next/cache";
import { del, put } from "@vercel/blob";

import { prisma } from "@/lib/prisma";
import { isOwnerOrAdmin, requireSession } from "@/lib/rbac";

const TAMANO_MAX_ARCHIVO = 15 * 1024 * 1024; // 15 MB
const MAX_ARCHIVOS_POR_SUBIDA = 10;

function archivosValidos(formData: FormData): File[] {
  return formData
    .getAll("archivos")
    .filter((v): v is File => v instanceof File && v.size > 0)
    .slice(0, MAX_ARCHIVOS_POR_SUBIDA);
}

// Documentos generales de la obra (fotos, actas, permisos), independientes
// de cualquier reporte periódico.
export async function subirDocumentosObra(
  obraId: string,
  formData: FormData,
): Promise<{ error?: string }> {
  const session = await requireSession();

  const obra = await prisma.obra.findUnique({ where: { id: obraId } });
  if (!obra) return { error: "La obra no existe." };
  if (!isOwnerOrAdmin(session, obra.userId)) {
    return { error: "No tienes permiso para subir documentos a esta obra." };
  }

  const archivos = archivosValidos(formData);
  if (archivos.length === 0) return { error: "Selecciona al menos un archivo." };
  if (archivos.some((a) => a.size > TAMANO_MAX_ARCHIVO)) {
    return { error: "Cada archivo debe pesar máximo 15 MB." };
  }

  const descripcion = formData.get("descripcion");

  try {
    for (const archivo of archivos) {
      const blob = await put(`documentos/obras/${obraId}/${Date.now()}-${archivo.name}`, archivo, {
        access: "private",
        addRandomSuffix: true,
      });

      await prisma.documento.create({
        data: {
          obraId,
          archivoUrl: blob.url,
          archivoNombreOriginal: archivo.name,
          descripcion: typeof descripcion === "string" && descripcion ? descripcion : undefined,
          uploadedById: session.user.id,
        },
      });
    }

    revalidatePath(`/obras/${obraId}`);
    return {};
  } catch (error) {
    console.error(error);
    return { error: "No se pudo subir el/los archivo(s). Intenta de nuevo." };
  }
}

// Documentos/evidencias asociados a un reporte periódico puntual.
export async function subirDocumentosReporte(
  reporteId: string,
  formData: FormData,
): Promise<{ error?: string }> {
  const session = await requireSession();

  const reporte = await prisma.reporteRCD.findUnique({
    where: { id: reporteId },
    include: { obra: true },
  });
  if (!reporte) return { error: "El reporte no existe." };
  if (!isOwnerOrAdmin(session, reporte.obra.userId)) {
    return { error: "No tienes permiso para subir documentos a este reporte." };
  }

  const archivos = archivosValidos(formData);
  if (archivos.length === 0) return { error: "Selecciona al menos un archivo." };
  if (archivos.some((a) => a.size > TAMANO_MAX_ARCHIVO)) {
    return { error: "Cada archivo debe pesar máximo 15 MB." };
  }

  const descripcion = formData.get("descripcion");

  try {
    for (const archivo of archivos) {
      const blob = await put(
        `documentos/reportes/${reporteId}/${Date.now()}-${archivo.name}`,
        archivo,
        { access: "private", addRandomSuffix: true },
      );

      await prisma.documento.create({
        data: {
          reporteId,
          archivoUrl: blob.url,
          archivoNombreOriginal: archivo.name,
          descripcion: typeof descripcion === "string" && descripcion ? descripcion : undefined,
          uploadedById: session.user.id,
        },
      });
    }

    revalidatePath(`/obras/${reporte.obraId}/reportes/${reporteId}`);
    return {};
  } catch (error) {
    console.error(error);
    return { error: "No se pudo subir el/los archivo(s). Intenta de nuevo." };
  }
}

export async function eliminarDocumento(documentoId: string): Promise<{ error?: string }> {
  const session = await requireSession();

  const documento = await prisma.documento.findUnique({
    where: { id: documentoId },
    include: { obra: true, reporte: { include: { obra: true } } },
  });
  if (!documento) return { error: "El documento no existe." };

  const obraDelDocumento = documento.obra ?? documento.reporte?.obra;
  if (!obraDelDocumento || !isOwnerOrAdmin(session, obraDelDocumento.userId)) {
    return { error: "No tienes permiso para eliminar este documento." };
  }

  try {
    await del(documento.archivoUrl);
    await prisma.documento.delete({ where: { id: documentoId } });

    if (documento.obraId) revalidatePath(`/obras/${documento.obraId}`);
    if (documento.reporteId && documento.reporte) {
      revalidatePath(`/obras/${documento.reporte.obraId}/reportes/${documento.reporteId}`);
    }
    return {};
  } catch (error) {
    console.error(error);
    return { error: "No se pudo eliminar el documento. Intenta de nuevo." };
  }
}
