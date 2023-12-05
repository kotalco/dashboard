import { z } from "zod";

export const EditLogging = z.object({
  disableMetadataLog: z.boolean(),
});

export const EditIPFS = z.object({
  ipfsForRetrieval: z.boolean(),
  ipfsOnlineMode: z.boolean(),
  ipfsPeerEndpoint: z.string().trim().optional(),
});

export const EditAPI = z
  .object({
    api: z.boolean(),
    apiRequestTimeout: z
      .number({
        invalid_type_error: "Please enter a valid number with seconds",
      })
      .optional()
      .nullable(),
  })
  .refine(
    ({ api, apiRequestTimeout }) =>
      api ? apiRequestTimeout && apiRequestTimeout > 0 : true,
    {
      message: "Please enter a valid number with seconds",
      path: ["apiRequestTimeout"],
    }
  );
