import { redirect } from "next/navigation";
import { Building2, ShieldCheck, UserRound } from "lucide-react";

import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar, type SidebarNavItem } from "@/components/layout/Sidebar";
import { auth } from "@/lib/auth";

const NAV_ITEMS: SidebarNavItem[] = [
  { href: "/obras", label: "Mis obras", icon: <Building2 className="size-4 shrink-0" /> },
  { href: "/perfil", label: "Mi perfil", icon: <UserRound className="size-4 shrink-0" /> },
];

const ADMIN_ITEM: SidebarNavItem = {
  href: "/admin/obras",
  label: "Panel administrador",
  icon: <ShieldCheck className="size-4 shrink-0" />,
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const items =
    session.user.rol === "ADMIN" ? [...NAV_ITEMS, ADMIN_ITEM] : NAV_ITEMS;

  return (
    <div className="flex min-h-screen">
      <Sidebar
        items={items}
        title="Control Ambiental RCD"
        numeroDocumento={session.user.name}
        rol={session.user.rol}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav items={items} title="Control Ambiental RCD" />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
