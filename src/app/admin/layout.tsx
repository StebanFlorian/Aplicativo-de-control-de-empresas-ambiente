import Link from "next/link";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/layout/SignOutButton";
import { auth } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.rol !== "ADMIN") redirect("/dashboard");

  return (
    <div className="min-h-screen">
      <nav className="border-b bg-muted/30 px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center gap-4 text-sm">
          <span className="font-semibold">Panel administrador</span>
          <Link href="/admin/obras" className="text-muted-foreground hover:text-foreground">
            Obras
          </Link>
          <Link href="/admin/centros" className="text-muted-foreground hover:text-foreground">
            Centros de trabajo
          </Link>
          <Link href="/admin/usuarios" className="text-muted-foreground hover:text-foreground">
            Usuarios
          </Link>
          <Link href="/admin/mapa" className="text-muted-foreground hover:text-foreground">
            Mapa
          </Link>
          <Link href="/obras" className="text-muted-foreground hover:text-foreground">
            Vista usuario
          </Link>
          <div className="ml-auto">
            <SignOutButton />
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
