import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import { api } from "@/lib/axios";
import { User, WorksapcesList } from "@/types";
import { StorageItems } from "@/enums";
import { WorkspaceCreator } from "./workspace-creator";

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
    <div className="flex justify-center pb-4 shrink-0">
      <div className="flex flex-col w-64 space-y-2 bg-white">
        <div className="flex flex-col pt-5 pb-4 overflow-y-auto grow">
          <div className="flex items-center px-4 shrink-0">
            <Logo />
          </div>
          {children}
        </div>
        <div className="px-3">
          <WorkspaceSwitcher
            workspaces={workspaces}
            userId={user.id}
            className="w-full"
          />
        </div>
        <div className="px-3">
          <WorkspaceCreator />
        </div>
      </div>
    </div>
  );
};
