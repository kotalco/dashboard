import { create } from "zustand";

export interface UseShowCardsStore {
  showCards: boolean;

  setShowCards: (value: boolean) => void;
}

export const useShowCards = create<UseShowCardsStore>((set) => ({
  showCards: true,
  setShowCards: (value) => set({ showCards: value }),
}));
