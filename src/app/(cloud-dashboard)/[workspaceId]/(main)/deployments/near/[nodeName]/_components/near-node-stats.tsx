"use client";

import useSWRSubscription from "swr/subscription";
import { AlertCircle, AlertTriangle, RefreshCw } from "lucide-react";
import type { SWRSubscription } from "swr/subscription";
import { cx } from "class-variance-authority";

import { getWsBaseURL } from "@/lib/utils";
import { NEARStats, StatsError } from "@/types";

import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CardStats } from "@/components/shared/card-stats/card-stats";

interface NEARNodeStatsProps {
  nodeName: string;
  token: string;
  workspaceId: string;
}

const WS_URL = getWsBaseURL();

export const NEARNodeStats: React.FC<NEARNodeStatsProps> = ({
  nodeName,
  token,
  workspaceId,
}) => {
  const subscription: SWRSubscription<
    string,
    NEARStats | StatsError,
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
    `${WS_URL}/near/nodes/${nodeName}/stats?authorization=Bearer ${token}&workspace_id=${workspaceId}`,
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
        <CardStats title={<BlocksCardTitle />}>
          {!("error" in data) && (
            <div className="flex items-center space-x-2">
              {data.syncing ? (
                <RefreshCw className="w-6 h-6 animate-spin" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              )}
              <span>
                {new Intl.NumberFormat("en-US").format(+data.latestBlockHeight)}
              </span>
            </div>
          )}
        </CardStats>

        {/* Peers */}
        <CardStats title={<PeersCardTitle />}>
          {!("error" in data) && (
            <>
              {data.activePeersCount} / {data.maxPeersCount}
            </>
          )}
        </CardStats>
      </div>

      {"error" in data && typeof data.error === "string" && (
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

const BlocksCardTitle = () => (
  <>
    Blocks
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>
          <AlertCircle className="w-3 h-3 ml-2" />
        </TooltipTrigger>
        <TooltipContent>
          If block number doesn&apos;t change, it means node is not syncing or
          syncing headers
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </>
);

const PeersCardTitle = () => (
  <>
    Peers
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>
          <AlertCircle className="w-3 h-3 ml-2" />
        </TooltipTrigger>
        <TooltipContent>Active peers / Max peers</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </>
);
