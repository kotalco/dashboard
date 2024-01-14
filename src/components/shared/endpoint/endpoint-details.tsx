import Image from "next/image";
import { format, parseISO } from "date-fns";
import { Globe } from "lucide-react";

import { Endpoint, EndpointStats as TEndpointStats } from "@/types";

import { Heading } from "@/components/ui/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RouteURL } from "@/components/shared/endpoint/route-url";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "@/components/ui/external-link";

import { EndpointStats } from "./endpoint-stats";
import Example from "./example";

interface EndpointDetailsProps {
  endpoint: Endpoint;
  stats: TEndpointStats;
}

export const EndpointDetails = async ({
  endpoint,
  stats,
}: EndpointDetailsProps) => {
  return (
    <>
      <div className="flex-1 pb-8 space-y-4">
        <div className="flex items-center gap-x-3">
          <Image
            src={`/images/${endpoint.protocol}.svg`}
            width={40}
            height={40}
            alt="Endpoint"
            className="w-10 h-10"
          />
          <div className="flex items-start gap-x-6">
            <Heading
              title={endpoint.name}
              description={`Created at ${format(
                parseISO(endpoint.created_at),
                "MMMM do, yyyy"
              )}`}
            />
            {endpoint.network && (
              <Badge>
                <Globe className="w-4 h-4 mr-2" />
                {endpoint.network}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {endpoint.routes.map(({ name, route, example, references }, i) => (
          <Card key={name}>
            <CardHeader>
              {/* Route Name */}
              <CardTitle className="uppercase font-nunito">{name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm pt-7 first:pt-2">
                {/* Route URL */}
                <RouteURL route={route} />

                {/* Example */}
                <Example example={example} />

                {/* Chart Stats */}
                <EndpointStats
                  dailyAggregation={stats[name].daily_aggregation}
                  weeklyAggregation={stats[name].weekly_aggregation}
                />

                {/* References */}
                <div>
                  <h3 className="text-base">References</h3>
                  <ul className="space-y-1 list-disc">
                    {references.map((reference) => (
                      <li className="list-none" key={reference}>
                        <ExternalLink href={reference}>
                          {reference}
                        </ExternalLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};
