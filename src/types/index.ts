import {
  BeaconNodeClients,
  ChainlinkLogging,
  ConsensusAlgorithm,
  ExecutionClientAPI,
  ExecutionClientClients,
  ExecutionClientLogging,
  ExecutionClientSyncMode,
  IPFSConfigProfile,
  IPFSRouting,
  ValidatorClients,
} from "@/enums";

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

export interface BitcoinNode extends ClientImage, ResourcesInfo {
  name: string;
  network: string;
  rpc: boolean;
  txIndex: boolean;
  rpcUsers: { username: string; passwordSecretName: string }[];
  wallet: boolean;
  createdAt: string;
  p2pPort: number;
  rpcPort: number;
}

export interface ExecutionClientNode extends ClientImage, ResourcesInfo {
  name: string;
  client: ExecutionClientClients;
  network: string;
  nodePrivateKeySecretName: string;
  syncMode: ExecutionClientSyncMode;
  staticNodes: string[];
  bootnodes: string[];
  rpc: boolean;
  rpcAPI: ExecutionClientAPI[];
  ws: boolean;
  wsAPI: ExecutionClientAPI[];
  graphql: boolean;
  engine: boolean;
  jwtSecretName: string;
  hosts: string[];
  corsDomains: string[];
  miner: boolean;
  coinbase: string;
  import: {
    privateKeySecretName: string;
    passwordSecretName: string;
  };
  logging: ExecutionClientLogging;
  createdAt: string;
  p2pPort: number;
  rpcPort: number;
  wsPort: number;
  graphqlPort: number;
  enginePort: number;
}

export interface BeaconNode extends ClientImage, ResourcesInfo {
  name: string;
  client: BeaconNodeClients;
  executionEngineEndpoint: string;
  jwtSecretName: string;
  network: string;
  rest: boolean;
  rpc: boolean;
  grpc: boolean;
  checkpointSyncUrl: string;
  createdAt: string;
  restPort: number;
  rpcPort: number;
  grpcPort: number;
}

export interface ValidatorNode extends ClientImage, ResourcesInfo {
  name: string;
  network: string;
  client: ValidatorClients;
  walletPasswordSecretName: string;
  beaconEndpoints: string[];
  graffiti: string;
  createdAt: string;
  keystores: { secretName: string }[];
}

export interface ChainlinkNode extends ClientImage, ResourcesInfo {
  name: string;
  ethereumChainId: number;
  linkContractAddress: string;
  databaseURL: string;
  ethereumWsEndpoint: string;
  ethereumHttpEndpoints: string[] | null;
  keystorePasswordSecretName: string;
  apiCredentials: { email: string; passwordSecretName: string };
  api: boolean;
  certSecretName: string;
  tlsPort: number;
  secureCookies: boolean;
  corsDomains: string[];
  logging: ChainlinkLogging;
  createdAt: string;
}

export interface FilecoinNode extends ClientImage, ResourcesInfo {
  name: string;
  network: string;
  api: boolean;
  apiRequestTimeout: number;
  ipfsForRetrieval: boolean;
  ipfsPeerEndpoint: string;
  ipfsOnlineMode: boolean;
  disableMetadataLog: boolean;
  createdAt: string;
  apiPort: number;
  p2pPort: number;
}

export interface IPFSPeer extends ClientImage, ResourcesInfo {
  name: string;
  initProfiles: IPFSConfigProfile[];
  profiles: IPFSConfigProfile[];
  api: boolean;
  gateway: boolean;
  routing: IPFSRouting;
  createdAt: string;
}

export interface IPFSClusterPeer extends ClientImage, ResourcesInfo {
  name: string;
  consensus: ConsensusAlgorithm;
  id: string;
  privatekeySecretName?: string;
  trustedPeers: string[];
  createdAt: string;
}

export interface StatsError {
  error: string;
}

export interface AptosStats {
  currentBlock: string;
  peerCount: number;
}

export interface BitcoinStats {
  blockCount: number;
  peerCount: number;
}

export interface ExecutionClientStats {
  currentBlock: string;
  highestBlock: string;
  peersCount: number;
}

export interface BeaconStats {
  currentSlot: number;
  targetSlot: number;
  peersCount: number;
  syncing: boolean;
}

export interface IpfsPeerStats {
  PeerCount: number;
  PinCount: number;
  Blocks: number;
  CumulativeSize: number;
}
