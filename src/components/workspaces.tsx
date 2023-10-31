import { WorkspaceCreator } from "@/components/workspace-creator";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import { findUser } from "@/services/find-user";
import { getWorkspaces } from "@/services/get-workspaces";

const Workspaces = async () => {
  const { user } = await findUser();
  const workspaces = await getWorkspaces();

  if (!user) return null;

  return (
    <>
      <WorkspaceSwitcher
        workspaces={workspaces}
        userId={user.id}
        className="w-full"
      />
      <WorkspaceCreator />
    </>
  );
};
export default Workspaces;
