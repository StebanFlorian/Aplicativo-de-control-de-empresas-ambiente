import { redirect } from "next/navigation";

import { UserNavBar } from "@/components/layout/UserNavBar";
import { auth } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen">
      <UserNavBar numeroDocumento={session.user.name} rol={session.user.rol} />
      {children}
    </div>
  );
}
