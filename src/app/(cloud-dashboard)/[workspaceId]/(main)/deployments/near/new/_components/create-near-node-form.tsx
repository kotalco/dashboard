"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { NEARNetworks } from "@/enums";
import { getSelectItems } from "@/lib/utils";
import { Version } from "@/types";
import { useAction } from "@/hooks/use-action";
import { createNearNode } from "@/actions/create-near";

import { Input } from "@/components/form/input";
import { Select } from "@/components/form/select";
import { ExternalLink } from "@/components/ui/external-link";
import { Toggle } from "@/components/form/toggle";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

export const CreateNEARNodeForm: React.FC<{ images: Version[] }> = ({
  images,
}) => {
  const router = useRouter();
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error } = useAction(createNearNode, {
    onSuccess: ({ name }) => {
      router.push(`/${workspaceId}/deployments/near`);
      toast.message("NEAR node has been created", {
        description: `${name} node has been created successfully, and will be up and running in few seconds.`,
      });
    },
  });

  const onSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;
    const network = formData.get("network") as NEARNetworks;
    const archive = formData.get("archive") === "on";

    execute({
      name,
      network,
      workspace_id: workspaceId as string,
      image: images[0].image,
      archive,
    });
  };

  return (
    <form
      data-testid="create-node"
      action={onSubmit}
      className="max-w-xs space-y-4"
    >
      <Input id="name" errors={fieldErrors} label="Node Name" />

      <Select
        id="network"
        label="Network"
        placeholder="Select Network"
        options={getSelectItems(NEARNetworks)}
        errors={fieldErrors}
      />

      <p className="text-sm font-medium flex flex-col leading-none space-y-2">
        <span>Client:</span>
        <ExternalLink href="https://github.com/near/nearcore">
          NEAR Core
        </ExternalLink>
      </p>

      <Toggle id="archive" label="Archive Node" errors={fieldErrors} />

      <SubmitError error={error} />

      <SubmitButton>Create</SubmitButton>
    </form>
  );
};
