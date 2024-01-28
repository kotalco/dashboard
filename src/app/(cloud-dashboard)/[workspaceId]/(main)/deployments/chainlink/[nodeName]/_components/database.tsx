"use client";

import { useParams } from "next/navigation";

import { Input } from "@/components/form/input";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

import { ChainlinkNode } from "@/types";
import { Roles } from "@/enums";
import { editDatabase } from "@/actions/edit-chainlink";
import { useAction } from "@/hooks/use-action";
import { Heading } from "@/components/ui/heading";

interface DatabaseProps {
  node: ChainlinkNode;
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const Database = ({ node, role, errors }: DatabaseProps) => {
  const { databaseURL } = node;

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Database" />
      <Input
        id="databaseURL"
        label="Database Connection URL"
        defaultValue={databaseURL}
        disabled={role === Roles.Reader}
        errors={errors}
        className="max-w-sm"
      />
    </div>
  );
};
