"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { NEARNode } from "@/types";
import { Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editRPC } from "@/actions/edit-near";

import { Input } from "@/components/form/input";

import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";
import { Toggle } from "@/components/form/toggle";

interface RPCTabProps {
  node: NEARNode;
  role: Roles;
}

export const RPCTab: React.FC<RPCTabProps> = ({ node, role }) => {
  const { rpc, rpcPort, name } = node;
  const { workspaceId } = useParams();
  const [rpcState, setRpcState] = useState(rpc);
  const { execute, fieldErrors, error, success } = useAction(editRPC);

  const onSubmit = (formData: FormData) => {
    const rpcPort = Number(formData.get("rpcPort"));

    execute(
      { rpc: rpcState, rpcPort },
      { name, workspaceId: workspaceId as string }
    );
  };

  return (
    <form action={onSubmit} className="relative space-y-8">
      <div className="px-3 py-2 rounded-lg border max-w-xs flex">
        <Toggle
          id="rpc"
          label="JSON-RPC Server"
          disabled={role === Roles.Reader}
          checked={rpcState}
          onCheckedChange={setRpcState}
          errors={fieldErrors}
          defaultChecked={rpc}
          className="justify-between"
        />
      </div>

      <Input
        id="rpcPort"
        label="JSON-RPC Port"
        disabled={role === Roles.Reader || !rpcState}
        errors={fieldErrors}
        defaultValue={rpcPort}
        className="max-w-xs"
      />

      <SubmitSuccess success={success}>
        RPC settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Update</SubmitButton>}
    </form>
  );
};
