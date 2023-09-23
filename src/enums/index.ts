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

export enum Protocol {
  aptos = "aptos",
  bitcoin = "bitcoin",
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
  Eth = "eth",
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
