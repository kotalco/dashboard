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

export default async function SettingsPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { data: workspace } = await getWorkspace(params.workspaceId);

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {workspace.role === Roles.ADMIN && (
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
        <CardHeader className="relative">
          <CardTitle>Two Factor Authentication</CardTitle>

          <CardDescription>
            Two Factor authentication adds an additional layer of security to
            your account by requiring more than just password to sign in.
          </CardDescription>
        </CardHeader>
        {/* <CardContent>
          <TwoFactorAuthForm enabled={two_factor_enabled} />
        </CardContent> */}
      </Card>
    </div>
  );
}
