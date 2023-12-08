import { LogOut } from "lucide-react";

import { logout } from "@/actions/logout";

import { SubmitButton } from "@/components/form/submit-button";

export const LogoutForm = () => {
  return (
    <form action={logout}>
      <SubmitButton
        variant="ghost"
        className="justify-start w-full text-muted-foreground"
      >
        <LogOut className="w-6 h-6 mr-3" />
        Logout
      </SubmitButton>
    </form>
  );
};
