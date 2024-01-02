import { create } from "zustand";

type Variant = "success" | "destructive" | undefined;

export interface useAPIMessageStore {
  message?: string;
  variant: Variant;
  setMessage: (data: { message: string; variant: Variant }) => void;
  clearMessage: () => void;
}

export const useAPIMessage = create<useAPIMessageStore>((set) => ({
  message: undefined,
  variant: undefined,
  setMessage: ({ message, variant }) => set({ message, variant }),
  clearMessage: () => set({ message: undefined, variant: undefined }),
}));
