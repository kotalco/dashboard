import { z } from "zod";

export const EditPeers = z.object({
  peerEndpoint: z
    .string({ required_error: "Peer endpoint is required" })
    .min(1, "Peer endpoint is required")
    .trim(),
  bootstrapPeers: z.string().array().optional().nullable(),
});
