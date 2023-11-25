import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CloseDialogButtonProps {
  children?: React.ReactNode;
}

export const CloseDialogButton = ({ children }: CloseDialogButtonProps) => {
  return (
    <DialogFooter className="sm:justify-end">
      <DialogClose asChild>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </DialogClose>
      {children}
    </DialogFooter>
  );
};
