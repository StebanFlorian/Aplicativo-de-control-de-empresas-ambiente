import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.rol === "ADMIN") {
    redirect("/admin/obras");
  }

  redirect("/obras");
}
