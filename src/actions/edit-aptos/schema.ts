import { z } from "zod";
import { EditImageVersion } from "../edit-image-version/schema";
import { EditResources } from "../edit-resources/schema";

export const EditAptosAPI = z.object({
  name: z.string(),
  workspaceId: z.string(),
  api: z.boolean(),
});

export const EditAptos =
  EditAptosAPI.merge(EditImageVersion).merge(EditResources);
