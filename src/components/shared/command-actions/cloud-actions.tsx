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
        title: "Aptos Nodes",
        url: `/${workspaceId}/deployments/aptos`,
        Icon: Box,
      },
      {
        title: "Bitcoin Nodes",
        url: `/${workspaceId}/deployments/bitcoin`,
        Icon: Box,
      },
      {
        title: "Chainlink Nodes",
        url: `/${workspaceId}/deployments/chainlink`,
        Icon: Box,
      },
      {
        title: "Execution Client Nodes",
        url: `/${workspaceId}/deployments/ethereum?tab=execution-clients`,
        Icon: Box,
      },
      {
        title: "Beacon Nodes",
        url: `/${workspaceId}/deployments/ethereum?tab=beacon-nodes`,
        Icon: Box,
      },
      {
        title: "Validators",
        url: `/${workspaceId}/deployments/ethereum?tab=validators`,
        Icon: Box,
      },
      {
        title: "Filecoin Nodes",
        url: `/${workspaceId}/deployments/filecoin`,
        Icon: Box,
      },
      {
        title: "IPFS Peers",
        url: `/${workspaceId}/deployments/ipfs?tab=peers`,
        Icon: Box,
      },
      {
        title: "IPFS Cluster Peers",
        url: `/${workspaceId}/deployments/ipfs?tab=cluster-peers`,
        Icon: Box,
      },
      {
        title: "NEAR Nodes",
        url: `/${workspaceId}/deployments/near`,
        Icon: Box,
      },
      {
        title: "Polkadot Nodes",
        url: `/${workspaceId}/deployments/polkadot`,
        Icon: Box,
      },
      {
        title: "Stacks Nodes",
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
