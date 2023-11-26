"use client";

import * as z from "zod";
import Link from "next/link";
import { useParams } from "next/navigation";

import { MinusCircle, PlusCircle } from "lucide-react";

import { BitcoinNode, RPCUser, Secret } from "@/types";
import { Roles, SecretType } from "@/enums";

import { Button } from "@/components/ui/button";
import { TabsFooter } from "@/components/ui/tabs";
import { Input } from "@/components/form/input";
import { Select } from "@/components/form/select";
import { useAction } from "@/hooks/use-action";
import { editBitcoinAPI } from "@/actions/edit-bitcoin";
import { Toggle } from "@/components/form/toggle";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { FormErrors } from "@/components/form/form-errors";
import { cn } from "@/lib/utils";

interface APITabProps {
  node: BitcoinNode;
  role: Roles;
  secrets: { label: string; value: string }[];
}

export const APITab: React.FC<APITabProps> = ({ node, role, secrets }) => {
  const { rpc, txIndex, rpcUsers, name } = node;
  const { workspaceId } = useParams();
  const [usersCount, setUsersCount] = useState(rpcUsers.length);
  const { execute, fieldErrors, error, success } = useAction(editBitcoinAPI);

  const onSubmit = (formData: FormData) => {
    const rpc = formData.get("rpc") === "on";
    const txIndex = formData.get("txIndex") === "on";
    const users: {
      [key: string]: RPCUser;
    } = {};
    for (const [key, value] of Array.from(formData.entries())) {
      const match = key.match(
        /^rpcUsers\.(\d+)\.(username|passwordSecretName)$/
      );
      if (match) {
        const [, index, field] = match;

        if (!users[index]) {
          users[index] = { username: "", passwordSecretName: "" };
        }

        users[index][field as keyof RPCUser] = value as string; // Assuming all values are strings
      }
    }
    const rpcUsers = Object.values(users);

    execute(
      { rpc, txIndex, rpcUsers },
      { name, workspaceId: workspaceId as string }
    );
  };

  return (
    <form action={onSubmit} className="relative space-y-4">
      <Toggle
        id="rpc"
        label="JSON-RPC Server"
        disabled={role === Roles.Reader}
        errors={fieldErrors}
        defaultChecked={rpc}
      />

      <Toggle
        id="txIndex"
        label="Transaction Index"
        disabled={role === Roles.Reader}
        errors={fieldErrors}
        defaultChecked={txIndex}
      />

      <div className="space-y-2">
        <Label className="text-base">RPC Users</Label>
        {Array.from({ length: usersCount }, (_, i) => i).map((i) => (
          <div key={i} className="grid grid-cols-12 gap-x-4 items-start">
            <div className="col-span-12 max-w-xs space-y-1 lg:col-span-5 xl:col-span-4">
              {i === 0 && <Label>Username</Label>}
              <Input
                id={`rpcUsers.${i}.username`}
                disabled={role === Roles.Reader}
                defaultValue={rpcUsers[i]?.username}
                errors={fieldErrors}
              />
            </div>

            <div className="col-span-12 max-w-xs space-y-1 lg:col-span-5 xl:col-span-4">
              {i === 0 && <Label>Password</Label>}
              <Select
                id={`rpcUsers.${i}.passwordSecretName`}
                disabled={role === Roles.Reader}
                defaultValue={rpcUsers[i]?.passwordSecretName}
                errors={fieldErrors}
                link={{
                  title: "Create New Password",
                  href: `/${workspaceId}/secrets/new?type=${SecretType.Password}`,
                }}
                options={secrets}
              />
            </div>

            {role !== Roles.Reader && i === usersCount - 1 && (
              <div
                className={cn(
                  "col-span-2",
                  !fieldErrors
                    ? "self-end"
                    : i === 0
                    ? "self-center"
                    : "self-start"
                )}
              >
                {usersCount > 1 && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setUsersCount((c) => c - 1)}
                  >
                    <MinusCircle className="text-gray-400 hover:text-gray-500 w-7 h-7" />
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setUsersCount((c) => c + 1)}
                >
                  <PlusCircle className="text-gray-400 hover:text-gray-500 w-7 h-7" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <SubmitSuccess success={success}>
        API settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && (
        <TabsFooter>
          <SubmitButton data-testid="submit" type="submit">
            Save
          </SubmitButton>
        </TabsFooter>
      )}
    </form>
  );
};
