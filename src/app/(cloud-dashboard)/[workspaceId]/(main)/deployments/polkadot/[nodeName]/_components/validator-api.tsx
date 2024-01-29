"use client";

import { useState } from "react";

import { PolkadotNode } from "@/types";
import { Roles } from "@/enums";

import { Toggle } from "@/components/form/toggle";
import { AlertModal } from "@/components/modals/alert-modal";
import { CloseDialogButton } from "@/components/ui/close-dialog-button";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/form/input";

interface ValidatorApiProps {
  node: PolkadotNode;
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const ValidatorApi = ({ node, role, errors }: ValidatorApiProps) => {
  const { validator, pruning, rpc, rpcPort, ws, wsPort } = node;
  const [isValidatorOpen, setIsValidatorOpen] = useState(false);
  const [isRpcOpen, setIsRpcOpen] = useState(false);
  const [isValidator, setIsValidator] = useState(validator);
  const [isRpc, setIsRpc] = useState(rpc);
  const [isWs, setIsWs] = useState(ws);

  const handleValidatorConfirm = () => {
    setIsValidator(true);
    setIsRpc(false);
    setIsValidatorOpen(false);
  };

  const handleValidatorChange = (value: boolean) => {
    if (value && isRpc) {
      setIsValidatorOpen(value);
      return;
    }
    setIsValidator(value);
  };

  const handleRpcConfirm = () => {
    setIsRpc(true);
    setIsValidator(false);
    setIsRpcOpen(false);
  };

  const handleRpcChange = (value: boolean) => {
    if (value && isValidator) {
      setIsRpcOpen(value);
      return;
    }
    setIsRpc(value);
  };

  return (
    <>
      {/* Validator */}
      <div className="space-y-4">
        <Heading variant="h2" title="Validator" />
        <Toggle
          id="validator"
          label="Validator"
          disabled={role === Roles.Reader || pruning}
          checked={isValidator}
          defaultChecked={isValidator}
          onCheckedChange={handleValidatorChange}
          errors={errors}
          description={pruning ? "Node started with pruning enabled." : ""}
        />

        <AlertModal
          open={isValidatorOpen}
          onOpenChange={setIsValidatorOpen}
          title="Warning"
        >
          <p className="text-foreground/70 text-sm">
            Activating validator will disable JSON-RPC Port. Are you sure you
            want to continue?
          </p>

          <CloseDialogButton>
            <Button
              type="button"
              variant="destructive"
              onClick={handleValidatorConfirm}
            >
              Continue
            </Button>
          </CloseDialogButton>
        </AlertModal>
      </div>

      {/* API */}
      <div className="space-y-4">
        <Heading variant="h2" title="API" />
        <Toggle
          id="rpc"
          label="JSON-RPC Server"
          defaultChecked={isRpc}
          checked={isRpc}
          onCheckedChange={handleRpcChange}
          errors={errors}
          disabled={role === Roles.Reader}
        />

        <Input
          className="max-w-xs"
          id="rpcPort"
          label="JSON-RPC Port"
          disabled={role === Roles.Reader || !isRpc}
          errors={errors}
          defaultValue={rpcPort}
        />

        <Toggle
          id="ws"
          label="WebSocket Server"
          defaultChecked={isWs}
          checked={isWs}
          onCheckedChange={setIsWs}
          errors={errors}
          disabled={role === Roles.Reader}
        />

        <Input
          className="max-w-xs"
          id="wsPort"
          label="WebSocket Server Port"
          disabled={role === Roles.Reader || !isWs}
          errors={errors}
          defaultValue={wsPort}
        />

        <AlertModal
          open={isRpcOpen}
          onOpenChange={setIsRpcOpen}
          title="Warning"
        >
          <p className="text-foreground/70 text-sm">
            Activating RPC will disable Validator Port. Are you sure you want to
            continue?
          </p>

          <CloseDialogButton>
            <Button
              type="button"
              variant="destructive"
              onClick={handleRpcConfirm}
            >
              Continue
            </Button>
          </CloseDialogButton>
        </AlertModal>
      </div>
    </>
  );
};
