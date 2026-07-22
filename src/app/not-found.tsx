import Link from "next/link";
import { Leaf } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Leaf className="size-6" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">Página no encontrada</h1>
      <p className="text-sm text-muted-foreground">
        El recurso que buscas no existe o no tienes acceso a él.
      </p>
      <Button render={<Link href="/dashboard" />}>Volver al inicio</Button>
    </div>
  );
}
