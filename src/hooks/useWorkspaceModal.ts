import { create } from "zustand";

export interface UseWorkspaceModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useWorkspaceModal = create<UseWorkspaceModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
