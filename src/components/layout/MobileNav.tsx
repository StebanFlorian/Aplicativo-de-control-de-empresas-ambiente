"use client";

import Link from "next/link";
import { Leaf, Menu } from "lucide-react";

import { SignOutButton } from "@/components/layout/SignOutButton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SidebarNavItem } from "@/components/layout/Sidebar";

export function MobileNav({ items, title }: { items: SidebarNavItem[]; title: string }) {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4 lg:hidden">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Leaf className="size-3.5" />
        </div>
        {title}
      </div>
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" aria-label="Abrir menú">
                <Menu className="size-5" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            {items.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    {item.icon}
                    {item.label}
                  </div>
                  {item.children.map(
                    (child) =>
                      child.href && (
                        <DropdownMenuItem
                          key={child.href}
                          className="pl-6"
                          render={<Link href={child.href} />}
                        >
                          {child.icon}
                          {child.label}
                        </DropdownMenuItem>
                      ),
                  )}
                </div>
              ) : (
                item.href && (
                  <DropdownMenuItem key={item.href} render={<Link href={item.href} />}>
                    {item.icon}
                    {item.label}
                  </DropdownMenuItem>
                )
              ),
            )}
            <DropdownMenuSeparator />
            <div className="px-1 py-1">
              <SignOutButton className="w-full justify-center" />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
