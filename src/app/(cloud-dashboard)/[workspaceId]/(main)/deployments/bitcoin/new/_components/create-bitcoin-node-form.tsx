"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Input } from "@/components/form/input";
import { SubmitButton } from "@/components/form/submit-button";
import { Select } from "@/components/form/select";
import { SubmitError } from "@/components/form/submit-error";
import { ExternalLink } from "@/components/ui/external-link";

import { BitcoinNetworks } from "@/enums";
import { getSelectItems } from "@/lib/utils";
import { creatBitcoinNode } from "@/actions/create-bitcoin";
import { useAction } from "@/hooks/use-action";
import { Version } from "@/types";

export const CreateBitcoinNodeForm: React.FC<{ images: Version[] }> = ({
  images,
}) => {
  const router = useRouter();
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error } = useAction(creatBitcoinNode, {
    onSuccess: ({ name }) => {
      router.push(`/${workspaceId}/deployments/bitcoin`);
      toast.message("Bitcoin node has been created", {
        description: `${name} node has been created successfully, and will be up and running in few seconds.`,
      });
    },
  });

  const onSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;
    const network = formData.get("network") as BitcoinNetworks;
    execute({
      name,
      network,
      workspace_id: workspaceId as string,
      image: images[0].image,
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
        options={getSelectItems(BitcoinNetworks)}
        errors={fieldErrors}
      />

      <p className="text-sm flex flex-col leading-none space-y-2">
        <span>Client: </span>
        <ExternalLink href="https://github.com/bitcoin/bitcoin">
          Bitcoin Core
        </ExternalLink>
      </p>

      <SubmitError error={error} />

      <SubmitButton>Create</SubmitButton>
    </form>
  );
};
