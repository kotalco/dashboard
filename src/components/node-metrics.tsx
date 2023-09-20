"use client";

import useSWRSubscription from "swr/subscription";
import type { SWRSubscription } from "swr/subscription";
import { AlertTriangle } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Protocol } from "@/enums";
import { getWsBaseURL } from "@/lib/utils";
import { Chart } from "@/components/ui/chart";

interface NodeMetricsProps {
  nodeName: string;
  protocol: Protocol;
  token: string;
  workspaceId: string;
}

interface Metrics {
  cpu: number[];
  memory: number[];
}

const WS_URL = getWsBaseURL();
const MAX_LENGTH = 60;

export const NodeMetrics: React.FC<NodeMetricsProps> = ({
  nodeName,
  protocol,
  token,
  workspaceId,
}) => {
  const subscription: SWRSubscription<string, Metrics, string> = (
    key,
    { next }
  ) => {
    const socket = new WebSocket(key);
    socket.onmessage = (event: MessageEvent<string>) => {
      const metrics = JSON.parse(event.data) as { cpu: number; memory: number };

      next(null, (prev) => {
        const prevMetrics = prev || { cpu: [], memory: [] };
        const cpuCores = parseFloat((metrics.cpu / 1000).toFixed(2));
        const memoryGb = parseFloat((metrics.memory / 1024).toFixed(2));
        const { cpu, memory } = prevMetrics;

        if (cpu.length >= MAX_LENGTH) {
          return {
            cpu: [...cpu.slice(1), cpuCores],
            memory: [...memory.slice(1), memoryGb],
          };
        }

        return {
          cpu: [...cpu, cpuCores],
          memory: [...memory, memoryGb],
        };
      });
    };
    socket.onerror = () =>
      next("Connection Error (Can not access node metrics)");

    return () => socket.close();
  };
  const { data, error } = useSWRSubscription(
    `${WS_URL}/${protocol}/nodes/${nodeName}/metrics?authorization=Bearer ${token}&workspace_id=${workspaceId}`,
    subscription
  );

  if (error) {
    return (
      <Alert variant="destructive" className="lg:col-span-2">
        <AlertDescription className="flex items-start justify-center gap-x-2">
          <AlertTriangle className="w-5 h-5" /> {error}
        </AlertDescription>
      </Alert>
    );
  }
  if (!data)
    return (
      <>
        <div className="space-y-2 lg:col-span-1">
          <Skeleton className="w-full h-[128px]" />
        </div>
        <div className="space-y-2 lg:col-span-1">
          <Skeleton className="w-full h-[128px]" />
        </div>
      </>
    );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>CPU</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart unit="Cores" data={data.cpu} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Memory</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart unit="GB" data={data.memory} borderColor="rgb(53, 162, 235)" />
        </CardContent>
      </Card>
    </>
  );
};
