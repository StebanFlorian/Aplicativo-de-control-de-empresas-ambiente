import { auth } from "@/lib/auth";

export default async function ObrasPage() {
  const session = await auth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Mis obras</h1>
      <p className="mt-2 text-muted-foreground">
        Sesión iniciada como {session?.user?.name} ({session?.user?.rol}).
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        El registro de obras se implementa en el siguiente milestone.
      </p>
    </div>
  );
}
