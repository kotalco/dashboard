import { create } from "zustand";

export interface useActivationModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useActivationModal = create<useActivationModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
