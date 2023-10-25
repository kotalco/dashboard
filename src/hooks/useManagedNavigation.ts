import { useParams, usePathname } from "next/navigation";
import {
  ArrowLeft,
  Cog,
  Globe,
  Link,
  Lock,
  LogOut,
  User2,
  UserPlus2,
  Users2,
} from "lucide-react";

import { SidebarNavItem } from "@/types";
import { useVirtualEndpointsCount } from "./useVirtualEndpointsCount";

export function useManagedNavigation() {
  const pathname = usePathname();

  const { count: endpointsCount } = useVirtualEndpointsCount();

  const managed: SidebarNavItem[] = [
    {
      label: "Endpoints",
      href: `/endpoints`,
      active: pathname.includes("endpoints"),
      Icon: Link,
      count: endpointsCount,
    },
    {
      title: "Account",
      label: "Settings",
      href: `/account`,
      Icon: Cog,
    },
    {
      label: "Logout",
      href: `/logout`,
      Icon: LogOut,
      prefetch: false,
    },
  ];

  const settings: SidebarNavItem[] = [
    {
      href: `/virtual-endpoints`,
      Icon: ArrowLeft,
    },
    {
      label: "Account",
      href: `/account`,
      active: pathname === `/account`,
      Icon: User2,
    },
    {
      label: "Security",
      href: `/account-security`,
      active: pathname === `/account-security`,
      Icon: Lock,
    },
  ];

  return { managed, settings };
}
