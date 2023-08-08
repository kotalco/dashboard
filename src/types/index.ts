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
