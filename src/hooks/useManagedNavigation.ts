import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  Cog,
  Link,
  Lock,
  LogOut,
  User2,
  CreditCard,
  FileText,
  Zap,
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
      title: "Subscription",
      label: "Manage Plan",
      href: `/billing/plan`,
      Icon: Zap,
    },
    {
      label: "Payment Methods",
      href: `/billing/payment-methods`,
      active: pathname.includes("payment-methods"),
      Icon: CreditCard,
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
