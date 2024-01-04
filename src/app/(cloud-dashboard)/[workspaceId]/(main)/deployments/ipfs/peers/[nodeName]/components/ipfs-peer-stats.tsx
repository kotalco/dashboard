"use client";

import useSWRSubscription from "swr/subscription";
import { cx } from "class-variance-authority";
import type { SWRSubscription } from "swr/subscription";

import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWsBaseURL } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { IpfsPeerStats, StatsError } from "@/types";

interface IPFSPeerStatsProps {
  nodeName: string;
  token: string;
  workspaceId: string;
}

const WS_URL = getWsBaseURL();

export const IPFSPeerStats: React.FC<IPFSPeerStatsProps> = ({
  nodeName,
  token,
  workspaceId,
}) => {
  const subscription: SWRSubscription<
    string,
    IpfsPeerStats | StatsError,
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
    `${WS_URL}/ipfs/peers/${nodeName}/stats?authorization=Bearer ${token}&workspace_id=${workspaceId}`,
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
            <CardTitle className="items-start">Peers</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center text-3xl text-muted-foreground font-light truncate gap-x-2">
            {!("error" in data) && data.PeerCount}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pins</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-light text-muted-foreground truncate">
            {!("error" in data) && data.PinCount}
          </CardContent>
        </Card>
      </div>
      {"error" in data && typeof data.error === "string" && (
        <div className="absolute inset-0 flex items-center justify-center space-x-4">
          <AlertTriangle
            className="w-10 h-10 leading-9 text-warning"
            aria-hidden="true"
          />
          <p className="text-3xl">{data.error}</p>
        </div>
      )}
    </div>
  );
};
