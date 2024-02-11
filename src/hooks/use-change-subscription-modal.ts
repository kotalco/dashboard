import { create } from "zustand";

type ChangeSubscriptionData = {
  price_id: string;
  plan_id: string;
  subscription_id: string;
};

export interface UseChangeSubscriptionModalStore {
  isOpen: boolean;
  step: number;
  planPrice?: number;
  data?: ChangeSubscriptionData;
  nextStep: () => void;
  backStep: () => void;
  setStep: (step: number) => void;
  onOpen: () => void;
  onClose: () => void;
  setPlanPrice: (price?: number) => void;
  setNewSubscriptionData: (data: ChangeSubscriptionData) => void;
}

export const useChangeSubscriptionModal =
  create<UseChangeSubscriptionModalStore>((set) => ({
    isOpen: false,
    step: 1,
    planPrice: undefined,
    setStep: (step) => set({ step }),
    backStep: () => set(({ step }) => ({ step: step - 1 })),
    nextStep: () => set(({ step }) => ({ step: step + 1 })),
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    setPlanPrice: (price?: number) =>
      set({ planPrice: price && Number(price) * 100 }),
    setNewSubscriptionData: (data: ChangeSubscriptionData) => set({ data }),
  }));
