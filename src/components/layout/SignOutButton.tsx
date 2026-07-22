"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SignOutButton({ className }: { className?: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn("gap-1.5", className)}
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      <LogOut className="size-3.5" />
      Cerrar sesión
    </Button>
  );
}
