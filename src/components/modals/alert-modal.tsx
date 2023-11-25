import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CloseDialogButton } from "../ui/close-dialog-button";

interface AlertModalProps {
  triggerText: string;
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
}: AlertModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="destructive">
          {triggerText}
        </Button>
      </DialogTrigger>
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
