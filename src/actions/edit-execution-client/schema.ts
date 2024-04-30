import { z } from "zod";

import {
  ExecutionClientAPI,
  ExecutionClientClients,
  ExecutionClientLogging,
  ExecutionClientSyncMode,
} from "@/enums";
import { Identifiers } from "@/schemas/identifiers";
import { EditImageVersion } from "@/schemas/image-version";
import { EditResources } from "@/schemas/resources";

const EditNetworking = z.object({
  nodePrivateKeySecretName: z.string().optional().nullable(),
  syncMode: z.nativeEnum(ExecutionClientSyncMode),
  staticNodes: z
    .string()
    .transform((value) =>
      value ? value.split("\n").filter((value) => !!value) : []
    ),
  bootnodes: z
    .string()
    .transform((value) =>
      value ? value.split("\n").filter((value) => !!value) : []
    ),
});

const EditAPI = z.object({
  client: z.nativeEnum(ExecutionClientClients, {
    errorMap: () => ({ message: "Please select a Client" }),
  }),
  engine: z.boolean(),
  jwtSecretName: z.string().optional().nullable(),
  rpc: z.boolean(),
  rpcAPI: z.array(z.nativeEnum(ExecutionClientAPI)).default([]).optional(),
  ws: z.boolean(),
  wsAPI: z.array(z.nativeEnum(ExecutionClientAPI)).default([]).optional(),
  graphql: z.boolean().optional(),
});

const EditAccessControl = z.object({
  hosts: z
    .string()
    .transform((value) =>
      value ? value.split("\n").filter((value) => !!value) : []
    )
    .refine((value) => !!value.length, {
      message: `Please specify your whitelisted hosts or "*" to whitelist all hosts`,
    }),
  corsDomains: z
    .string()
    .transform((value) =>
      value ? value.split("\n").filter((value) => !!value) : []
    )
    .refine((value) => !!value.length, {
      message: `Please specify your CORS domains or "*" to whitelist all domains`,
    }),
});

const EditLogs = z.object({
  logging: z.nativeEnum(ExecutionClientLogging),
});

export const EditExecutionClient = Identifiers.merge(EditImageVersion)
  .merge(EditResources)
  .merge(EditNetworking)
  .merge(EditAPI)
  .merge(EditAccessControl)
  .merge(EditLogs)
  .refine(({ engine, jwtSecretName }) => (engine && jwtSecretName) || !engine, {
    message: "Please select a JWT secret.",
    path: ["jwtSecretName"],
  })
  .refine(
    ({ rpc, graphql, client }) =>
      client === ExecutionClientClients["Go Ethereum"] && graphql
        ? rpc
        : typeof rpc === "boolean",
    {
      message:
        "JSON-RPC Server should be activated with GraphQl Server if client is Go Ethereum",
      path: ["rpc"],
    }
  )
  .refine(({ rpc, rpcAPI }) => (rpc ? !!rpcAPI?.length : !rpcAPI?.length), {
    message: "Select at least 1 API",
    path: ["rpcAPI"],
  })
  .refine(({ ws, wsAPI }) => (ws ? !!wsAPI?.length : !wsAPI?.length), {
    message: "Select at least 1 API",
    path: ["wsAPI"],
  })
  .transform(({ client, ...values }) => {
    return { ...values };
  });
