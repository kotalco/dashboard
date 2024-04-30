import { z } from "zod";

export const EditDomain = z
  .object({
    domain: z.string().min(1, "Domain name is required"),
    isAware: z.literal<boolean>(true, {
      errorMap: () => ({
        message:
          "Please confirm that you are aware that will lead to old endpoints dysfunctional.",
      }),
    }),
    isUpdated: z.literal<boolean>(true, {
      errorMap: () => ({
        message:
          "Please confirm that you updated your domain DNS records according to out instructions.",
      }),
    }),
  })
  .transform(({ domain }) => {
    return { domain };
  });
