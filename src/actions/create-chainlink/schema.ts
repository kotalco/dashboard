import { z } from "zod";

import { ChainlinkNetworks } from "@/enums";

export const CreateChainlink = z
  .object({
    name: z
      .string()
      .min(1, "Node name is required")
      .max(64, "Too long name")
      .trim()
      .refine((value) => /^\S*$/.test(value), {
        message: "Invalid character used",
      }),
    evmChain: z.nativeEnum(ChainlinkNetworks, {
      errorMap: () => ({ message: "Please select a Network" }),
    }),
    ethereumWsEndpoint: z
      .string({ required_error: "Ethereum websocket is required" })
      .min(1, "Ethereum websocket is required")
      .trim()
      .refine((value) => /wss?:\/\//.test(value), {
        message: "Invalid websocket URL",
      }),
    databaseURL: z
      .string({ required_error: "Database connection URL is required" })
      .min(1, "Database connection URL is required")
      .trim()
      .refine((value) => /postgres:\/\//.test(value), {
        message: "Invalid database URL",
      }),
    keystorePasswordSecretName: z
      .string({
        required_error: "Keystore password is required",
      })
      .min(1, "Keystore password is required"),
    apiCredentials: z.object({
      email: z
        .string({ required_error: "Email is required" })
        .email("Invalid Email")
        .trim(),
      passwordSecretName: z
        .string({ required_error: "Password is required" })
        .min(1, "Password is required"),
    }),
    workspace_id: z.string().min(1),
    image: z.string().min(1),
  })
  .transform(({ evmChain, ...values }) => {
    const [id, address] = evmChain.split(":");
    return {
      ...values,
      ethereumChainId: parseInt(id, 10),
      linkContractAddress: address,
    };
  });
