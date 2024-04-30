import { z } from "zod";

import { EditImageVersion } from "@/schemas/image-version";
import { EditResources } from "@/schemas/resources";
import { Identifiers } from "@/schemas/identifiers";

const EditAptosAPI = z.object({
  api: z.boolean(),
});

export const EditAptos = EditAptosAPI.merge(EditImageVersion)
  .merge(EditResources)
  .merge(Identifiers);
