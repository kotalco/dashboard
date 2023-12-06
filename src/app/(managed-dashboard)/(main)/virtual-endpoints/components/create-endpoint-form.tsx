"use client";

import * as z from "zod";
import { useState } from "react";

import { Networks, ProtocolsWithoutEthereum2 } from "@/enums";
import { getEnumKey } from "@/lib/utils";
import { useAction } from "@/hooks/use-action";
import { createVirtualEndpoint } from "@/actions/create-virtual-endpoint";

import { Input } from "@/components/form/input";
import { Select } from "@/components/form/select";
import { Toggle } from "@/components/form/toggle";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";

const schema = z.object({
  name: z
    .string()
    .min(1, "Node name is required")
    .max(64, "Too long name")
    .trim()
    .refine((value) => /^\S*$/.test(value), {
      message: "Invalid character used",
    }),
  protocol: z.nativeEnum(ProtocolsWithoutEthereum2, {
    required_error: "Protocol name is required",
  }),
  network: z.string().optional(),
  use_basic_auth: z.boolean().optional(),
});

type Schema = z.infer<typeof schema>;

export interface CreateEndpointFormProps {
  services: Record<ProtocolsWithoutEthereum2, string[]>;
}

export const CreateEndpointForm: React.FC<CreateEndpointFormProps> = ({
  services,
}) => {
  const [selectedProtocol, setSelectedProtocol] =
    useState<ProtocolsWithoutEthereum2>();
  const { execute, error, fieldErrors } = useAction(createVirtualEndpoint);

  const protocols = Object.keys(services).map((protocol) => ({
    value: protocol,
    label: getEnumKey(ProtocolsWithoutEthereum2, protocol),
    image: `/images/${protocol}.svg`,
  }));
  const networks =
    selectedProtocol &&
    services[selectedProtocol]
      .filter((el) => !!el)
      .map((network) => ({
        label: getEnumKey(Networks, network),
        value: network,
      }));

  const onSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;
    const protocol = selectedProtocol as ProtocolsWithoutEthereum2;
    const network = formData.get("network") as string;
    const use_basic_auth = formData.get("use_basic_auth") === "on";

    execute({ protocol, name, network, use_basic_auth });
  };

  return (
    <form
      data-testid="create-endpoint"
      action={onSubmit}
      className="max-w-sm space-y-4"
    >
      <Input id="name" label="Endpoint Name" errors={fieldErrors} />

      <Select
        id="protocol"
        label="Protocol"
        onValueChange={setSelectedProtocol as (value: string) => void}
        defaultValue={selectedProtocol}
        value={selectedProtocol}
        placeholder="Choose a protocol"
        errors={fieldErrors}
        options={protocols}
      />

      {selectedProtocol &&
        networks &&
        !!services[selectedProtocol]?.filter((el) => !!el).length && (
          <Select
            id="network"
            label="Network"
            placeholder="Choose a network"
            errors={fieldErrors}
            options={networks}
          />
        )}

      {selectedProtocol !== ProtocolsWithoutEthereum2.BITCOIN && (
        <Toggle
          id="use_basic_auth"
          label="Use Basic Authentication"
          errors={fieldErrors}
        />
      )}

      <SubmitError error={error} />

      <SubmitButton>Create</SubmitButton>
    </form>
  );
};
