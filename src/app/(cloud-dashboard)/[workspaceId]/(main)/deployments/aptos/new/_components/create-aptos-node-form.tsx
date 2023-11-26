"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Input } from "@/components/form/input";
import { SubmitButton } from "@/components/form/submit-button";
import { Select } from "@/components/form/select";
import { SubmitError } from "@/components/form/submit-error";
import { ExternalLink } from "@/components/ui/external-link";

import { AptosNetworks } from "@/enums";
import { Clients } from "@/types";
import { getLatestVersion, getSelectItems } from "@/lib/utils";
import { createAptosNode } from "@/actions/create-aptos";
import { useAction } from "@/hooks/use-action";

export const CreateAptosNodeForm: React.FC<{ images: Clients }> = ({
  images,
}) => {
  const router = useRouter();
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error } = useAction(createAptosNode, {
    onSuccess: ({ name }) => {
      router.push(`/${workspaceId}/deployments/aptos`);
      toast.message("Aptos node has been created", {
        description: `${name} node has been created successfully, and will be up and running in few seconds.`,
      });
    },
  });

  const onSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;
    const network = formData.get("network") as AptosNetworks;
    execute({
      name,
      network,
      workspace_id: workspaceId as string,
      image: getLatestVersion(images, "aptos-core", network),
    });
  };

  return (
    <form
      data-testid="create-node"
      action={onSubmit}
      className="max-w-xs space-y-4"
    >
      <Input errors={fieldErrors} id="name" label="Node Name" />

      <Select
        id="network"
        label="Network"
        placeholder="Select Network"
        options={getSelectItems(AptosNetworks)}
        errors={fieldErrors}
      />

      <p className="text-sm font-medium leading-none space-y-1">
        <span>Client: </span>
        <ExternalLink href="https://github.com/aptos-labs/aptos-core">
          aptos-core
        </ExternalLink>
      </p>

      <SubmitError error={error} />

      <SubmitButton>Create</SubmitButton>
    </form>
  );
};
