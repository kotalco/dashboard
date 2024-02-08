import Image from "next/image";
import { Fragment } from "react";

import { Endpoint, EndpointStats as TEndpointStats } from "@/types";
import { formatDate } from "@/lib/utils";

import { Heading } from "@/components/ui/heading";
import { RouteURL } from "@/components/shared/endpoint/route-url";
import { ExternalLink } from "@/components/ui/external-link";
import { Separator } from "@/components/ui/separator";

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
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-x-3">
          <Image
            src={`/images/${endpoint.protocol}.svg`}
            width={40}
            height={40}
            alt="Endpoint"
            className="w-10 h-10"
          />
          <div className="flex items-start gap-x-2">
            <Heading
              title={endpoint.name_label || endpoint.name}
              description={`Created at ${formatDate(endpoint.created_at)}`}
            />
          </div>
        </div>
      </div>

      {endpoint.routes.map(({ name, route, example, references }, i) => (
        <Fragment key={name}>
          <div>
            {/* Route Name */}
            <Heading variant="h2" title={name} className="uppercase" />
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
                      <ExternalLink href={reference}>{reference}</ExternalLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {i !== endpoint.routes.length - 1 && <Separator />}
        </Fragment>
      ))}
    </div>
  );
};
