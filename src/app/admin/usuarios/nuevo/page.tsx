import { UserPlus } from "lucide-react";

import { FormularioUsuarioForm } from "@/components/forms/FormularioUsuarioForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { crearUsuarioAdmin } from "@/lib/actions/admin-usuario.actions";

export default function NuevoUsuarioPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <UserPlus className="size-5 text-primary" />
            Nuevo usuario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormularioUsuarioForm
            mode="admin-crear"
            onSubmit={crearUsuarioAdmin}
            successRedirect="/admin/usuarios"
          />
        </CardContent>
      </Card>
    </div>
  );
}
