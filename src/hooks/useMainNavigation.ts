import { useParams, usePathname } from "next/navigation";
import { Box, Home, KeyRound, Link } from "lucide-react";

import { SidebarNavItem } from "@/types";

export function useMainNavigation() {
  const pathname = usePathname();
  const { workspaceId } = useParams();

  const navigations: SidebarNavItem[] = [
    {
      title: "Dashboard",
      href: `/${workspaceId}`,
      active: pathname === `/${workspaceId}`,
      Icon: Home,
    },
    {
      title: "Deployments",
      active: pathname.includes("deployments"),
      Icon: Box,
      items: [
        {
          title: "Aptos",
          href: `/${workspaceId}/deployments/aptos`,
          active: pathname === `/${workspaceId}/deployments/aptos`,
        },
        {
          title: "Bitcoin",
          href: `/${workspaceId}/deployments/bitcoin`,
          active: pathname === `/${workspaceId}/deployments/bitcoin`,
        },
        {
          title: "Chainlink",
          href: `/${workspaceId}/deployments/chainlink`,
          active: pathname === `/${workspaceId}/deployments/chainlink`,
        },
        {
          title: "Ethereum",
          href: `/${workspaceId}/deployments/ethereum`,
          active: pathname === `/${workspaceId}/deployments/ethereum`,
        },
        {
          title: "Filecoin",
          href: `/${workspaceId}/deployments/filecoin`,
          active: pathname === `/${workspaceId}/deployments/filecoin`,
        },
        {
          title: "IPFS",
          href: `/${workspaceId}/deployments/ipfs`,
          active: pathname === `/${workspaceId}/deployments/ipfs`,
        },
        {
          title: "NEAR",
          href: `/${workspaceId}/deployments/near`,
          active: pathname === `/${workspaceId}/deployments/near`,
        },
        {
          title: "Polkadot",
          href: `/${workspaceId}/deployments/polkadot`,
          active: pathname === `/${workspaceId}/deployments/polkadot`,
        },
        {
          title: "Stacks",
          href: `/${workspaceId}/deployments/stacks`,
          active: pathname === `/${workspaceId}/deployments/stacks`,
        },
      ],
    },
    {
      title: "Endpoints",
      href: `/${workspaceId}/endpoints`,
      active: pathname === `/${workspaceId}/endpoints`,
      Icon: Link,
    },
    {
      title: "Secrets",
      href: `/${workspaceId}/secrets`,
      active: pathname === `/${workspaceId}/secrets`,
      Icon: KeyRound,
    },
  ];

  return navigations;
}
