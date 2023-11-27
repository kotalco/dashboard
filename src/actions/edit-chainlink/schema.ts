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
