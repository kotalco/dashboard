"use client";

import useSWRSubscription from "swr/subscription";
import type { SWRSubscription } from "swr/subscription";
import { cx } from "class-variance-authority";

import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWsBaseURL } from "@/lib/utils";
import { AlertCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { BitcoinStats, NEARStats, StatsError } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
          <Skeleton className="w-full h-[128px]" />
        </div>
        <div className="space-y-2 lg:col-span-1">
          <Skeleton className="w-full h-[128px]" />
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
        <Card>
          <CardHeader>
            <CardTitle className="items-start">
              Blocks
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger>
                    <AlertCircle className="w-4 h-4 ml-2" />
                  </TooltipTrigger>
                  <TooltipContent>
                    If block number doesn&apos;t change, it means node is not
                    syncing or syncing headers
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center text-3xl font-light text-foreground/50 truncate gap-x-2">
            {!("error" in data) && (
              <>
                {data.syncing ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                )}
                <span>
                  {new Intl.NumberFormat("en-US").format(
                    +data.latestBlockHeight
                  )}
                </span>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="items-start">
              Peers
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger>
                    <AlertCircle className="w-4 h-4 ml-2" />
                  </TooltipTrigger>
                  <TooltipContent>Active peers / Max peers</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-light text-foreground/50 truncate">
            {!("error" in data) && (
              <>
                {data.activePeersCount} / {data.maxPeersCount}
              </>
            )}
          </CardContent>
        </Card>
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
