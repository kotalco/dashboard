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
  const { workspaceId } = useParams();

  const { count: endpointsCount } = useVirtualEndpointsCount(
    workspaceId as string
  );

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
      href: `/${workspaceId}`,
      Icon: ArrowLeft,
    },
    {
      label: "Account",
      href: `/${workspaceId}/account`,
      active: pathname === `/${workspaceId}/account`,
      Icon: User2,
    },
    {
      label: "Security",
      href: `/${workspaceId}/security`,
      active: pathname === `/${workspaceId}/security`,
      Icon: Lock,
    },
    {
      title: "Platform",
      label: "Domain",
      href: `/${workspaceId}/domain`,
      active: pathname === `/${workspaceId}/domain`,
      Icon: Globe,
    },
    {
      label: "Registration",
      href: `/${workspaceId}/registration`,
      active: pathname === `/${workspaceId}/registration`,
      Icon: UserPlus2,
    },
    {
      title: "Workspaces",
      label: "Settings",
      href: `/${workspaceId}/settings`,
      active: pathname === `/${workspaceId}/settings`,
      Icon: Cog,
    },
    {
      label: "Members",
      href: `/${workspaceId}/members`,
      active: pathname === `/${workspaceId}/members`,
      Icon: Users2,
    },
  ];

  return { managed, settings };
}
