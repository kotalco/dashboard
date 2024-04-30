import { z } from "zod";

import { Identifiers } from "@/schemas/identifiers";
import { EditImageVersion } from "@/schemas/image-version";
import { EditResources } from "@/schemas/resources";

const EditLogging = z.object({
  disableMetadataLog: z.boolean(),
});

const EditIPFS = z.object({
  ipfsForRetrieval: z.boolean(),
  ipfsOnlineMode: z.boolean(),
  ipfsPeerEndpoint: z.string().trim().optional().nullable(),
});

const EditAPI = z.object({
  api: z.boolean(),
  apiRequestTimeout: z.number().optional().nullable(),
});

export const EditFilecoin = Identifiers.merge(EditImageVersion)
  .merge(EditAPI)
  .merge(EditIPFS)
  .merge(EditLogging)
  .merge(EditResources);
