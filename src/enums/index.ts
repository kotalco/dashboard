export enum StorageItems {
  NEW_ACCOUNT = "NEW_ACCOUNT",
  EMAIL_VERIFIED = "EMAIL_VERIFIED",
  AUTH_TOKEN = "AUTH_TOKEN",
  LAST_WORKSPACE_ID = "LAST_WORKSPACE_ID",
}

export enum Roles {
  Admin = "admin",
  Writer = "writer",
  Reader = "reader",
}

export enum SecretType {
  "Execution Client Private Key" = "ethereum_privatekey",
  "Ethereum Keystore" = "ethereum2_keystore",
  "IPFS Swarm Key" = "ipfs_swarm_key",
  "IPFS Cluster Secret" = "ipfs_cluster_secret",
  "IPFS Cluster Peer Key" = "ipfs_cluster_peer_privatekey",
  "JWT Secret" = "jwt_secret",
  "NEAR Private Key" = "near_private_key",
  Password = "password",
  "Polkadot Private Key" = "polkadot_private_key",
  "Stacks Private Key" = "stacks_private_key",
  "TLS Certificate" = "tls_certificate",
}

export enum AptosNetworks {
  Mainnet = "mainnet",
  Testnet = "testnet",
  Devnet = "devnet",
}

export enum BitcoinNetworks {
  Mainnet = "mainnet",
  Testnet = "testnet",
}

export enum FilecoinNetworks {
  Mainnet = "mainnet",
  Calibration = "calibration",
}

export enum NEARNetworks {
  Mainnet = "mainnet",
  Testnet = "testnet",
  Betanet = "betanet",
}

export enum StacksNetworks {
  Mainnet = "mainnet",
  Testnet = "testnet",
}

export enum Protocol {
  Aptos = "aptos",
  Bitcoin = "bitcoin",
  Ethereum = "ethereum",
  Ethereum2 = "ethereum2",
  Chainlink = "chainlink",
  Filecoin = "filecoin",
  IPFS = "ipfs",
  NEAR = "near",
  Polkadot = "polkadot",
  Stacks = "stacks",
}

export enum ProtocolsWithoutEthereum2 {
  APTOS = "aptos",
  BITCOIN = "bitcoin",
  CHAINLINK = "chainlink",
  ETHEREUM = "ethereum",
  FILECOIN = "filecoin",
  IPFS = "ipfs",
  NEAR = "near",
  POLKADOT = "polkadot",
  STACKS = "stacks",
}

export enum IPFSConfigProfile {
  server = "server",
  randomports = "randomports",
  "default-datastore" = "default-datastore",
  "local-discovery" = "local-discovery",
  test = "test",
  "default-networking" = "default-networking",
  flatfs = "flatfs",
  badgerds = "badgerds",
  lowpower = "lowpower",
}

export enum IPFSRouting {
  None = "none",
  DHT = "dht",
  "DHT Client" = "dhtclient",
  "DHT Server" = "dhtserver",
}

export enum ConsensusAlgorithm {
  CRDT = "crdt",
  RAFT = "raft",
}

export enum NodeStatuses {
  "Connection Error" = "ConnectionError",
  "Loading Info" = "LoadingInfo",
  "Pod Initializing" = "PodInitializing",
  "Container Creating" = "ContainerCreating",
  "Terminating" = "Terminating",
  "Not Found" = "NotFound",
  "Error" = "Error",
  "Pending" = "Pending",
  "Running" = "Running",
  "Disconnected" = "Disconnected",
  "Crash Loop Back Off" = "CrashLoopBackOff",
}

export enum StorageUnits {
  Megabyte = "Mi",
  Gigabyte = "Gi",
  Terabyte = "Ti",
}

export enum ExecutionClientClients {
  "Go Ethereum" = "geth",
  "Hyperledger Besu" = "besu",
  Nethermind = "nethermind",
}

export enum ExecutionClientSyncMode {
  Fast = "fast",
  Full = "full",
  Light = "light",
  Snap = "snap",
}

export enum ExecutionClientAPI {
  ETH = "eth",
  Net = "net",
  Web3 = "web3",
}

export enum ExecutionClientLogging {
  All = "all",
  Debug = "debug",
  Error = "error",
  Fatal = "fatal",
  Info = "info",
  Warn = "warn",
  Trace = "trace",
  Off = "off",
}

export enum BeaconNodeClients {
  "ConsenSys Teku" = "teku",
  "Prysatic Labs Prysm" = "prysm",
  "Sigma Prime Lighthouse" = "lighthouse",
  "Status.im Nimbus" = "nimbus",
}

export enum ValidatorClients {
  "ConsenSys Teku" = "teku",
  "Prysatic Labs Prysm" = "prysm",
  "Sigma Prime Lighthouse" = "lighthouse",
  "Status.im Nimbus" = "nimbus",
}

export enum ExecutionClientNetworks {
  Mainnet = "mainnet",
  Sepolia = "sepolia",
  Goerli = "goerli",
}

export enum BeaconNodeNetworks {
  Mainnet = "mainnet",
  Sepolia = "sepolia",
  Goerli = "goerli",
}

export enum ValidatorNetworks {
  Mainnet = "mainnet",
  Sepolia = "sepolia",
  Goerli = "goerli",
}

export enum ChainlinkLogging {
  Debug = "debug",
  Info = "info",
  Warn = "warn",
  Error = "error",
  Panic = "panic",
}

export enum ChainlinkNetworks {
  "Ethereum Mainnet" = "1:0x514910771af9ca656af840dff83e8264ecf986ca",
  "Ethereum Kovan" = "42:0xa36085F69e2889c224210F603D836748e7dC0088",
  "Ethereum Rinkeby" = "4:0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
  "Ethereum Goerli" = "5:0x326c977e6efc84e512bb9c30f76e30c160ed06fb",
  "Binance Smart Chain Mainnet" = "56:0x404460c6a5ede2d891e8297795264fde62adbb75",
  "Binance Smart Chain Testnet" = "97:0x84b9b910527ad5c03a9ca831909e21e236ea7b06",
  "Polygon (Matic) Mainnet" = "137:0xb0897686c545045afc77cf20ec7a532e3120e0f1",
  "Polygon (Matic) Mumbai Testnet" = "80001:0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
  "RSK Mainnet" = "30:0x14adae34bef7ca957ce2dde5add97ea050123827",
  "xDai Mainnet" = "100:0xE2e73A1c69ecF83F464EFCE6A5be353a37cA09b2",
  "Avalanche Mainnet" = "43114:0x5947BB275c521040051D82396192181b413227A3",
  "Avalanche Fuji Testnet" = "43113:0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
  "Fantom Mainnet" = "250:0x6F43FF82CCA38001B6699a8AC47A2d0E66939407",
  "Fantom Testnet" = "4002:0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F",
  "Arbitrum Rinkeby Testnet" = "421611:0x615fBe6372676474d9e6933d310469c9b68e9726",
  "Huobi Eco Chain Mainnet" = "128:0x9e004545c59D359F6B7BFB06a26390b087717b42",
  "Optimism Mainnet" = "10:0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6",
  "Optimism Kovan Testnet" = "69:0x4911b761993b9c8c0d14Ba2d86902AF6B0074F5B",
}

export enum PolkadotNetworks {
  Polkadot = "polkadot",
  Kusama = "kusama",
  Rococo = "rococo",
  Westend = "westend",
}

export enum PolkadotSyncModes {
  Fast = "fast",
  Full = "full",
}

export enum PolkadotLogging {
  Error = "error",
  Warn = "warn",
  Info = "info",
  Debug = "debug",
  Trace = "trace",
}

export enum SubscriptionStatus {
  Active = "active",
  Cancelled = "cancelled",
  "Past Due" = "past_due",
  Incomplete = "incomplete",
  "Incomplete Expired" = "incomplete_expired",
  Unpaid = "unpaid",
}
