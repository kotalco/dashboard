import { getSelectItems } from "@/lib/utils";
import { IPFSPeer } from "@/types";
import { IPFSConfigProfile, Roles } from "@/enums";

import { Label } from "@/components/ui/label";
import { CheckboxGroup } from "@/components/form/checkbox-group";
import { Heading } from "@/components/ui/heading";

interface ConfigrationProfilesProps {
  node: IPFSPeer;
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const ConfigrationProfiles = ({
  node,
  role,
  errors,
}: ConfigrationProfilesProps) => {
  const { initProfiles, profiles } = node;

  const remainingProfilesOptions = getSelectItems(IPFSConfigProfile).filter(
    ({ value }) => !initProfiles.includes(value)
  );

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Configuration Profile" />
      <Label>Initial Configuration Profiles</Label>
      <ul className="mb-5 ml-5 text-sm">
        {initProfiles.map((profile) => (
          <li key={profile} className="list-disc text-muted-foreground">
            {profile}
          </li>
        ))}
      </ul>

      <CheckboxGroup
        label="Configuration Profiles"
        className="grid grid-cols-2 ml-5 gap-3 max-w-sm"
        options={remainingProfilesOptions}
        id="profiles"
        errors={errors}
        disabled={role === Roles.Reader}
        defaultValues={profiles}
      />
    </div>
  );
};
