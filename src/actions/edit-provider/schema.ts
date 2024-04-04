import { z } from "zod";

import { Providers } from "@/enums";

export const EditProvider = z
  .instanceof(FormData)
  .refine(
    (formData) => {
      const tls_provider = formData.get("tls_provider");
      return (
        tls_provider === Providers["Lets Encrypt"] ||
        tls_provider === Providers["Paid TLS Certificate"]
      );
    },
    { message: "Please select provider." }
  )
  .refine(
    (formData) => {
      const cert = formData.get("cert") as File;
      return !cert || cert.size <= 1024 * 1024;
    },
    { message: "File size is too large. File should be less than 1MB." }
  )
  .refine(
    (formData) => {
      const cert = formData.get("cert") as File;
      return !cert || cert.name.includes(".crt");
    },
    { message: "Invalid file type. Please upload *.crt file.", path: ["cert"] }
  )
  .refine(
    (formData) => {
      const key = formData.get("key") as File;
      return !key || key.size <= 1024 * 1024;
    },
    { message: "File size is too large. File should be less than 1MB." }
  )
  .refine(
    (formData) => {
      const key = formData.get("key") as File;
      return !key || key.name.includes(".pem");
    },
    { message: "Invalid file type. Please upload *.pem file.", path: ["key"] }
  );
