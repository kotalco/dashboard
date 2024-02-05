"use client";

import { useState } from "react";

import { PolkadotNode } from "@/types";
import { Roles } from "@/enums";

import { Toggle } from "@/components/form/toggle";
import { AlertModal } from "@/components/modals/alert-modal";
import { CloseDialogButton } from "@/components/ui/close-dialog-button";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";

interface ValidatorApiProps {
  node: PolkadotNode;
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const ValidatorApi = ({ node, role, errors }: ValidatorApiProps) => {
  const { validator, pruning, rpc, ws } = node;
  const [isValidatorOpen, setIsValidatorOpen] = useState(false);
  const [isRpcOpen, setIsRpcOpen] = useState({ value: false, type: "" });
  const [isValidator, setIsValidator] = useState(validator);
  const [isRpc, setIsRpc] = useState(rpc);
  const [isWs, setIsWs] = useState(ws);

  const handleValidatorConfirm = () => {
    setIsValidator(true);
    setIsRpc(false);
    setIsWs(false);
    setIsValidatorOpen(false);
  };

  const handleValidatorChange = (value: boolean) => {
    if (value && (isRpc || isWs)) {
      setIsValidatorOpen(value);
      return;
    }
    setIsValidator(value);
  };

  const handleRpcConfirm = () => {
    if (isRpcOpen.type === "rpc") setIsRpc(true);
    if (isRpcOpen.type === "ws") setIsWs(true);

    setIsValidator(false);
    setIsRpcOpen({ value: false, type: "" });
  };

  const handleRpcChange = (value: boolean, type: "rpc" | "ws") => {
    if (value && isValidator) {
      setIsRpcOpen({ value, type });
      return;
    }
    if (type === "rpc") setIsRpc(value);
    if (type === "ws") setIsWs(value);
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
            Activating validator will disable JSON-RPC and WebSocket Ports. Are
            you sure you want to continue?
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
          onCheckedChange={(value) => handleRpcChange(value, "rpc")}
          errors={errors}
          disabled={role === Roles.Reader}
        />

        <Toggle
          id="ws"
          label="WebSocket Server"
          defaultChecked={isWs}
          checked={isWs}
          onCheckedChange={(value) => handleRpcChange(value, "ws")}
          errors={errors}
          disabled={role === Roles.Reader}
        />

        <AlertModal
          open={isRpcOpen.value}
          onOpenChange={(value) => setIsRpcOpen({ value, type: "" })}
          title="Warning"
        >
          <p className="text-foreground/70 text-sm">
            Activating JSON-RPC or WebSocket Ports will disable Validator Port.
            Are you sure you want to continue?
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
