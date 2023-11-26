"use client";

import { useFormStatus } from "react-dom";
import { Loader2, WalletCards } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { setDefaultCard } from "@/lib/actions";

interface SetDefaultCardProps {
  id: string;
  isDefault: boolean;
}

export const SetDefaultCard: React.FC<SetDefaultCardProps> = ({
  id,
  isDefault,
}) => {
  if (isDefault) {
    return null;
  }

  return (
    <form action={setDefaultCard.bind(null, id)}>
      <SetDefaultCardButton />
    </form>
  );
};

const SetDefaultCardButton = () => {
  const { pending } = useFormStatus();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            disabled={pending}
            variant="outline"
            size="icon"
            className="w-8 h-8"
          >
            {pending ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <WalletCards className="w-4 h-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
