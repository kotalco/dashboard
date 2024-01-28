import { z } from "zod";

import { ChainlinkLogging } from "@/enums";
import { Identifiers } from "@/schemas/identifiers";
import { EditImageVersion } from "@/schemas/image-version";
import { EditResources } from "@/schemas/resources";

const EditDatabase = z.object({
  databaseURL: z
    .string({ required_error: "Database connection URL is required" })
    .min(1, "Database connection URL is required")
    .trim()
    .refine((value) => /postgres:\/\//.test(value), {
      message: "Invalid database URL",
    }),
});

const EditExecutionClient = z.object({
  ethereumWsEndpoint: z
    .string({ required_error: "Ethereum websocket is required" })
    .min(1, "Ethereum websocket is required")
    .trim()
    .refine((value) => /wss?:\/\//.test(value), {
      message: "Invalid websocket URL",
    }),
  ethereumHttpEndpoints: z
    .array(z.string())
    .nullable()
    .refine(
      (value) =>
        !value || value.every((endpoint) => /https?:\/\//.test(endpoint)),
      {
        message: "Invalid HTTP URL",
      }
    ),
});

const EditWallet = z.object({
  keystorePasswordSecretName: z.string({
    required_error: "Keystore password is required",
  }),
});

const EditTLS = z.object({
  certSecretName: z.string().optional().nullable(),
  tlsPort: z.coerce.number().optional().nullable(),
  secureCookies: z.boolean(),
});

const EditAPI = z.object({
  api: z.boolean(),
  apiCredentials: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid Email")
      .trim(),
    passwordSecretName: z.string({ required_error: "Password is required" }),
  }),
});

const EditAccessControl = z.object({
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
  logging: z.nativeEnum(ChainlinkLogging),
});

export const EditChainlinkNode = Identifiers.merge(EditImageVersion)
  .merge(EditDatabase)
  .merge(EditExecutionClient)
  .merge(EditWallet)
  .merge(EditTLS)
  .merge(EditAPI)
  .merge(EditAccessControl)
  .merge(EditLogs)
  .merge(EditResources);
