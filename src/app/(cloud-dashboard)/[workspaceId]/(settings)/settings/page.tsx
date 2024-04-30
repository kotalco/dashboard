import { getWorkspace } from "@/services/get-workspace";
import { Roles } from "@/enums";
import { EditWorkspaceForm } from "./components/edit-workspace-form";
import { LeaveWorkspace } from "./components/leave-workspace";
import { DeleteWorkspace } from "./components/delete-workspace";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";

export default async function SettingsPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const workspace = await getWorkspace(params.workspaceId);

  return (
    <div className="space-y-8">
      {workspace.role === Roles.Admin && (
        <>
          <Heading
            title="Workspace Settings"
            description="Manage your workspace settings."
          />
          <div className="max-w-xs">
            <EditWorkspaceForm workspace={workspace} />
          </div>
        </>
      )}

      <Separator />

      <Heading title="Danger Zone" />

      <LeaveWorkspace id={workspace.id} />
      {workspace.role === Roles.Admin && (
        <>
          <Separator className="max-w-md" />
          <DeleteWorkspace workspace={workspace} />
        </>
      )}
    </div>
  );
}
