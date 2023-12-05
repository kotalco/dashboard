import { z } from "zod";

import { ValidatorClients } from "@/enums";

export const CreateValidator = z
  .object({
    name: z
      .string()
      .min(1, "Node name is required")
      .max(64, "Too long name")
      .trim()
      .refine((value) => /^\S*$/.test(value), {
        message: "Invalid character used",
      }),
    client: z.nativeEnum(ValidatorClients, {
      errorMap: () => ({ message: "Client is required" }),
    }),
    network: z
      .string({ required_error: "Network is required" })
      .min(1, "Network is required")
      .trim(),
    keystores: z
      .string({ required_error: "Keystores are required" })
      .array()
      .nonempty({ message: "Keystores are required" })
      .transform((val) => val.map((secret) => ({ secretName: secret }))),
    walletPasswordSecretName: z.string().optional(),
    beaconEndpoints: z
      .string({ required_error: "Beacon node endpoints are required" })
      .array()
      .nonempty({ message: "Beacon node endpoints are required" }),
    workspace_id: z.string().min(1),
    image: z.string().min(1),
  })
  .refine(
    ({ client, walletPasswordSecretName }) =>
      (client === ValidatorClients["Prysatic Labs Prysm"] &&
        !!walletPasswordSecretName) ||
      client !== ValidatorClients["Prysatic Labs Prysm"],
    {
      message: "Wallet Password is required for Prysm Client",
      path: ["walletPasswordSecretName"],
    }
  )
  .refine(
    ({ client, beaconEndpoints }) =>
      (client !== ValidatorClients["Sigma Prime Lighthouse"] &&
        beaconEndpoints.length === 1) ||
      client === ValidatorClients["Sigma Prime Lighthouse"],
    {
      message: "Beacon node endpoint requires only 1 endpoint",
      path: ["beaconEndpoints"],
    }
  );
