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
