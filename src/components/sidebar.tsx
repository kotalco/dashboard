import { Logo } from "@/components/logo";
import { findUser } from "@/services/find-user";
import Workspaces from "@/components/workspaces";

export const Sidebar = async ({ children }: { children: React.ReactNode }) => {
  const { user } = await findUser();

  if (!user) return null;

  return (
    <div className="flex flex-col w-64 fixed inset-y-0 left-0 overflow-y-auto px-3 py-4 space-y-4 border-r">
      <div className="flex-1">
        <div>
          <Logo />
        </div>
        <div className="pt-4">
          <nav>
            <ul className="space-y-1">{children}</ul>
          </nav>
        </div>
      </div>
      {!user.is_customer && <Workspaces />}
    </div>
  );
};
