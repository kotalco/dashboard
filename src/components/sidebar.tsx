import { Logo } from "@/components/logo";
import { WorkspaceCreator } from "@/components/workspace-creator";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import { findUser } from "@/services/find-user";
import { getWorkspaces } from "@/services/get-workspaces";

export const Sidebar = async ({ children }: { children: React.ReactNode }) => {
  const user = await findUser();
  const workspaces = await getWorkspaces();

  return (
    <div className="flex justify-center pb-4 shrink-0">
      <div className="flex flex-col w-64 space-y-2 bg-white">
        <div className="flex flex-col pt-5 pb-4 overflow-y-auto grow">
          <div className="flex items-center px-4 shrink-0">
            <Logo />
          </div>
          <div className="flex-1 px-2">
            <nav>
              <ul className="flex flex-col mt-5 overflow-y-auto gap-y-1">
                {children}
              </ul>
            </nav>
          </div>
        </div>
        <WorkspaceSwitcher
          workspaces={workspaces}
          userId={user.id}
          className="w-full"
        />
        <WorkspaceCreator />
      </div>
    </div>
  );
};
