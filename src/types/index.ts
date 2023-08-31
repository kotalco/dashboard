export * from "@/types/auth";
export * from "@/types/workspaces";
export * from "@/types/nav";
export * from "@/types/settings";
export * from "@/types/secrets";

export interface MainNodeInfo {
  name: string;
  network: string;
  client: string;
  url: string;
}

export interface ResourcesInfo {
  cpu: string;
  cpuLimit: string;
  memory: string;
  memoryLimit: string;
  storage: string;
}

export interface ClientImage {
  image: string;
}

export interface Version {
  name: string;
  image: string;
  network?: string;
  releaseNotes: string;
  next: string;
  previous: string;
  canBeUpgraded: boolean;
  canBeDowngraded: boolean;
}

export interface Clients {
  clients: {
    [client: string]: {
      repository: string;
      versions: Version[];
    };
  };
}

export interface ClientVersions {
  version: string;
  protocols: {
    [protocol: string]: {
      components: {
        [node: string]: Clients;
      };
    };
  };
}

export interface AptosNode extends ClientImage, ResourcesInfo {
  name: string;
  network: string;
  api: boolean;
  createdAt: string;
  apiPort: number;
  metricsPort: number;
  nodePrivateKeySecretName: string;
  p2pPort: number;
  validator: boolean;
}

export interface StatsError {
  error: string;
}

export interface AptosStats {
  currentBlock: string;
  peerCount: number;
}
