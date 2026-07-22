"use server";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { getUniqueConstraintFields } from "@/lib/prisma-errors";
import { requireSession } from "@/lib/rbac";
import {
  usuarioPerfilSchema,
  usuarioRegistroSchema,
} from "@/lib/validators/usuario.schema";

function friendlyUniqueConstraintError(error: unknown): string | null {
  const fields = getUniqueConstraintFields(error);
  if (!fields) return null;

  if (fields.includes("numeroDocumento")) return "Ya existe un usuario con ese NIT/CC.";
  if (fields.includes("correo")) return "Ya existe un usuario con ese correo electrónico.";
  return "Ya existe un registro con esos datos.";
}

export async function registrarUsuario(input: unknown): Promise<{ error?: string }> {
  const parsed = usuarioRegistroSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const { password, confirmPassword: _confirmPassword, ...usuario } = parsed.data;
  void _confirmPassword;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        ...usuario,
        passwordHash,
        rol: "USUARIO",
      },
    });
    return {};
  } catch (error) {
    const friendly = friendlyUniqueConstraintError(error);
    if (friendly) return { error: friendly };
    console.error(error);
    return { error: "No se pudo registrar el usuario. Intenta de nuevo." };
  }
}

export async function actualizarPerfil(input: unknown): Promise<{ error?: string }> {
  const session = await requireSession();

  const parsed = usuarioPerfilSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const { numeroDocumento: _numeroDocumento, tipoDocumento: _tipoDocumento, ...editable } =
    parsed.data;
  void _numeroDocumento;
  void _tipoDocumento;

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: editable,
    });
    return {};
  } catch (error) {
    const friendly = friendlyUniqueConstraintError(error);
    if (friendly) return { error: friendly };
    console.error(error);
    return { error: "No se pudo actualizar el perfil. Intenta de nuevo." };
  }
}
