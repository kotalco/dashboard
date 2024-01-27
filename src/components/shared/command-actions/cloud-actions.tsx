"use client";

import { useParams } from "next/navigation";
import {
  Box,
  Cog,
  Globe,
  KeyRound,
  Link,
  Lock,
  User2,
  UserPlus2,
  Users2,
} from "lucide-react";

import { CommandActions, TCommandActions } from "./command-actions";

export const getCloudActions: (workspaceId: string) => TCommandActions = (
  workspaceId
) => [
  {
    groupTitle: "Deployments",
    actions: [
      {
        title: "Aptos",
        url: `/${workspaceId}/deployments/aptos`,
        Icon: Box,
      },
      {
        title: "Bitcoin",
        url: `/${workspaceId}/deployments/bitcoin`,
        Icon: Box,
      },
      {
        title: "Chainlink",
        url: `/${workspaceId}/deployments/chainlink`,
        Icon: Box,
      },
      {
        title: "Ethereum",
        url: `/${workspaceId}/deployments/ethereum`,
        Icon: Box,
      },
      {
        title: "Filecoin",
        url: `/${workspaceId}/deployments/filecoin`,
        Icon: Box,
      },
      {
        title: "IPFS",
        url: `/${workspaceId}/deployments/ipfs`,
        Icon: Box,
      },
      {
        title: "NEAR",
        url: `/${workspaceId}/deployments/near`,
        Icon: Box,
      },
      {
        title: "Polkadot",
        url: `/${workspaceId}/deployments/polkadot`,
        Icon: Box,
      },
      {
        title: "Stacks",
        url: `/${workspaceId}/deployments/stacks`,
        Icon: Box,
      },
    ],
  },
  {
    groupTitle: "Endpoints & Secrets",
    actions: [
      {
        title: "Endpoints",
        url: `/${workspaceId}/endpoints`,
        Icon: Link,
      },
      {
        title: "Secrets",
        url: `/${workspaceId}/secrets`,
        Icon: KeyRound,
      },
    ],
  },
  {
    groupTitle: "Settings",
    actions: [
      {
        title: "Account",
        url: `/${workspaceId}/account`,
        Icon: User2,
      },
      {
        title: "Security",
        url: `/${workspaceId}/security`,
        Icon: Lock,
      },
      {
        title: "Domain",
        url: `/${workspaceId}/domain`,
        Icon: Globe,
      },
      {
        title: "Registration",
        url: `/${workspaceId}/registration`,
        Icon: UserPlus2,
      },
      {
        title: "Wokspace",
        url: `/${workspaceId}/settings`,
        Icon: Cog,
      },
      {
        title: "Team Members",
        url: `/${workspaceId}/members`,
        Icon: Users2,
      },
    ],
  },
];

export const CloudActions = () => {
  const { workspaceId } = useParams();

  const commands = getCloudActions(workspaceId as string);

  return <CommandActions commands={commands} />;
};
