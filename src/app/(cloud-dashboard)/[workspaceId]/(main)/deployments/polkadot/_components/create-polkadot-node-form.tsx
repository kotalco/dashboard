"use client";

import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

import { PolkadotNetworks } from "@/enums";
import { getSelectItems } from "@/lib/utils";
import { Version } from "@/types";
import { useAction } from "@/hooks/use-action";
import { createPolkadotNode } from "@/actions/create-polkadot";

import { Input } from "@/components/form/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select } from "@/components/form/select";
import { ExternalLink } from "@/components/ui/external-link";
import { Toggle } from "@/components/form/toggle";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";

export const CreatePolkadotNodeForm: React.FC<{ images: Version[] }> = ({
  images,
}) => {
  const router = useRouter();
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error } = useAction(createPolkadotNode, {
    onSuccess: ({ name }) => {
      router.push(`/${workspaceId}/deployments/polkadot`);
      toast.message("Polkadot node has been created", {
        description: `${name} node has been created successfully, and will be up and running in few seconds.`,
      });
    },
  });

  const onSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;
    const network = formData.get("network") as PolkadotNetworks;
    const pruning = formData.get("pruning") === "on";

    execute({
      name,
      network,
      pruning,
      workspace_id: workspaceId as string,
      image: images[0].image,
    });
  };

  return (
    <form
      data-testid="create-node"
      action={onSubmit}
      className="max-w-xl space-y-4"
    >
      <Input
        errors={fieldErrors}
        id="name"
        label="Node Name"
        className="max-w-xs"
      />

      <Select
        id="network"
        label="Network"
        placeholder="Select Network"
        options={getSelectItems(PolkadotNetworks)}
        errors={fieldErrors}
        className="max-w-xs"
      />

      <p className="text-sm font-medium leading-none space-y-1">
        Client:{" "}
        <ExternalLink href="https://github.com/paritytech/polkadot">
          Parity Polkadot
        </ExternalLink>
      </p>

      <Toggle id="pruning" label="Pruning" errors={fieldErrors} />

      <Alert className="alert-warning">
        <AlertTitle>Attension</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside">
            <li>Validator nodes must run in archive mode.</li>
            <li>Disable pruning to enable archive mode.</li>
            <li>
              You can enable validator mode after node is up and running &amp;
              fully synced
            </li>
          </ul>
        </AlertDescription>
      </Alert>

      <SubmitError error={error} />

      <SubmitButton>Create</SubmitButton>
    </form>
  );
};
