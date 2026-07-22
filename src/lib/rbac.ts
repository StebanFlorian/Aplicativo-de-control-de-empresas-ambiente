import { auth } from "@/lib/auth";

export async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("No autenticado");
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireSession();
  if (session.user.rol !== "ADMIN") {
    throw new Error("Requiere rol de administrador");
  }
  return session;
}

export function isOwnerOrAdmin(session: { user: { id: string; rol: string } }, resourceUserId: string) {
  return session.user.id === resourceUserId || session.user.rol === "ADMIN";
}
