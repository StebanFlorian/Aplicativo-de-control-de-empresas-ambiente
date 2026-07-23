"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Leaf } from "lucide-react";

import { SignOutButton } from "@/components/layout/SignOutButton";
import { cn } from "@/lib/utils";

export interface SidebarNavItem {
  href?: string;
  label: string;
  icon: ReactNode;
  children?: SidebarNavItem[];
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

function groupIsActive(pathname: string, item: SidebarNavItem): boolean {
  if (item.href && isActive(pathname, item.href)) return true;
  return item.children?.some((child) => child.href && isActive(pathname, child.href)) ?? false;
}

function NavLink({ item, active }: { item: SidebarNavItem & { href: string }; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      {item.icon}
      {item.label}
    </Link>
  );
}

function NavGroup({ item, pathname }: { item: SidebarNavItem; pathname: string }) {
  const [open, setOpen] = useState(() => groupIsActive(pathname, item));

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          groupIsActive(pathname, item)
            ? "text-sidebar-foreground"
            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        )}
      >
        {item.icon}
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronDown className={cn("size-3.5 shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="mt-1 space-y-1 border-l border-sidebar-border pl-3">
          {item.children?.map((child) =>
            child.href ? (
              <NavLink key={child.href} item={{ ...child, href: child.href }} active={isActive(pathname, child.href)} />
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}

export function Sidebar({
  items,
  title,
  numeroDocumento,
  rol,
}: {
  items: SidebarNavItem[];
  title: string;
  numeroDocumento?: string | null;
  rol?: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground lg:flex">
      <div className="flex h-16 items-center gap-2 border-b px-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Leaf className="size-4" />
        </div>
        <span className="text-sm font-semibold leading-tight">{title}</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map((item) =>
          item.children ? (
            <NavGroup key={item.label} item={item} pathname={pathname} />
          ) : item.href ? (
            <NavLink key={item.href} item={{ ...item, href: item.href }} active={isActive(pathname, item.href)} />
          ) : null,
        )}
      </nav>

      <div className="border-t p-3">
        <div className="flex items-center justify-between rounded-lg px-2 py-1.5">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{numeroDocumento}</p>
            <p className="text-xs text-sidebar-foreground/60">{rol}</p>
          </div>
        </div>
        <div className="mt-2">
          <SignOutButton className="w-full justify-center" />
        </div>
      </div>
    </aside>
  );
}
