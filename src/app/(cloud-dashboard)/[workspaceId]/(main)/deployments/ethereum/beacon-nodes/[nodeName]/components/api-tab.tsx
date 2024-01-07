"use client";

import { useParams } from "next/navigation";

import { useAction } from "@/hooks/use-action";
import { BeaconNode } from "@/types";
import { BeaconNodeClients, Roles } from "@/enums";
import { editAPI } from "@/actions/edit-beacon-node";

import { Toggle } from "@/components/form/toggle";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

interface APITabProps {
  node: BeaconNode;
  role: Roles;
}

export const APITab: React.FC<APITabProps> = ({ node, role }) => {
  const { rest, rpc, grpc, name, client } = node;
  const { workspaceId } = useParams();

  const { execute, fieldErrors, error, success } = useAction(editAPI);

  const onSubmit = (formData: FormData) => {
    const rpc = formData.get("rpc") === "on";
    const rest = formData.get("rest") === "on";
    const grpc = formData.get("grpc") === "on";
    execute({ rpc, rest, grpc }, { name, workspaceId: workspaceId as string });
  };

  return (
    <form action={onSubmit} className="relative space-y-8">
      {(client === BeaconNodeClients["ConsenSys Teku"] ||
        client === BeaconNodeClients["Sigma Prime Lighthouse"] ||
        client === BeaconNodeClients["Status.im Nimbus"]) && (
        <div className="px-3 py-2 rounded-lg border max-w-xs flex">
          <Toggle
            id="rest"
            label="REST API Server"
            disabled={role === Roles.Reader}
            defaultChecked={rest}
            errors={fieldErrors}
            className="justify-between"
          />
        </div>
      )}

      {node.client === BeaconNodeClients["Prysatic Labs Prysm"] && (
        <div className="px-3 py-2 rounded-lg border max-w-xs flex">
          <Toggle
            id="rpc"
            label="JSON-RPC Server"
            disabled
            defaultChecked={rpc}
            description="JSON-RPC Server cann't be disabled for Prysm."
            errors={fieldErrors}
            className="justify-between"
          />
        </div>
      )}

      {node.client === BeaconNodeClients["Prysatic Labs Prysm"] && (
        <div className="px-3 py-2 rounded-lg border max-w-xs flex">
          <Toggle
            id="grpc"
            label="GRPC Gateway Server"
            disabled={role === Roles.Reader}
            defaultChecked={grpc}
            errors={fieldErrors}
            className="justify-between"
          />
        </div>
      )}

      <SubmitSuccess success={success}>
        API settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Save</SubmitButton>}
    </form>
  );
};
