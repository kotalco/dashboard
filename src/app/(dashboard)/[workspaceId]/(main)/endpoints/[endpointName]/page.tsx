import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { format, parseISO } from "date-fns";

import { getWorkspace } from "@/services/get-workspace";
import { Roles, StorageItems } from "@/enums";
import { Heading } from "@/components/ui/heading";

import { getEndpoint } from "@/services/get-endpoint";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RouteURL } from "./components/route-url";
import { DeleteEndpoint } from "./components/delete-endpoint";

export default async function EndpointPage({
  params,
}: {
  params: { workspaceId: string; endpointName: string };
}) {
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  const { workspaceId, endpointName } = params;
  const { role } = await getWorkspace(workspaceId);

  try {
    const { endpoint } = await getEndpoint(workspaceId, endpointName);

    return (
      <div className="flex-col">
        <div className="flex-1 p-8 pt-6 space-y-4">
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

        <Card>
          <CardContent>
            {endpoint.routes.map(({ name, route, example, references }, i) => (
              <div
                key={name}
                className="space-y-3 text-sm text-gray-500 pt-7 first:pt-2"
              >
                {/* Route Name */}
                <div className="uppercase text-2xl font-nunito text-foreground">
                  {name}
                </div>

                {/* Route URL */}
                <RouteURL route={route} />

                {/* Example */}
                <div>
                  <h3 className="text-gray-900 text-base">Example</h3>
                  <pre className="px-5 mt-2 overflow-x-scroll bg-gray-100 text-gray-700 text-xs font-mono rounded-md py-7">
                    {example}
                  </pre>
                </div>

                {/* References */}
                <div>
                  <h3 className="text-gray-700 text-base">References</h3>
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
            ))}
          </CardContent>
        </Card>

        {role === Roles.Admin && <DeleteEndpoint name={endpoint.name} />}
      </div>
    );
  } catch (e) {
    notFound();
  }
}