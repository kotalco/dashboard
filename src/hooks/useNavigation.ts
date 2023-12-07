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

export function useMainNavigation(counts?: Record<string, number>) {
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
          active: pathname.includes("aptos"),
          count: counts?.aptos,
        },
        {
          label: "Bitcoin",
          href: `/${workspaceId}/deployments/bitcoin`,
          active: pathname.includes("bitcoin"),
          count: counts?.bitcoin,
        },
        {
          label: "Chainlink",
          href: `/${workspaceId}/deployments/chainlink`,
          active: pathname.includes("chainlink"),
          count: counts?.chainlink,
        },
        {
          label: "Ethereum",
          href: `/${workspaceId}/deployments/ethereum`,
          active: pathname.includes("ethereum"),
          count: counts?.ethereum,
        },
        {
          label: "Filecoin",
          href: `/${workspaceId}/deployments/filecoin`,
          active: pathname.includes("filecoin"),
          count: counts?.filecoin,
        },
        {
          label: "IPFS",
          href: `/${workspaceId}/deployments/ipfs`,
          active: pathname.includes("ipfs"),
          count: counts?.ipfs,
        },
        {
          label: "NEAR",
          href: `/${workspaceId}/deployments/near`,
          active: pathname.includes("near"),
          count: counts?.near,
        },
        {
          label: "Polkadot",
          href: `/${workspaceId}/deployments/polkadot`,
          active: pathname.includes("polkadot"),
          count: counts?.polkadot,
        },
        {
          label: "Stacks",
          href: `/${workspaceId}/deployments/stacks`,
          active: pathname.includes("stacks"),
          count: counts?.stacks,
        },
      ],
    },
    {
      label: "Endpoints",
      href: `/${workspaceId}/endpoints`,
      active: pathname.includes("endpoints"),
      Icon: Link,
      count: counts?.endpoints,
    },
    {
      label: "Secrets",
      href: `/${workspaceId}/secrets`,
      active: pathname.includes("secrets"),
      Icon: KeyRound,
      count: counts?.secrets,
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

  return { main, settings };
}
