"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Leaf, Recycle, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      numeroDocumento,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("NIT/CC o contraseña incorrectos.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Panel de marca */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 60% 70%, white 1px, transparent 1px)",
            backgroundSize: "48px 48px, 72px 72px",
          }}
        />
        <div className="relative flex items-center gap-2 text-lg font-semibold">
          <Leaf className="size-6" />
          Control Ambiental RCD
        </div>

        <div className="relative space-y-6">
          <p className="max-w-sm text-3xl font-semibold leading-tight">
            Gestión y trazabilidad de residuos de construcción y demolición.
          </p>
          <ul className="space-y-3 text-sm text-primary-foreground/90">
            <li className="flex items-start gap-2">
              <Recycle className="mt-0.5 size-4 shrink-0" />
              Control de obras, clasificación normativa y metas de reporte.
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 size-4 shrink-0" />
              Acceso diferenciado para administradores y usuarios.
            </li>
          </ul>
        </div>

        <p className="relative text-xs text-primary-foreground/70">
          Ley 1257 de 2021 · Decreto 507 de 2023 (compilado en el Decreto 646 de 2025)
        </p>
      </div>

      {/* Formulario */}
      <div className="flex items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center gap-2 text-center lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Leaf className="size-5" />
            </div>
            <h1 className="text-lg font-semibold">Control Ambiental RCD</h1>
          </div>

          <div className="hidden lg:block">
            <h1 className="text-2xl font-semibold">Ingresar</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Usa tu NIT o CC y contraseña para acceder a la plataforma.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="numeroDocumento">NIT o CC</Label>
              <Input
                id="numeroDocumento"
                name="numeroDocumento"
                autoComplete="username"
                required
                value={numeroDocumento}
                onChange={(e) => setNumeroDocumento(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿Aún no tienes cuenta?{" "}
            <Link href="/registro" className="font-medium text-primary underline-offset-4 hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
