import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BrandLogo } from "@/components/shared/no-result/brand-logo";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export const NoEndpoints = () => {
  return (
    <Card className="flex flex-col items-center text-center shadow-none border-0 col-span-12">
      <CardHeader className="flex flex-col items-center">
        <BrandLogo src="/images/endpoint.svg" />
        <CardTitle>No Endpoints</CardTitle>
        <CardDescription>
          Endpoints are secure routes to virtual node API.
        </CardDescription>
      </CardHeader>

      <Suspense fallback={<Skeleton className="h-11 w-[200px] mb-6" />}>
        <Button size="lg" asChild>
          <Link href="/virtual-endpoints/new">
            <Plus className="w-4 h-4 mr-2" />
            New Endpoint
          </Link>
        </Button>
      </Suspense>
    </Card>
  );
};
