"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { eliminarCentro } from "@/lib/actions/centro.actions";

export function EliminarCentroButton({ centroId }: { centroId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!confirm("¿Eliminar este centro de trabajo?")) return;

    setLoading(true);
    const result = await eliminarCentro(centroId);
    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Centro de trabajo eliminado.");
    router.refresh();
  }

  return (
    <Button variant="ghost" size="sm" disabled={loading} onClick={handleClick}>
      Eliminar
    </Button>
  );
}
