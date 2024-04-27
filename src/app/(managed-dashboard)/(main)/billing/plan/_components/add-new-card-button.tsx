"use client";
import { CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

import { useChangeSubscriptionModal } from "@/hooks/use-change-subscription-modal";
import { delay } from "@/lib/utils";

import { Button } from "@/components/ui/button";

const AddNewCardButton = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { onClose, setStep } = useChangeSubscriptionModal();

  const handleClick = async () => {
    router.push("/payment-methods");
    await delay(1000);
    onClose();
    setStep(1);
  };

  return (
    <Button
      onClick={handleClick}
      type="button"
      variant="outline"
      size="sm"
      className="mt-4 w-full"
    >
      <CreditCard className="w-6 h-6 mr-2" />
      <span>{children}</span>
    </Button>
  );
};
export default AddNewCardButton;
