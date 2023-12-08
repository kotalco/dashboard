import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export const LogoutButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      variant="ghost"
      className="justify-start w-full text-muted-foreground"
      disabled={pending}
    >
      <LogOut className="w-6 h-6 mr-3" />
      Logout
    </Button>
  );
};
