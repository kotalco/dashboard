import { z } from "zod";

import { SecretType } from "@/enums";

export const CreateSecret = z
  .object({
    name: z.string().trim().min(1, "Secret name is required"),
    type: z.nativeEnum(SecretType, {
      errorMap: () => ({ message: "Please select a type for your secret" }),
    }),
    workspace_id: z.string().min(1),
    data: z
      .record(
        z.enum([
          "password",
          "key",
          "keystore",
          "secret",
          "tls/key",
          "tls/crt",
          "tls.key",
          "tls.crt",
        ]),
        z.string().min(1, "This is required")
      )
      .refine((data) => Object.keys(data).length > 0, {
        message: "Data cannot be an empty object",
      }),
  })
  .transform((values) => {
    if (values.data["tls/crt"] && values.data["tls/key"]) {
      return {
        ...values,
        data: {
          "tls.crt": values.data["tls/crt"],
          "tls.key": values.data["tls/key"],
        },
      };
    }

    return values;
  });
