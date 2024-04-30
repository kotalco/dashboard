"use client";

import useSWRSubscription from "swr/subscription";
import { useParams } from "next/navigation";
import { cx } from "class-variance-authority";
import { AlertTriangle } from "lucide-react";
import type { SWRSubscription } from "swr/subscription";

import { getWsBaseURL } from "@/lib/utils";
import { AptosStats, StatsError } from "@/types";

import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CardStats } from "@/components/shared/card-stats/card-stats";

interface AptosNodeStatsProps {
  nodeName: string;
  token: string;
}

const WS_URL = getWsBaseURL();

export const AptosNodeStats: React.FC<AptosNodeStatsProps> = ({
  nodeName,
  token,
}) => {
  const { workspaceId } = useParams();
  const subscription: SWRSubscription<
    string,
    AptosStats | StatsError,
    string
  > = (key, { next }) => {
    const socket = new WebSocket(key);
    socket.onmessage = (event: MessageEvent<string>) => {
      const stats = JSON.parse(event.data);
      next(null, stats);
    };
    socket.onerror = () => next("Connection Error (Can not access node stats)");

    return () => socket.close();
  };
  const { data, error } = useSWRSubscription(
    `${WS_URL}/aptos/nodes/${nodeName}/stats?authorization=Bearer ${token}&workspace_id=${workspaceId}`,
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
          <Skeleton className="w-full h-[118px]" />
        </div>
        <div className="space-y-2 lg:col-span-1">
          <Skeleton className="w-full h-[118px]" />
        </div>
      </>
    );

  return (
    <div className="relative lg:col-span-2">
      <div
        className={cx(
          "grid grid-cols-1 gap-5 lg:grid-cols-2",
          "error" in data ? "blur-lg" : ""
        )}
      >
        {/* Blocks */}
        <CardStats title="Blocks">
          {!("error" in data) &&
            new Intl.NumberFormat("en-US").format(+data.currentBlock)}
        </CardStats>

        {/* Peers */}
        <CardStats title="Peers">
          {!("error" in data) && data.peerCount}
        </CardStats>
      </div>

      {"error" in data && (
        <div className="absolute inset-0 flex items-center justify-center space-x-4">
          <AlertTriangle
            className="w-10 h-10 leading-9 text-yellow-500"
            aria-hidden="true"
          />
          <p className="text-3xl text-gray-600">{data.error}</p>
        </div>
      )}
    </div>
  );
};
