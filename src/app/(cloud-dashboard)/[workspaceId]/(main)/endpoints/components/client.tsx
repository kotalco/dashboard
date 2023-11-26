"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Roles } from "@/enums";
import { NoResult } from "@/components/no-result";
import { DataTable } from "@/components/ui/data-table";
import { EndpointColumn, columns } from "./colums";

interface EndpointsClientProps {
  data: EndpointColumn[];
  role: Roles;
}

export const EndpointsClient: React.FC<EndpointsClientProps> = ({
  data,
  role,
}) => {
  const router = useRouter();
  const params = useParams();

  const endpoints = data.map((endpoint) => ({
    ...endpoint,
    onClick: () =>
      router.push(`/${params.workspaceId}/endpoints/${endpoint.name}`),
  }));

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Endpoints" />

        {role !== Roles.Reader && !!data.length && (
          <Button
            onClick={() => router.push(`/${params.workspaceId}/endpoints/new`)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Endpoint
          </Button>
        )}
      </div>

      {!!data.length && <DataTable columns={columns} data={endpoints} />}
      {!data.length && (
        <NoResult
          imageUrl="/images/endpoint.svg"
          title="No Endpoints Available"
          description="Endpoints are secure routes that allow developers to call your deployed nodes' APIs."
          createUrl={`/${params.workspaceId}/endpoints/new`}
          buttonText="Create New Endpoint"
          role={role}
        />
      )}
    </>
  );
};
