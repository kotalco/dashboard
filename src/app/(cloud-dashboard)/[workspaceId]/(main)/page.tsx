import { BookOpen, MessageCircle, Phone } from "lucide-react";

import { Card, CardHeader } from "@/components/ui/card";
import { EndpointsCount } from "./components/endpoints-count";
import { SecretsCount } from "./components/secrets-count";
import { DeploymentsCard } from "./components/deployments-card";

export default async function DashboardPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  return (
    <div className="grid grid-cols-12 gap-4 auto-rows-auto">
      <DeploymentsCard workspaceId={params.workspaceId} />

      <div className="col-span-12 lg:col-span-6 row-span-1">
        <EndpointsCount workspaceId={params.workspaceId} />
      </div>
      <div className="col-span-12 lg:col-span-6 row-span-1">
        <SecretsCount workspaceId={params.workspaceId} />
      </div>

      <div className="col-span-12 lg:col-span-6 xl:col-span-4 row-span-1">
        <a href="https://docs.kotal.co" target="_blank" rel="noreferrer">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 hover:text-primary">
                <BookOpen className="w-7 h-7" />
                <h3 className="text-lg font-semibold">
                  Read the Documentation
                </h3>
              </div>
            </CardHeader>
          </Card>
        </a>
      </div>

      <div className="col-span-12 lg:col-span-6 xl:col-span-4 row-span-1">
        <a
          href="https://calendly.com/kotal/30min"
          target="_blank"
          rel="noreferrer"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 hover:text-primary">
                <Phone className="w-7 h-7" />
                <h3 className="text-lg font-semibold">
                  Schedule a Support Call
                </h3>
              </div>
            </CardHeader>
          </Card>
        </a>
      </div>

      <div className="col-span-12 lg:col-span-6 xl:col-span-4 row-span-1">
        <a href="https://discord.gg/kTxy4SA" target="_blank" rel="noreferrer">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 hover:text-primary">
                <MessageCircle className="w-7 h-7" />
                <h3 className="text-lg font-semibold">
                  Join Our Discord Server
                </h3>
              </div>
            </CardHeader>
          </Card>
        </a>
      </div>
    </div>
  );
}
