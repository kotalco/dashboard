import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { getVirtualEndpoints } from "@/services/get-virtual-endpoints";
import { getEnumKey } from "@/lib/utils";
import { Networks, Protocol } from "@/enums";

import { DeploymentsList } from "@/components/deployments-list";
import { NoResult } from "@/components/shared/no-result/no-result";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export const EndpointsList = async () => {
  const { data } = await getVirtualEndpoints();

  if (!data.length) {
    return (
      <NoResult
        imageUrl="/images/endpoint.svg"
        title="No Endpoints"
        description="Endpoints are secure routes that allow developers to call your deployed nodes' APIs."
        createUrl="/virtual-endpoints/new"
        buttonText="New Endpoint"
      />
    );
  }

  const endpoints = data.map(
    ({ protocol, name, name_label, created_at, network }) => ({
      name: name_label || name,
      protocol: getEnumKey(Protocol, protocol),
      network: getEnumKey(Networks, network),
      createdAt: created_at,
      url: `/virtual-endpoints/${name}`,
    })
  );

  return (
    <>
      <div className="col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3 justify-self-end">
        <Suspense fallback={<Skeleton className="w-full h-11" />}>
          <Button asChild size="lg">
            <Link href="/virtual-endpoints/new">
              <Plus className="w-4 h-4 mr-2" />
              New Endpoint
            </Link>
          </Button>
        </Suspense>
      </div>

      <DeploymentsList data={endpoints} />
    </>
  );
};
