"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { Protocol } from "@/enums";
import { Service } from "@/types";
import { useAction } from "@/hooks/use-action";
import { createEndpoint } from "@/actions/create-endpoint";

import { Input } from "@/components/form/input";
import { Select } from "@/components/form/select";
import { Toggle } from "@/components/form/toggle";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";

export interface CreateEndpointFormProps {
  services: Service[];
}

export const CreateEndpointForm: React.FC<CreateEndpointFormProps> = ({
  services,
}) => {
  const { workspaceId } = useParams();
  const [serviceName, setServiceName] = useState("");
  const { execute, fieldErrors, error } = useAction(createEndpoint);

  const options = services.map(({ name, protocol }) => ({
    label: name,
    value: name,
    image: `/images/${protocol}.svg`,
  }));

  const onSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;
    const use_basic_auth = formData.get("use_basic_auth") === "on";

    execute({
      name,
      service_name: serviceName,
      use_basic_auth,
      workspace_id: workspaceId as string,
    });
  };

  return (
    <form action={onSubmit} className="max-w-xs space-y-4">
      <Input id="name" label="Endpoint Name" errors={fieldErrors} />

      <Select
        id="service_name"
        label="Service Name"
        placeholder="Choose a service"
        options={options}
        errors={fieldErrors}
        defaultValue={serviceName}
        value={serviceName}
        onValueChange={setServiceName}
      />

      {services?.find(({ name }) => name === serviceName)?.protocol !==
        Protocol.Bitcoin && (
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
