"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getUniqueConstraintFields } from "@/lib/prisma-errors";
import { requireAdmin } from "@/lib/rbac";
import { usuarioAdminCreateSchema } from "@/lib/validators/usuario.schema";

function friendlyUniqueConstraintError(error: unknown): string | null {
  const fields = getUniqueConstraintFields(error);
  if (!fields) return null;

  if (fields.includes("numeroDocumento")) return "Ya existe un usuario con ese NIT/CC.";
  if (fields.includes("correo")) return "Ya existe un usuario con ese correo electrónico.";
  return "Ya existe un registro con esos datos.";
}

export async function crearUsuarioAdmin(input: unknown): Promise<{ error?: string }> {
  await requireAdmin();

  const parsed = usuarioAdminCreateSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const { password, confirmPassword: _confirmPassword, rol, ...usuario } = parsed.data;
  void _confirmPassword;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { ...usuario, passwordHash, rol },
    });
    revalidatePath("/admin/usuarios");
    return {};
  } catch (error) {
    const friendly = friendlyUniqueConstraintError(error);
    if (friendly) return { error: friendly };
    console.error(error);
    return { error: "No se pudo crear el usuario. Intenta de nuevo." };
  }
}

export async function asignarUsuarioObra(
  obraId: string,
  userId: string,
): Promise<{ error?: string }> {
  await requireAdmin();

  try {
    await prisma.obra.update({ where: { id: obraId }, data: { userId } });
    revalidatePath("/admin/obras");
    return {};
  } catch (error) {
    console.error(error);
    return { error: "No se pudo asignar la obra a ese usuario." };
  }
}

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
