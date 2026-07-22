import Link from "next/link";
import { Leaf } from "lucide-react";

import { FormularioUsuarioForm } from "@/components/forms/FormularioUsuarioForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { registrarUsuario } from "@/lib/actions/usuario.actions";

export default function RegistroPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Leaf className="size-4.5" />
        </div>
        <span className="text-sm font-semibold">Control Ambiental RCD</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Registro de usuario</CardTitle>
          <p className="text-sm text-muted-foreground">
            Tu NIT o CC será tu usuario para ingresar a la plataforma.
          </p>
        </CardHeader>
        <CardContent>
          <FormularioUsuarioForm mode="registro" onSubmit={registrarUsuario} successRedirect="/login" />

          <p className="mt-6 text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
              Ingresa aquí
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
