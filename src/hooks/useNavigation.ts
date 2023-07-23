import { useParams, usePathname } from "next/navigation";
import {
  ArrowLeft,
  Box,
  Cog,
  Globe,
  Home,
  KeyRound,
  Link,
  Lock,
  LogOut,
  User2,
  UserPlus2,
  Users2,
} from "lucide-react";

import { SidebarNavItem } from "@/types";

export function useMainNavigation() {
  const pathname = usePathname();
  const { workspaceId } = useParams();

  const main: SidebarNavItem[] = [
    {
      label: "Dashboard",
      href: `/${workspaceId}`,
      active: pathname === `/${workspaceId}`,
      Icon: Home,
    },
    {
      label: "Deployments",
      active: pathname.includes("deployments"),
      Icon: Box,
      items: [
        {
          label: "Aptos",
          href: `/${workspaceId}/deployments/aptos`,
          active: pathname === `/${workspaceId}/deployments/aptos`,
        },
        {
          label: "Bitcoin",
          href: `/${workspaceId}/deployments/bitcoin`,
          active: pathname === `/${workspaceId}/deployments/bitcoin`,
        },
        {
          label: "Chainlink",
          href: `/${workspaceId}/deployments/chainlink`,
          active: pathname === `/${workspaceId}/deployments/chainlink`,
        },
        {
          label: "Ethereum",
          href: `/${workspaceId}/deployments/ethereum`,
          active: pathname === `/${workspaceId}/deployments/ethereum`,
        },
        {
          label: "Filecoin",
          href: `/${workspaceId}/deployments/filecoin`,
          active: pathname === `/${workspaceId}/deployments/filecoin`,
        },
        {
          label: "IPFS",
          href: `/${workspaceId}/deployments/ipfs`,
          active: pathname === `/${workspaceId}/deployments/ipfs`,
        },
        {
          label: "NEAR",
          href: `/${workspaceId}/deployments/near`,
          active: pathname === `/${workspaceId}/deployments/near`,
        },
        {
          label: "Polkadot",
          href: `/${workspaceId}/deployments/polkadot`,
          active: pathname === `/${workspaceId}/deployments/polkadot`,
        },
        {
          label: "Stacks",
          href: `/${workspaceId}/deployments/stacks`,
          active: pathname === `/${workspaceId}/deployments/stacks`,
        },
      ],
    },
    {
      label: "Endpoints",
      href: `/${workspaceId}/endpoints`,
      active: pathname === `/${workspaceId}/endpoints`,
      Icon: Link,
    },
    {
      label: "Secrets",
      href: `/${workspaceId}/secrets`,
      active: pathname === `/${workspaceId}/secrets`,
      Icon: KeyRound,
    },
    {
      title: "Account",
      label: "Settings",
      href: `/${workspaceId}/account`,
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
      href: `/${workspaceId}/registrations`,
      active: pathname === `/${workspaceId}/Registrations`,
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

  return { main, settings };
}
