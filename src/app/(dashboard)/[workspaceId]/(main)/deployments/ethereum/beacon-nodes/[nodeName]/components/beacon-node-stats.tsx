"use client";

import useSWRSubscription from "swr/subscription";
import { cx } from "class-variance-authority";
import { AlertCircle, RefreshCw } from "lucide-react";
import type { SWRSubscription } from "swr/subscription";

import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWsBaseURL } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { BeaconStats, StatsError } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BeaconNodeStatsProps {
  nodeName: string;
  token: string;
  workspaceId: string;
}

const WS_URL = getWsBaseURL();

export const BeaconNodeStats: React.FC<BeaconNodeStatsProps> = ({
  nodeName,
  token,
  workspaceId,
}) => {
  const subscription: SWRSubscription<
    string,
    BeaconStats | StatsError,
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
    `${WS_URL}/ethereum2/beaconnodes/${nodeName}/stats?authorization=Bearer ${token}&workspace_id=${workspaceId}`,
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

  const syncPercentage =
    !("error" in data) &&
    (!+data.targetSlot
      ? "00%"
      : `${((+data.currentSlot / +data.targetSlot) * 100).toFixed(2)}%`);

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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AlertCircle className="w-4 h-4 ml-2" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{syncPercentage}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center text-3xl font-light text-gray-500 truncate gap-x-2">
            {!("error" in data) && (
              <>
                {!data.syncing ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                ) : (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                )}
                <span>
                  {new Intl.NumberFormat("en-US").format(+data.currentSlot)}
                </span>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Peers</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-light text-gray-500 truncate">
            {!("error" in data) && data.peersCount}
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
