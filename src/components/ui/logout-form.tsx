import { logout } from "@/actions/logout";

import { LogoutButton } from "@/components/form/logout-button";

export const LogoutForm = () => {
  return (
    <form action={logout}>
      <LogoutButton />
    </form>
  );
};
