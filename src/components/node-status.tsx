"use client";

import useSWRSubscription from "swr/subscription";
import type { SWRSubscription } from "swr/subscription";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { NodeStatuses, Protocol } from "@/enums";
import { getEnumKey, getStatusColor, getWsBaseURL } from "@/lib/utils";

interface NodeStatusProps {
  nodeName: string;
  protocol: Protocol;
  token: string;
  workspaceId: string;
  component?: "nodes" | "beaconnodes" | "validators" | "peers" | "clusterpeers";
}

const WS_URL = getWsBaseURL();

export const NodeStatus: React.FC<NodeStatusProps> = ({
  nodeName,
  protocol,
  token,
  workspaceId,
  component = "nodes",
}) => {
  const subscription: SWRSubscription<string, NodeStatuses, string> = (
    key,
    { next }
  ) => {
    const socket = new WebSocket(key);
    socket.onmessage = (event: MessageEvent<NodeStatuses>) =>
      next(null, event.data);
    socket.onerror = () => next(null, NodeStatuses["Connection Error"]);

    return () => socket.close();
  };
  const { data } = useSWRSubscription(
    `${WS_URL}/${protocol}/${component}/${nodeName}/status?authorization=Bearer ${token}&workspace_id=${workspaceId}`,
    subscription
  );

  if (!data) return <Skeleton className="w-3 h-3 mt-3 rounded-full" />;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <span className="relative flex w-3 h-3 mt-3">
            <span
              style={{ backgroundColor: getStatusColor(data) }}
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75`}
            />
            <span
              style={{ background: getStatusColor(data) }}
              className={`relative inline-flex rounded-full h-3 w-3`}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent>{getEnumKey(NodeStatuses, data)}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
