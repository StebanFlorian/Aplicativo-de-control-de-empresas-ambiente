"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cambiarRolUsuario } from "@/lib/actions/admin-usuario.actions";

export function CambiarRolButton({
  userId,
  rolActual,
}: {
  userId: string;
  rolActual: "ADMIN" | "USUARIO";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const nuevoRol = rolActual === "ADMIN" ? "USUARIO" : "ADMIN";

  async function handleClick() {
    setLoading(true);
    const result = await cambiarRolUsuario(userId, nuevoRol);
    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success(`Rol actualizado a ${nuevoRol}.`);
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" disabled={loading} onClick={handleClick}>
      Hacer {nuevoRol === "ADMIN" ? "administrador" : "usuario común"}
    </Button>
  );
}
