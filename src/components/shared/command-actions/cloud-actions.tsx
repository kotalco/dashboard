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
        title: "Create Aptos Node",
        url: `/${workspaceId}/deployments/aptos/new`,
        Icon: Box,
      },
      {
        title: "Create Bitcoin Node",
        url: `/${workspaceId}/deployments/bitcoin/new`,
        Icon: Box,
      },
      {
        title: "Create Chainlink Node",
        url: `/${workspaceId}/deployments/chainlink/new`,
        Icon: Box,
      },
      {
        title: "Create Execution Client Node",
        url: `/${workspaceId}/deployments/ethereum/execution-clients/new`,
        Icon: Box,
      },
      {
        title: "Create Beacon Node",
        url: `/${workspaceId}/deployments/ethereum/beacon-nodes/new`,
        Icon: Box,
      },
      {
        title: "Create Validator",
        url: `/${workspaceId}/deployments/ethereum/validators/new`,
        Icon: Box,
      },
      {
        title: "Create Filecoin Node",
        url: `/${workspaceId}/deployments/filecoin/new`,
        Icon: Box,
      },
      {
        title: "Create IPFS Peer",
        url: `/${workspaceId}/deployments/ipfs/peers/new`,
        Icon: Box,
      },
      {
        title: "Create IPFS Cluster Peer",
        url: `/${workspaceId}/deployments/ipfs/cluster-peers/new`,
        Icon: Box,
      },
      {
        title: "Create NEAR Node",
        url: `/${workspaceId}/deployments/near/new`,
        Icon: Box,
      },
      {
        title: "Create Polkadot Node",
        url: `/${workspaceId}/deployments/polkadot/new`,
        Icon: Box,
      },
      {
        title: "Create Stacks Node",
        url: `/${workspaceId}/deployments/stacks/new`,
        Icon: Box,
      },
    ],
  },
  {
    groupTitle: "Endpoints & Secrets",
    actions: [
      {
        title: "Create Endpoint",
        url: `/${workspaceId}/endpoints/new`,
        Icon: Link,
      },
      {
        title: "Create Secret",
        url: `/${workspaceId}/secrets/new`,
        Icon: KeyRound,
      },
    ],
  },
  {
    groupTitle: "Settings",
    actions: [
      {
        title: "Account Settings",
        url: `/${workspaceId}/account`,
        Icon: User2,
      },
      {
        title: "Security",
        url: `/${workspaceId}/security`,
        Icon: Lock,
      },
    ],
  },
  {
    groupTitle: "Platform",
    actions: [
      {
        title: "Domain Configurations",
        url: `/${workspaceId}/domain`,
        Icon: Globe,
      },
      {
        title: "Registration Options",
        url: `/${workspaceId}/registration`,
        Icon: UserPlus2,
      },
    ],
  },
  {
    groupTitle: "Workspaces",
    actions: [
      {
        title: "Manage Wokspace Settings",
        url: `/${workspaceId}/settings`,
        Icon: Cog,
      },
      {
        title: "Manage Team Members",
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
