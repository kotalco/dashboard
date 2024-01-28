"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { MinusCircle, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { BitcoinNode, OptionType } from "@/types";
import { Roles, SecretType } from "@/enums";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/form/input";
import { Select } from "@/components/form/select";
import { Toggle } from "@/components/form/toggle";
import { Label } from "@/components/ui/label";
import { Heading } from "@/components/ui/heading";

interface ApiProps {
  node: BitcoinNode;
  role: Roles;
  secrets: OptionType[];
  errors?: Record<string, string[] | undefined>;
}

export const Api = ({ node, role, secrets, errors }: ApiProps) => {
  const { rpc, txIndex, rpcUsers } = node;
  const { workspaceId } = useParams() as { workspaceId: string };
  const [usersCount, setUsersCount] = useState(rpcUsers.length);

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="API" />
      <Toggle
        id="rpc"
        label="JSON-RPC Server"
        disabled={role === Roles.Reader}
        errors={errors}
        defaultChecked={rpc}
      />

      <Toggle
        id="txIndex"
        label="Transaction Index"
        disabled={role === Roles.Reader}
        errors={errors}
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
                errors={errors}
              />
            </div>

            <div className="col-span-12 max-w-xs space-y-1 lg:col-span-5 xl:col-span-4">
              {i === 0 && <Label>Password</Label>}
              <Select
                id={`rpcUsers.${i}.passwordSecretName`}
                disabled={role === Roles.Reader}
                defaultValue={rpcUsers[i]?.passwordSecretName}
                errors={errors}
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
                  !errors ? "self-end" : i === 0 ? "self-center" : "self-start"
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
    </div>
  );
};
