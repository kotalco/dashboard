import { VariantProps } from "class-variance-authority";
import { create } from "zustand";

import { alertVariants } from "@/components/ui/alert";

type Variant = VariantProps<typeof alertVariants>;

export interface useAPIMessageStore {
  message?: string;
  type: Variant;
  setMessage: (data: {
    message: string;
    type: VariantProps<typeof alertVariants>;
  }) => void;
  clearMessage: () => void;
}

export const useAPIMessage = create<useAPIMessageStore>((set) => ({
  message: undefined,
  type: { variant: undefined },
  setMessage: ({ message, type }) => set({ message, type }),
  clearMessage: () => set({ message: undefined, type: { variant: undefined } }),
}));
