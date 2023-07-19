import { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  active: boolean;
};

export type SidebarNavItem = {
  title?: string;
  label?: string;
  active?: boolean;
  Icon: LucideIcon;
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
