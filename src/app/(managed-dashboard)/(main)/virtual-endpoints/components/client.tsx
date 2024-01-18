"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { NoResult } from "@/components/shared/no-result/no-result";
import { DataTable } from "@/components/ui/data-table";
import { EndpointColumn, columns } from "./colums";

interface EndpointsClientProps {
  data: EndpointColumn[];
}

export const EndpointsClient: React.FC<EndpointsClientProps> = ({ data }) => {
  const router = useRouter();

  const endpoints = data.map((endpoint) => ({
    ...endpoint,
    onClick: () => router.push(`/virtual-endpoints/${endpoint.name}`),
  }));

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Endpoints" />

        {!!data.length && (
          <Button onClick={() => router.push(`/virtual-endpoints/new`)}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Endpoint
          </Button>
        )}
      </div>

      {!!data.length && <DataTable columns={columns} data={endpoints} />}
      {!data.length && (
        <NoResult
          imageUrl="/images/endpoint.svg"
          title="No Endpoints"
          description="Endpoints are secure routes that allow developers to call your deployed nodes' APIs."
          createUrl={`/virtual-endpoints/new`}
          buttonText="Create New Endpoint"
        />
      )}
    </>
  );
};
