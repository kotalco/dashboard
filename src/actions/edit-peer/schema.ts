import { IPFSRouting } from "@/enums";
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

export const EditPeer = Identifiers.merge(EditImageVersion)
  .merge(EditResources)
  .merge(EditRouting)
  .merge(EditAPI);
