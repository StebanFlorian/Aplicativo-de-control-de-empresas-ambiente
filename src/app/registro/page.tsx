import Link from "next/link";

import { FormularioUsuarioForm } from "@/components/forms/FormularioUsuarioForm";
import { registrarUsuario } from "@/lib/actions/usuario.actions";

export default function RegistroPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Registro de usuario</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Tu NIT o CC será tu usuario para ingresar a la plataforma.
      </p>

      <div className="mt-6">
        <FormularioUsuarioForm
          mode="registro"
          onSubmit={registrarUsuario}
          successRedirect="/login"
        />
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/login" className="underline">
          Ingresa aquí
        </Link>
        .
      </p>
    </div>
  );
}
