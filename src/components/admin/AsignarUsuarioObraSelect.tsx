"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { asignarUsuarioObra } from "@/lib/actions/admin-usuario.actions";

export function AsignarUsuarioObraSelect({
  obraId,
  usuarioActualId,
  usuarios,
}: {
  obraId: string;
  usuarioActualId: string;
  usuarios: { id: string; numeroDocumento: string }[];
}) {
  const router = useRouter();

  async function handleChange(userId: string | null) {
    if (!userId || userId === usuarioActualId) return;

    const result = await asignarUsuarioObra(obraId, userId);
    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Obra reasignada correctamente.");
    router.refresh();
  }

  return (
    <Select value={usuarioActualId} onValueChange={handleChange}>
      <SelectTrigger className="w-full" size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {usuarios.map((u) => (
          <SelectItem key={u.id} value={u.id}>
            {u.numeroDocumento}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
