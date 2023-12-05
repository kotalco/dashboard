import { ComponentPropsWithoutRef } from "react";
import { Root } from "@radix-ui/react-dialog";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CloseDialogButton } from "@/components/ui/close-dialog-button";

interface AlertModalProps extends ComponentPropsWithoutRef<typeof Root> {
  triggerText?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  withCancel?: boolean;
}

export const AlertModal = ({
  triggerText,
  title,
  description,
  children,
  withCancel,
  ...props
}: AlertModalProps) => {
  return (
    <Dialog {...props}>
      {triggerText && (
        <DialogTrigger asChild>
          <Button type="button" variant="destructive" className="shrink-0">
            {triggerText}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children}

        {withCancel && <CloseDialogButton />}
      </DialogContent>
    </Dialog>
  );
};
