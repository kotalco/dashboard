"use client";

import * as z from "zod";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/form/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FilecoinNetworks } from "@/enums";
import { Select } from "@/components/form/select";
import { useToast } from "@/components/ui/use-toast";
import { getLatestVersion, getSelectItems } from "@/lib/utils";
import { client } from "@/lib/client-instance";
import { Clients } from "@/types";
import { useAction } from "@/hooks/use-action";
import { creatFilecoin } from "@/actions/create-filecoin";
import { toast } from "sonner";
import { ExternalLink } from "@/components/ui/external-link";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";

export const CreateNewFilecoinNode: React.FC<{ images: Clients }> = ({
  images,
}) => {
  const router = useRouter();
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error } = useAction(creatFilecoin, {
    onSuccess: ({ name }) => {
      router.push(`/${workspaceId}/deployments/filecoin`);
      toast.message("Filecoin node has been created", {
        description: `${name} node has been created successfully, and will be up and running in few seconds.`,
      });
    },
  });

  const onSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;
    const network = formData.get("network") as FilecoinNetworks;
    execute({
      name,
      network,
      workspace_id: workspaceId as string,
      image: getLatestVersion(images, "lotus", network)!,
    });
  };

  return (
    <form
      data-testid="create-node"
      action={onSubmit}
      className="max-w-sm space-y-4"
    >
      <Input errors={fieldErrors} id="name" label="Node Name" />

      <Select
        id="network"
        label="Network"
        placeholder="Select Network"
        options={getSelectItems(FilecoinNetworks)}
        errors={fieldErrors}
      />

      <p className="text-sm font-medium leading-none space-y-1">
        Client:{" "}
        <ExternalLink href="https://github.com/filecoin-project/lotus">
          Lotus
        </ExternalLink>
      </p>

      <SubmitError error={error} />

      <SubmitButton>Create</SubmitButton>
    </form>
  );
};
