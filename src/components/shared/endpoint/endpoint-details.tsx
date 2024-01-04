import Image from "next/image";
import { format, parseISO } from "date-fns";

import { Endpoint, EndpointStats as TEndpointStats } from "@/types";

import { Heading } from "@/components/ui/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RouteURL } from "@/components/shared/endpoint/route-url";
import { EndpointStats } from "./endpoint-stats";

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
      <div className="flex-1 p-8 pl-0 pt-6 space-y-4">
        <div className="flex items-center gap-x-3">
          <Image
            src={`/images/${endpoint.protocol}.svg`}
            width={40}
            height={40}
            alt="Endpoint"
            className="w-10 h-10"
          />
          <Heading
            title={endpoint.name}
            description={`Created at ${format(
              parseISO(endpoint.created_at),
              "MMMM do, yyyy"
            )}`}
          />
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
                {/* Chart Stats */}
                <EndpointStats
                  dailyAggregation={stats[name].daily_aggregation}
                  weeklyAggregation={stats[name].weekly_aggregation}
                />

                {/* Route URL */}
                <RouteURL route={route} />

                {/* Example */}
                <div>
                  <h3 className="text-base">Example</h3>
                  <pre className="px-5 mt-2 overflow-x-scroll bg-muted text-muted-foreground text-xs font-mono rounded-md py-7">
                    {example}
                  </pre>
                </div>

                {/* References */}
                <div>
                  <h3 className="text-base">References</h3>
                  <ul className="space-y-1 list-disc">
                    {references.map((reference) => (
                      <li className="list-none" key={reference}>
                        <a
                          className="text-primary mt-1 hover:underline hover:underline-offset-4"
                          href={reference}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {reference}
                        </a>
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
