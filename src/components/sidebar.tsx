import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Logo } from "@/components/logo";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import { api } from "@/lib/axios";
import { User, WorksapcesList } from "@/types";
import { StorageItems } from "@/enums";

export const Sidebar = async ({ children }: { children: React.ReactNode }) => {
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  if (!token?.value) redirect("/sign-in");

  const config = {
    headers: { Authorization: `Bearer ${token.value}` },
  };

  const { data: user } = await api.get<User>("/users/whoami", config);

  const { data: workspaces } = await api.get<WorksapcesList>(
    "/workspaces",
    config
  );

  return (
    <div className="flex shrink-0">
      <div className="flex flex-col w-64 bg-white">
        <div className="flex flex-col pt-5 pb-4 overflow-y-auto grow">
          <div className="flex items-center px-4 shrink-0">
            <Logo />
          </div>
          {children}
        </div>
        <div className="px-3 py-2">
          <WorkspaceSwitcher
            workspaces={workspaces}
            userId={user.id}
            className="w-full"
          />
        </div>
        {/* <WorkspacesList /> */}
        {/* <div>
          <Link
            href="/workspaces/create"
            className="block px-4 py-3 mx-2 my-3 text-center text-gray-800 bg-white border border-gray-300 rounded shadow hover:bg-gray-100"
          >
            Create New Workspace
          </Link>
        </div> */}
      </div>
    </div>
  );
};
