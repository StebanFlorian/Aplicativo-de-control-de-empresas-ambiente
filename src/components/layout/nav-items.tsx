import {
  ClipboardList,
  FilePlus2,
  FileText,
  Gavel,
  Leaf,
  MapPin,
  Network,
  UserCog,
  UserRound,
  Users,
} from "lucide-react";

import type { SidebarNavItem } from "@/components/layout/Sidebar";

const MODULOS_COMUNES: SidebarNavItem[] = [
  {
    label: "Componente Ambiental - RCD",
    icon: <Leaf className="size-4 shrink-0" />,
    children: [
      { href: "/obras/nueva", label: "Registro de obra", icon: <FilePlus2 className="size-4 shrink-0" /> },
      { href: "/obras", label: "Control de obra registrada", icon: <ClipboardList className="size-4 shrink-0" /> },
    ],
  },
  { href: "/reportes", label: "Reportes RCD", icon: <FileText className="size-4 shrink-0" /> },
  {
    href: "/tramites",
    label: "Trámites ante la Autoridad Ambiental",
    icon: <Gavel className="size-4 shrink-0" />,
  },
];

const MODULOS_ADMIN: SidebarNavItem[] = [
  { href: "/admin/obras", label: "Asignación de obras", icon: <UserCog className="size-4 shrink-0" /> },
  { href: "/admin/centros", label: "Centros de trabajo", icon: <Network className="size-4 shrink-0" /> },
  { href: "/admin/usuarios", label: "Usuarios", icon: <Users className="size-4 shrink-0" /> },
  { href: "/admin/mapa", label: "Mapa", icon: <MapPin className="size-4 shrink-0" /> },
];

const PERFIL_ITEM: SidebarNavItem = {
  href: "/perfil",
  label: "Mi perfil",
  icon: <UserRound className="size-4 shrink-0" />,
};

// El admin ve exactamente los mismos módulos que un usuario común, más las
// herramientas de administración — así el menú no "cambia" al navegar entre
// las páginas de usuario y las de admin (misma barra lateral en ambos layouts).
export function getNavItems(rol: "ADMIN" | "USUARIO"): SidebarNavItem[] {
  if (rol === "ADMIN") {
    return [...MODULOS_COMUNES, ...MODULOS_ADMIN, PERFIL_ITEM];
  }
  return [...MODULOS_COMUNES, PERFIL_ITEM];
}
