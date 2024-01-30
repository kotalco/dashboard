import { IPFSConfigProfile, IPFSRouting } from "@/enums";
import { Identifiers } from "@/schemas/identifiers";
import { EditImageVersion } from "@/schemas/image-version";
import { EditResources } from "@/schemas/resources";
import { z } from "zod";

const EditRouting = z.object({
  routing: z.nativeEnum(IPFSRouting, {
    errorMap: () => ({ message: "Routing is required" }),
  }),
});

const EditAPI = z.object({
  api: z.boolean(),
  gateway: z.boolean(),
});

const EditConfigProfiles = z.object({
  profiles: z
    .nativeEnum(IPFSConfigProfile, {
      errorMap: () => ({ message: "Routing is required" }),
    })
    .array(),
});

export const EditPeer = Identifiers.merge(EditImageVersion)
  .merge(EditResources)
  .merge(EditRouting)
  .merge(EditAPI)
  .merge(EditConfigProfiles);
