"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { IPFSConfigProfile } from "@/enums";
import { getSelectItems } from "@/lib/utils";
import { Version } from "@/types";
import { createPeer } from "@/actions/create-peer";
import { useAction } from "@/hooks/use-action";

import { Input } from "@/components/form/input";
import { ExternalLink } from "@/components/ui/external-link";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";
import { CheckboxGroup } from "@/components/form/checkbox-group";

export const CreateIPFSPeerForm: React.FC<{ images: Version[] }> = ({
  images,
}) => {
  const router = useRouter();
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error } = useAction(createPeer, {
    onSuccess: ({ name }) => {
      router.push(`/${workspaceId}/deployments/ipfs?deployment=peers`);
      toast.message("IPFS Peer has been created", {
        description: `${name} peer has been created successfully, and will be up and running in few seconds.`,
      });
    },
  });

  const onSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;
    const initProfiles = formData.getAll("initProfiles") as [
      IPFSConfigProfile,
      ...IPFSConfigProfile[]
    ];

    execute({
      name,
      initProfiles,
      workspace_id: workspaceId as string,
      image: images[0].image,
    });
  };

  return (
    <form
      data-testid="create-peer"
      action={onSubmit}
      className="max-w-sm space-y-4"
    >
      <Input
        errors={fieldErrors}
        id="name"
        label="Peer Name"
        className="max-w-xs"
      />

      <p className="text-sm font-medium flex flex-col leading-none space-y-2">
        <span>Client:</span>
        <ExternalLink href="https://github.com/ipfs/kubo">Kubo</ExternalLink>
      </p>

      <CheckboxGroup
        label="Initial Configuration Profiles"
        className="grid grid-cols-2 ml-5 gap-3"
        options={getSelectItems(IPFSConfigProfile)}
        id="initProfiles"
        errors={fieldErrors}
        defaultValues={[IPFSConfigProfile["default-datastore"]]}
      />

      <SubmitError error={error} />

      <SubmitButton>Create</SubmitButton>
    </form>
  );
};
