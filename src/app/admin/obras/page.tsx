import { auth } from "@/lib/auth";

export default async function AdminObrasPage() {
  const session = await auth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Obras (administrador)</h1>
      <p className="mt-2 text-muted-foreground">
        Sesión iniciada como {session?.user?.name} ({session?.user?.rol}).
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        El panel de administrador se implementa en los siguientes milestones.
      </p>
    </div>
  );
}
