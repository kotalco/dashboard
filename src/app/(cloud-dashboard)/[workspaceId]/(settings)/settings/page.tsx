import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getWorkspace } from "@/services/get-workspace";
import { Roles } from "@/enums";
import { EditWorkspaceForm } from "./components/edit-workspace-form";
import { LeaveWorkspace } from "./components/leave-workspace";
import { DeleteWorkspace } from "./components/delete-workspace";

export default async function SettingsPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const workspace = await getWorkspace(params.workspaceId);

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {workspace.role === Roles.Admin && (
        <Card>
          <CardHeader>
            <CardTitle>Workspace Settings</CardTitle>
            <CardDescription>Manage your workspace settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <EditWorkspaceForm workspace={workspace} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <LeaveWorkspace workspaceId={workspace.id} />
          <DeleteWorkspace workspace={workspace} />
        </CardContent>
      </Card>
    </div>
  );
}
