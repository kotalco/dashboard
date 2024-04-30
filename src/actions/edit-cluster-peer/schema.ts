import { z } from "zod";

import { Identifiers } from "@/schemas/identifiers";
import { EditImageVersion } from "@/schemas/image-version";
import { EditResources } from "@/schemas/resources";

const EditPeers = z.object({
  peerEndpoint: z
    .string({ required_error: "Peer endpoint is required" })
    .min(1, "Peer endpoint is required")
    .trim(),
  bootstrapPeers: z.string().array().optional().nullable(),
});

export const EditIpfsClusterPeer = Identifiers.merge(EditImageVersion)
  .merge(EditResources)
  .merge(EditPeers);
