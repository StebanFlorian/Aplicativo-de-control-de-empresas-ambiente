"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/rbac";

export async function cambiarRolUsuario(
  userId: string,
  nuevoRol: "ADMIN" | "USUARIO",
): Promise<{ error?: string }> {
  const session = await requireAdmin();

  if (session.user.id === userId) {
    return { error: "No puedes cambiar tu propio rol." };
  }

  try {
    await prisma.user.update({ where: { id: userId }, data: { rol: nuevoRol } });
    revalidatePath("/admin/usuarios");
    return {};
  } catch (error) {
    console.error(error);
    return { error: "No se pudo actualizar el rol del usuario." };
  }
}
