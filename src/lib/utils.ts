import {
  BeaconNodeClients,
  ExecutionClientClients,
  NodeStatuses,
} from "@/enums";
import { Clients, Plan } from "@/types";
import { AxiosResponse } from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function responseInterceptor(response: AxiosResponse<{ data: any }>) {
  if (response.config.responseType === "blob") {
    return response;
  }
  response.data = response.data.data;

  return response;
}

export function getEnumKey<T extends Record<string, string>>(
  enumObj: T,
  value: string
): keyof T {
  return (
    (Object.keys(enumObj).find((key) => enumObj[key] === value) as keyof T) ||
    value
  );
}

export function getSelectItems<T extends Record<string, string>>(
  enumObj: T
): { label: keyof T; value: (typeof enumObj)[keyof typeof enumObj] }[] {
  return Object.keys(enumObj).map((key) => ({
    label: key,
    value: enumObj[key as keyof typeof enumObj],
  }));
}

// if ws base url is absolute path, convert it to full url
// exmaple: /api/v1 will be converted to ws://domain/api/v1
export const getWsBaseURL = function () {
  let url = process.env.NEXT_PUBLIC_WS_API_URL;

  if (url?.startsWith("/")) {
    const tls = location.protocol.endsWith("s:");
    const domain = location.host;
    url = (tls ? "wss" : "ws") + "://" + domain + url;
  }

  return url;
};

export const getStatusColor = (value: NodeStatuses) => {
  switch (value) {
    case NodeStatuses["Container Creating"]:
    case NodeStatuses["Pod Initializing"]:
    case NodeStatuses.Terminating:
      return "#F59E0B";
    case NodeStatuses.Pending:
    case NodeStatuses["Loading Info"]:
      return "#6B7280";
    case NodeStatuses.Running:
      return "#10B981";
    default:
      return "#EF4444";
  }
};

export const getLatestVersion = (
  data: Clients,
  client: string,
  network?: string
) => {
  let versions = data.clients[client].versions;

  if (network) {
    versions = versions.filter((version) => version.network === network);
  }

  if (versions.length > 1) {
    versions.reverse();
  }

  return versions[0].image;
};

export const getClientUrl = (client: string) => {
  switch (client) {
    case ExecutionClientClients["Go Ethereum"]:
      return "https://github.com/ethereum/go-ethereum";
    case ExecutionClientClients["Hyperledger Besu"]:
      return "https://github.com/hyperledger/besu";
    case ExecutionClientClients.Nethermind:
      return "https://github.com/NethermindEth/nethermind";
    case BeaconNodeClients["ConsenSys Teku"]:
      return "https://github.com/ConsenSys/teku";
    case BeaconNodeClients["Prysatic Labs Prysm"]:
      return "https://github.com/prysmaticlabs/prysm";
    case BeaconNodeClients["Sigma Prime Lighthouse"]:
      return "https://github.com/sigp/lighthouse";
    case BeaconNodeClients["Status.im Nimbus"]:
      return "https://github.com/status-im/nimbus-eth2";
    default:
      return "#";
  }
};

export function calculateRemainingDays(secondsInUnix: number) {
  return (
    secondsInUnix !== 0 &&
    Math.ceil(
      (new Date(secondsInUnix * 1000).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );
}

export function formatCurrency(valueInCents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(valueInCents / 100);
}

export const findPrice = (plan: Plan) =>
  plan.prices.find(({ period }) => period === "monthly");

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
