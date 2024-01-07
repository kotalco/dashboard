"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { FilecoinNode } from "@/types";
import { Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editAPI } from "@/actions/edit-filecoin";

import { InputWithUnit } from "@/components/form/input-with-unit";
import { Toggle } from "@/components/form/toggle";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

interface APITabProps {
  node: FilecoinNode;
  role: Roles;
}

export const APITab: React.FC<APITabProps> = ({ node, role }) => {
  const { api, apiRequestTimeout, name } = node;
  const { workspaceId } = useParams();
  const [apiState, setApiState] = useState(api);
  const { execute, fieldErrors, error, success } = useAction(editAPI);

  const onSubmit = (formData: FormData) => {
    const apiRequestTimeout = formData.get(
      "apiRequestTimeout-amount"
    ) as string;

    execute(
      {
        api: apiState,
        apiRequestTimeout: +apiRequestTimeout,
      },
      { name, workspaceId: workspaceId as string }
    );
  };

  return (
    <form action={onSubmit} className="relative space-y-8">
      <div className="px-3 py-2 rounded-lg border max-w-xs flex">
        <Toggle
          id="api"
          label="REST"
          defaultChecked={api}
          checked={apiState}
          onCheckedChange={setApiState}
          disabled={role === Roles.Reader}
          errors={fieldErrors}
          className="justify-between"
        />
      </div>

      <div className="max-w-xs">
        <InputWithUnit
          id="apiRequestTimeout"
          label="API Request Timeout"
          disabled={role === Roles.Reader || !apiState}
          unit={`Second`}
          errors={fieldErrors}
          defaultValue={apiRequestTimeout.toString()}
        />
      </div>

      <SubmitSuccess success={success}>
        API settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Save</SubmitButton>}
    </form>
  );
};
