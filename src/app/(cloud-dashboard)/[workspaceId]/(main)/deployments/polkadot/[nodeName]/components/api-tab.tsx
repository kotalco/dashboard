"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { PolkadotNode } from "@/types";
import { Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editAPI } from "@/actions/edit-polkadot";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/form/input";
import { CloseDialogButton } from "@/components/ui/close-dialog-button";
import { AlertModal } from "@/components/modals/alert-modal";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { Toggle } from "@/components/form/toggle";

interface APITabProps {
  node: PolkadotNode;
  role: Roles;
}

export const APITab: React.FC<APITabProps> = ({ node, role }) => {
  const { rpc, rpcPort, ws, wsPort, validator, name } = node;
  const { workspaceId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isRpc, setIsRpc] = useState(rpc);
  const [isWs, setIsWs] = useState(ws);
  const { execute, fieldErrors, error, success } = useAction(editAPI);

  const handleConfirm = () => {
    setIsRpc(true);
    setIsOpen(false);
  };

  const handleCheckChange = (value: boolean) => {
    if (value && validator) {
      setIsOpen(value);
    }
    setIsRpc(value);
  };

  const onSubmit = (formData: FormData) => {
    const rpcPort = Number(formData.get("rpcPort"));
    const wsPort = Number(formData.get("wsPort"));

    execute(
      {
        rpcPort,
        rpc: isRpc,
        wsPort,
        ws: isWs,
        validator,
      },
      { name, workspaceId: workspaceId as string }
    );
  };

  return (
    <form action={onSubmit} className="relative space-y-8">
      <div className="px-3 py-2 rounded-lg border max-w-xs flex">
        <Toggle
          id="rpc"
          label="JSON-RPC Server"
          defaultChecked={isRpc}
          checked={isRpc}
          onCheckedChange={handleCheckChange}
          errors={fieldErrors}
          disabled={role === Roles.Reader}
          className="justify-between"
        />
      </div>

      <Input
        className="max-w-xs"
        id="rpcPort"
        label="JSON-RPC Port"
        disabled={role === Roles.Reader || !isRpc}
        errors={fieldErrors}
        defaultValue={rpcPort}
      />

      <div className="px-3 py-2 rounded-lg border max-w-xs flex">
        <Toggle
          id="ws"
          label="WebSocket Server"
          defaultChecked={isWs}
          checked={isWs}
          onCheckedChange={setIsWs}
          errors={fieldErrors}
          disabled={role === Roles.Reader}
          className="justify-between"
        />
      </div>

      <Input
        className="max-w-xs"
        id="wsPort"
        label="WebSocket Server Port"
        disabled={role === Roles.Reader || !isWs}
        errors={fieldErrors}
        defaultValue={wsPort}
      />

      <SubmitSuccess success={success}>
        API settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Update</SubmitButton>}

      <AlertModal open={isOpen} onOpenChange={setIsOpen} title="Warning">
        <p className="text-foreground/70 text-sm">
          Activating RPC will disable Validator Port. Are you sure you want to
          continue?
        </p>

        <CloseDialogButton>
          <Button type="button" variant="destructive" onClick={handleConfirm}>
            Continue
          </Button>
        </CloseDialogButton>
      </AlertModal>
    </form>
  );
};
