import { usePathname } from "next/navigation";

import {
  ArrowLeft,
  Cog,
  Link,
  Lock,
  LogOut,
  User2,
  CreditCard,
  Zap,
} from "lucide-react";

import { SidebarNavItem } from "@/types";

export function useManagedNavigation(endpointsCount?: number) {
  const pathname = usePathname();

  const managed: SidebarNavItem[] = [
    {
      label: "Endpoints",
      href: `/virtual-endpoints`,
      active: pathname.includes("endpoints"),
      Icon: Link,
      count: endpointsCount,
    },
    {
      label: "My Plan",
      href: `/billing/plan`,
      Icon: Zap,
    },
    {
      position: "bottom",
      label: "Settings",
      href: `/account`,
      Icon: Cog,
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
      label: "Payment Methods",
      href: `/payment-methods`,
      active: pathname.includes("payment-methods"),
      Icon: CreditCard,
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
