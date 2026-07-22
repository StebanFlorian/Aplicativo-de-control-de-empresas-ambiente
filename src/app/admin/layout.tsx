import { redirect } from "next/navigation";
import { Building2, MapPin, Network, UserRound, Users } from "lucide-react";

import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar, type SidebarNavItem } from "@/components/layout/Sidebar";
import { auth } from "@/lib/auth";

const ADMIN_NAV_ITEMS: SidebarNavItem[] = [
  { href: "/admin/obras", label: "Obras", icon: Building2 },
  { href: "/admin/centros", label: "Centros de trabajo", icon: Network },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/mapa", label: "Mapa", icon: MapPin },
  { href: "/obras", label: "Vista usuario", icon: UserRound },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.rol !== "ADMIN") redirect("/dashboard");

  return (
    <div className="flex min-h-screen">
      <Sidebar
        items={ADMIN_NAV_ITEMS}
        title="Panel administrador"
        numeroDocumento={session.user.name}
        rol={session.user.rol}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav items={ADMIN_NAV_ITEMS} title="Panel administrador" />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
