import { z } from "zod";

import { ValidatorClients } from "@/enums";
import { Identifiers } from "@/schemas/identifiers";
import { EditImageVersion } from "@/schemas/image-version";
import { EditResources } from "@/schemas/resources";

const EditKeystore = z.object({
  client: z.nativeEnum(ValidatorClients),
  keystores: z
    .string({ required_error: "Keystores are required" })
    .array()
    .nonempty({ message: "Keystores are required" })
    .transform((val) => val.map((secret) => ({ secretName: secret }))),
  walletPasswordSecretName: z.string().optional().nullable(),
});

const EditGraffiti = z.object({
  graffiti: z.string().trim().optional().default(""),
});

const EditBeaconNode = z.object({
  client: z.nativeEnum(ValidatorClients),
  beaconEndpoints: z
    .string({ required_error: "Beacon node endpoints are required" })
    .array()
    .nonempty({ message: "Beacon node endpoints are required" }),
});

export const EditValidator = Identifiers.merge(EditImageVersion)
  .merge(EditResources)
  .merge(EditKeystore)
  .merge(EditGraffiti)
  .merge(EditBeaconNode)
  .refine(
    ({ walletPasswordSecretName, client }) =>
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
