import { useParams, usePathname } from "next/navigation";
import { Box, Cog, Home, KeyRound, Link, LogOut } from "lucide-react";

import { SidebarNavItem } from "@/types";

export function useMainNavigation() {
  const pathname = usePathname();
  const { workspaceId } = useParams();

  const navigations: SidebarNavItem[] = [
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
    },
  ];

  return navigations;
}
