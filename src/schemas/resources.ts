import { z } from "zod";

export const EditResources = z.object({
  cpu: z
    .string()
    .min(1, "Please define CPU cores")
    .refine((value) => /^[1-9]\d*$/.test(value), {
      message: "CPU Cores must be a number",
    }),
  cpuLimit: z
    .string()
    .min(1, "Please define maximum CPU cores")
    .refine((value) => /^[1-9]\d*$/.test(value), {
      message: "CPU Cores must be a number",
    }),
  memory: z
    .string()
    .min(3, "Please define memory")
    .refine((value) => /(^\d+(G|T|M)i)/.test(value), {
      message: "Memory must be a number",
    }),
  memoryLimit: z
    .string()
    .min(3, "Please define memory limit")
    .refine((value) => /(^\d+(G|T|M)i)/.test(value), {
      message: "Memory limit must be a number",
    }),
  storage: z
    .string()
    .min(3, "Please define storage")
    .refine((value) => /(^\d+(G|T|M)i)/.test(value), {
      message: "Storage must be a number",
    }),
});
