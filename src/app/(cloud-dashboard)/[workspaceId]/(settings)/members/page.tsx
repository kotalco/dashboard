import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { getWorkspace } from "@/services/get-workspace";
import { getTeamMembers } from "@/services/get-team-members";
import { TeamMemberColumn, columns } from "./components/columns";
import { Roles } from "@/enums";
import { AddMemberForm } from "./components/add-member-form";
import { Separator } from "@/components/ui/separator";
import { findUser } from "@/services/find-user";
import { APIMessage } from "@/components/api-message";
import { getSubscriptionInfo } from "@/services/get-subscription-info";

export const revalidate = 0;

export default async function MembersPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const workspaceData = getWorkspace(params.workspaceId);
  const teamMembersData = getTeamMembers(params.workspaceId);
  const subscriptionData = getSubscriptionInfo();
  const userData = findUser();

  const [workspace, teamMembers, { user }, subscription] = await Promise.all([
    workspaceData,
    teamMembersData,
    userData,
    subscriptionData,
  ]);

  if (!user) return null;

  const formattedTeamMembers: TeamMemberColumn[] = teamMembers.map(
    ({ id, email, role }) => ({
      id,
      email,
      role,
      isCurrentUser: id === user.id,
      withCustomerRole: !!subscription.endpoint_limit,
    })
  );

  return (
    <>
      <Heading
        title="Workspace Members"
        description={`Manage your members for ${workspace.name} workspace.`}
      />
      <div className="py-10 mx-auto space-y-5">
        {workspace.role === Roles.Admin && (
          <>
            <AddMemberForm />
            <Separator />
          </>
        )}
        <DataTable data={formattedTeamMembers} columns={columns} />
        <APIMessage />
      </div>
    </>
  );
}
