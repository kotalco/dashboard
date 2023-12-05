import { IPFSConfigProfile, IPFSRouting } from "@/enums";
import { z } from "zod";

export const EditRouting = z.object({
  routing: z.nativeEnum(IPFSRouting, {
    errorMap: () => ({ message: "Routing is required" }),
  }),
});

export const EditAPI = z.object({
  api: z.boolean(),
  gateway: z.boolean(),
});

export const EditConfigProfiles = z.object({
  profiles: z
    .nativeEnum(IPFSConfigProfile, {
      errorMap: () => ({ message: "Routing is required" }),
    })
    .array(),
});
