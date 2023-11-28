import { ChainlinkLogging } from "@/enums";
import { z } from "zod";

export const EditDatabase = z.object({
  databaseURL: z
    .string({ required_error: "Database connection URL is required" })
    .min(1, "Database connection URL is required")
    .trim()
    .refine((value) => /postgres:\/\//.test(value), {
      message: "Invalid database URL",
    }),
});

export const EditExecutionClient = z.object({
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

export const EditWallet = z.object({
  keystorePasswordSecretName: z.string({
    required_error: "Keystore password is required",
  }),
});

export const EditTLS = z
  .object({
    certSecretName: z.string().optional().nullable(),
    tlsPort: z.coerce.number().optional(),
    secureCookies: z.boolean(),
  })
  .transform((values) =>
    values.certSecretName
      ? values
      : { certSecretName: "", secureCookies: false }
  );

export const EditAPI = z.object({
  api: z.boolean(),
  apiCredentials: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid Email")
      .trim(),
    passwordSecretName: z.string({ required_error: "Password is required" }),
  }),
});

export const EditAccessControl = z.object({
  corsDomains: z
    .string()
    .transform((value) =>
      value ? value.split("\n").filter((value) => !!value) : []
    )
    .refine((value) => !!value.length, {
      message: `Please specify your CORS domains or "*" to whitelist all domains`,
    }),
});

export const EditLogs = z.object({
  logging: z.nativeEnum(ChainlinkLogging),
});
