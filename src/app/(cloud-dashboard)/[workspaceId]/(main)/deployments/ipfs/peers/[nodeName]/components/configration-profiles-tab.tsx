"use client";

import { useParams } from "next/navigation";

import { getSelectItems } from "@/lib/utils";
import { IPFSPeer } from "@/types";
import { IPFSConfigProfile, Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editConfigProfiles } from "@/actions/edit-peer";

import { Label } from "@/components/ui/label";
import { CheckboxGroup } from "@/components/form/checkbox-group";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

interface ConfigrationProfilesTabProps {
  node: IPFSPeer;
  role: Roles;
}

export const ConfigrationProfilesTab: React.FC<
  ConfigrationProfilesTabProps
> = ({ node, role }) => {
  const { initProfiles, profiles, name } = node;
  const { workspaceId } = useParams();
  const { execute, success, fieldErrors, error } =
    useAction(editConfigProfiles);
  const remainingProfilesOptions = getSelectItems(IPFSConfigProfile).filter(
    ({ value }) => !initProfiles.includes(value)
  );

  const onSubmit = (formData: FormData) => {
    const profiles = formData.getAll("profiles") as IPFSConfigProfile[];
    execute({ profiles }, { name, workspaceId: workspaceId as string });
  };

  return (
    <>
      <Label>Initial Configration Profiles</Label>
      <ul className="mb-5 ml-5 text-sm">
        {initProfiles.map((profile) => (
          <li key={profile} className="text-gray-500 list-disc">
            {profile}
          </li>
        ))}
      </ul>

      <form action={onSubmit} className="relative space-y-4">
        <CheckboxGroup
          label="Configuration Profiles"
          className="grid grid-cols-2 ml-5 gap-3 max-w-sm"
          options={remainingProfilesOptions}
          id="profiles"
          errors={fieldErrors}
          disabled={role === Roles.Reader}
          defaultValues={profiles}
        />

        <SubmitSuccess success={success}>
          Configuration profiles have been updated successfully.
        </SubmitSuccess>

        <SubmitError error={error} />

        {role !== Roles.Reader && <SubmitButton>Save</SubmitButton>}
      </form>
    </>
  );
};
