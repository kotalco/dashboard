import { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  active: boolean;
};

export type SidebarNavItem = {
  title: string;
  active: boolean;
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
