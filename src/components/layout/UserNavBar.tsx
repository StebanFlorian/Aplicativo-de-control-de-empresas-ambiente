"use client";

import Link from "next/link";

import { SignOutButton } from "@/components/layout/SignOutButton";

export function UserNavBar({
  numeroDocumento,
  rol,
}: {
  numeroDocumento?: string | null;
  rol?: string;
}) {
  return (
    <nav className="border-b bg-muted/30 px-4 py-3">
      <div className="mx-auto flex max-w-4xl items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="font-semibold">Control Ambiental RCD</span>
          <Link href="/obras" className="text-muted-foreground hover:text-foreground">
            Mis obras
          </Link>
          <Link href="/perfil" className="text-muted-foreground hover:text-foreground">
            Mi perfil
          </Link>
          {rol === "ADMIN" && (
            <Link href="/admin/obras" className="text-muted-foreground hover:text-foreground">
              Panel administrador
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">{numeroDocumento}</span>
          <SignOutButton />
        </div>
      </div>
    </nav>
  );
}
