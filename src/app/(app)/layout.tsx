import { redirect } from "next/navigation";

import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { getNavItems } from "@/components/layout/nav-items";
import { auth } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const items = getNavItems(session.user.rol);

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
