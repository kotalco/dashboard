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
  InvoiceStatus,
  NEARNetworks,
  PolkadotLogging,
  PolkadotNetworks,
  PolkadotSyncModes,
  Protocol,
  SubscriptionStatus,
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

export type RPCUser = {
  username: string;
  passwordSecretName: string;
};

export interface BitcoinNode extends ClientImage, ResourcesInfo {
  name: string;
  network: string;
  rpc: boolean;
  txIndex: boolean;
  rpcUsers: [RPCUser, ...RPCUser[]];
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
  peerEndpoint: string;
  bootstrapPeers: string[];
  clusterSecretName: string;
  createdAt: string;
}

export interface NEARNode extends ClientImage, ResourcesInfo {
  name: string;
  network: NEARNetworks;
  archive: boolean;
  nodePrivateKeySecretName: string;
  minPeers: number;
  p2pPort: number;
  bootnodes: string[] | null;
  validatorSecretName: string;
  telemetryURL: string;
  prometheusPort: number;
  rpc: boolean;
  rpcPort: number;
  createdAt: string;
}

export interface PolkadotNode extends ClientImage, ResourcesInfo {
  name: string;
  network: PolkadotNetworks;
  p2pPort: number;
  nodePrivateKeySecretName: string;
  syncMode: PolkadotSyncModes;
  retainedBlocks: number;
  pruning: boolean;
  validator: boolean;
  telemetry: boolean;
  telemetryURL: string;
  prometheus: boolean;
  prometheusPort?: number;
  rpc: boolean;
  rpcPort?: number;
  ws: boolean;
  wsPort: number;
  corsDomains: string[];
  createdAt: string;
  logging: PolkadotLogging;
}

export interface StacksNode extends ClientImage, ResourcesInfo {
  name: string;
  network: string;
  image: string;
  bitcoinNode: {
    endpoint: string;
    p2pPort: string;
    rpcPort: string;
    rpcUsername: string;
    rpcPasswordSecretName: string;
  };
  nodePrivateKeySecretName: string;
  rpc: boolean;
  mineMicroBlocks: boolean;
  miner: boolean;
  seedPrivateKeySecretName: string;
  createdAt: string;
  p2pPort: number;
  rpcPort: number;
}

export interface Endpoint {
  name: string;
  protocol: Protocol;
  routes: {
    name: string;
    route: string;
    example: string;
    references: string[];
  }[];
  created_at: string;
}

export interface Service {
  name: string;
  protocol: Protocol;
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

export interface NEARStats {
  activePeersCount: number;
  maxPeersCount: number;
  sentBytesPerSecond: number;
  receivedBytesPerSecond: number;
  latestBlockHeight: number;
  earliestBlockHeight: number;
  syncing: boolean;
}

export interface PolkadotStats {
  currentBlock: number;
  highestBlock: number;
  peersCount: number;
  syncing: boolean;
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

export interface InvoiceItem {
  amount: number;
  currency: "usd";
  description: string;
  end_date: number;
  start_date: number;
}

export interface Invoice {
  id: string;
  amount_paid: number;
  amount_due: number;
  amount_remaining: number;
  currency: "usd";
  start_date: number;
  end_date: number;
  period: "monthly";
  created_at: number;
  status: InvoiceStatus;
  description: string;
  hosted_url: string;
  invoice_pdf: string;
  next_payment_attempt: number;
  provider_payment_intent_id: string;
  items: InvoiceItem[];
}

export interface PlanPrice {
  id: string;
  period: "monthly";
  price: number;
  currency: "usd";
  default: boolean;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  features: string[];
  prices: PlanPrice[];
  request_limit: number;
}

export interface Subscription {
  name?: string;
  id: string;
  status: SubscriptionStatus;
  start_date: number;
  end_date: number;
  canceled_at?: number;
  plan: Omit<Plan, "prices">;
  price: PlanPrice;
  request_limit?: number;
  endpoint_limit?: number;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  features: string[];
  prices: PlanPrice[];
  request_limit: number;
  endpoint_limit: number;
}

export interface Proration {
  credit_balance: number;
  total: number;
  amount_due: number;
  currency: "usd";
  items: {
    amount: number;
    description: string;
    currency: "usd";
  }[];
}

export interface UpdatePlanStatus {
  client_secret: string;
  status: SubscriptionStatus;
}

export interface CreditBalance {
  balance: number;
  currency: string;
}

export interface ProrationFormState {
  message: string | null;
  data: {
    proration: Proration;
    price: string;
    subscription_id: string;
    plan_id: string;
    price_id: string;
  } | null;
}

export interface PaymentCard {
  id: string;
  provider: "stripe";
  provider_id: string;
  brand:
    | "visa"
    | "amex"
    | "diners"
    | "discover"
    | "jcb"
    | "mastercard"
    | "unionppay"
    | "unknown";
  country: string;
  exp_month: number;
  exp_year: number;
  last4: string;
  default: boolean;
}
