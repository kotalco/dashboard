import { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  active: boolean;
  count?: number;
};

export type SidebarNavItem = {
  title?: string;
  label?: string;
  active?: boolean;
  prefetch?: boolean;
  count?: number;
  Icon: LucideIcon;
  position?: "top" | "bottom";
} & (
  | {
      href: string;
      items?: never;
    }
  | {
      href?: string;
      items: NavItem[];
    }
);
