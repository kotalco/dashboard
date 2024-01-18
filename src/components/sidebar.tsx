import Link from "next/link";

import { findUser } from "@/services/find-user";

import { Logo } from "@/components/logo";
import Workspaces from "@/components/workspaces";

export const Sidebar = async ({ children }: { children: React.ReactNode }) => {
  const { user } = await findUser();

  if (!user) return null;

  return (
    <div className="flex flex-col w-64 fixed inset-y-0 left-0 overflow-y-auto px-3 py-4 space-y-4 border-r">
      <div className="flex-1 flex flex-col">
        <div>
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <div className="pt-4 flex flex-col flex-1">
          <nav className="flex flex-col flex-1">
            <ul className="flex-1 flex flex-col space-y-1">{children}</ul>
          </nav>
        </div>
      </div>
      {!user.is_customer && <Workspaces />}
    </div>
  );
};
