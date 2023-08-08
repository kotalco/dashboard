"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { DataTable } from "@/components/ui/data-table";
import { Roles } from "@/enums";
import { SecretColumn, columns } from "./colums";
import { NoResult } from "@/components/ui/no-result";

interface SecretsClientProps {
  data: SecretColumn[];
  role: Roles;
}

export const SecretsClient: React.FC<SecretsClientProps> = ({ data, role }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Secrets" />

        {role !== Roles.Reader && !!data.length && (
          <Button
            onClick={() => router.push(`/${params.workspaceId}/secrets/new`)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Secret
          </Button>
        )}
      </div>
      {/* <Separator /> */}

      {!!data.length && <DataTable columns={columns} data={data} />}
      {!data.length && (
        <NoResult
          imageUrl="/images/key.svg"
          title="No Secrets"
          description="Secret stores sensetive data into secure location that can be referenced by multiple nodes."
          createUrl={`/${params.workspaceId}/secrets/new`}
          buttonText="Create New Secret"
          role={role}
        />
      )}
    </>
  );
};
