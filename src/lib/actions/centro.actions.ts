"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/rbac";
import { centroSchema } from "@/lib/validators/centro.schema";

export async function crearCentro(input: unknown): Promise<{ error?: string; centroId?: string }> {
  await requireAdmin();

  const parsed = centroSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  try {
    const centro = await prisma.centroDeTrabajo.create({ data: parsed.data });
    revalidatePath("/admin/centros");
    return { centroId: centro.id };
  } catch (error) {
    console.error(error);
    return { error: "No se pudo crear el centro de trabajo." };
  }
}

export async function actualizarCentro(
  centroId: string,
  input: unknown,
): Promise<{ error?: string }> {
  await requireAdmin();

  const parsed = centroSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  try {
    await prisma.centroDeTrabajo.update({ where: { id: centroId }, data: parsed.data });
    revalidatePath("/admin/centros");
    return {};
  } catch (error) {
    console.error(error);
    return { error: "No se pudo actualizar el centro de trabajo." };
  }
}

export async function eliminarCentro(centroId: string): Promise<{ error?: string }> {
  await requireAdmin();

  try {
    await prisma.centroDeTrabajo.delete({ where: { id: centroId } });
    revalidatePath("/admin/centros");
    return {};
  } catch (error) {
    console.error(error);
    return { error: "No se pudo eliminar el centro de trabajo (verifica que no tenga obras asignadas)." };
  }
}
