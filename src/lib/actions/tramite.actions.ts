"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { isOwnerOrAdmin, requireSession } from "@/lib/rbac";
import { tramiteSchema, type EstadoTramite } from "@/lib/validators/tramite.schema";

export async function crearTramite(
  input: unknown,
): Promise<{ error?: string; tramiteId?: string }> {
  const session = await requireSession();

  const parsed = tramiteSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const obra = await prisma.obra.findUnique({ where: { id: parsed.data.obraId } });
  if (!obra) return { error: "La obra no existe." };
  if (!isOwnerOrAdmin(session, obra.userId)) {
    return { error: "No tienes permiso para crear trámites en esta obra." };
  }

  try {
    const tramite = await prisma.tramiteAmbiental.create({
      data: {
        obraId: parsed.data.obraId,
        nombre: parsed.data.nombre,
        entidad: parsed.data.entidad,
        fechaRadicado: parsed.data.fechaRadicado,
        observaciones: parsed.data.observaciones,
      },
    });

    revalidatePath("/tramites");
    return { tramiteId: tramite.id };
  } catch (error) {
    console.error(error);
    return { error: "No se pudo crear el trámite. Intenta de nuevo." };
  }
}

export async function actualizarEstadoTramite(
  tramiteId: string,
  estado: EstadoTramite,
): Promise<{ error?: string }> {
  const session = await requireSession();

  const tramite = await prisma.tramiteAmbiental.findUnique({
    where: { id: tramiteId },
    include: { obra: true },
  });
  if (!tramite) return { error: "El trámite no existe." };
  if (!isOwnerOrAdmin(session, tramite.obra.userId)) {
    return { error: "No tienes permiso para actualizar este trámite." };
  }

  try {
    await prisma.tramiteAmbiental.update({ where: { id: tramiteId }, data: { estado } });
    revalidatePath(`/tramites/${tramiteId}`);
    revalidatePath("/tramites");
    return {};
  } catch (error) {
    console.error(error);
    return { error: "No se pudo actualizar el estado del trámite." };
  }
}
