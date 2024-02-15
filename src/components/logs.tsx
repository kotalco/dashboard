"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import useSWRSubscription from "swr/subscription";
import type { SWRSubscription } from "swr/subscription";
import { AlertTriangle, ArrowDown, Expand } from "lucide-react";

import { getWsBaseURL } from "@/lib/utils";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/tooltip";
import { Textarea } from "@/components/ui/textarea";

interface LogsProps {
  url: string;
}

const WS_URL = getWsBaseURL();
const MAX_LENGTH = 200;
const TIME_INTERVAL = 10000;
const OPEN_CONNECTION_MSG = "Connection Established.";
const CLOSE_CONNECTION_MSG = "Disconnected. Connection Closed.";

export const Logs: React.FC<LogsProps> = ({ url }) => {
  const [counter, setCounter] = useState<number>();
  const [count, setCount] = useState(1);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const logsElement = useRef<HTMLTextAreaElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const counterRef = useRef<NodeJS.Timeout>();

  const scrollToBottom = () => {
    if (logsElement.current) {
      const { scrollHeight, clientHeight } = logsElement.current;
      logsElement.current.scrollTop = scrollHeight - clientHeight;
      setIsAtBottom(true);
    }
  };

  const handleScroll = () => {
    if (logsElement.current) {
      const { scrollTop, scrollHeight, clientHeight } = logsElement.current;
      const atBottom = scrollTop + clientHeight === scrollHeight;
      setIsAtBottom(atBottom);
    }
  };

  const subscription: SWRSubscription<[string, number], string, string> = (
    [url, count],
    { next }
  ) => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      next(null, (prev) => {
        const prevData = prev?.split("\n") || [];
        if (prevData.length > MAX_LENGTH) {
          return `${prevData.slice(1).join("\n")}\n${OPEN_CONNECTION_MSG}`;
        }

        return `${prevData.join("\n")}\n${OPEN_CONNECTION_MSG}`;
      });
    };

    socket.onmessage = (event: MessageEvent<string>) => {
      next(null, (prev) => {
        if (logsElement.current) {
          const { scrollTop, scrollHeight, clientHeight } = logsElement.current;
          const isUserScrolledToBottom =
            scrollTop + clientHeight === scrollHeight;

          // Then, if the user was at the bottom, scroll to the new bottom
          if (isUserScrolledToBottom) {
            setTimeout(() => {
              // Using setTimeout to allow the DOM to update
              scrollToBottom();
            }, 0);
          }
        }

        const prevData = prev?.split("\n") || [];
        if (prevData.length > MAX_LENGTH) {
          return `${prevData.slice(1).join("\n")}\n${event.data}`;
        }

        return `${prevData.join("\n")}\n${event.data}`;
      });
    };

    socket.onclose = () => {
      next(null, (prev) => {
        const prevData = prev?.split("\n") || [];
        setCounter(TIME_INTERVAL);
        timeoutRef.current = setTimeout(() => {
          setCount((c) => c + 1);
        }, TIME_INTERVAL);

        return `${prevData.join("\n")}\n${CLOSE_CONNECTION_MSG}`;
      });
    };

    return () => {
      next(null, () => "");
      socket.close();
    };
  };

  const { data, error } = useSWRSubscription(
    [`${WS_URL}/${url}`, count],
    subscription
  );

  useEffect(() => {
    if (counter === TIME_INTERVAL) {
      counterRef.current = setInterval(() => {
        setCounter((counter) => {
          return counter && counter - 1000;
        });
      }, 1000);
    }

    if (counter === 0) {
      clearInterval(counterRef.current);
    }
  }, [counter]);

  const cancelReconnect = () => {
    clearTimeout(timeoutRef.current);
    clearInterval(counterRef.current);
    setCounter(undefined);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      logsElement.current?.requestFullscreen();
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription className="flex items-start justify-center gap-x-2">
          <AlertTriangle className="w-5 h-5" /> {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data)
    return (
      <div className="space-y-2 h-96">
        {Array.from({ length: 7 }, (_, i) => i).map((i) => {
          return (
            <Fragment key={i}>
              <Skeleton className="w-1/3 h-4" />
              <Skeleton className="w-1/2 h-4" />
              <Skeleton className="w-full h-4" />{" "}
            </Fragment>
          );
        })}
      </div>
    );

  return (
    <div>
      <p className="pb-2 text-sm text-muted-foreground">
        Showing latest 200 logs
      </p>
      <div className="relative">
        <Textarea
          ref={logsElement}
          disabled
          className="h-[500px] disabled:cursor-default overflow-y-auto bg-[#1E1E1E] text-white/90 border-foreground/10 disabled:opacity-100 py-0 resize-none"
          value={data}
          onScroll={handleScroll}
          readOnly
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
        {!!counter && (
          <p>
            <span>{`Trying again in ${counter / 1000}  seconds.`} </span>
            <Button
              variant="link"
              type="button"
              onClick={cancelReconnect}
              className="p-0 underline hover:cursor-pointer"
              asChild
            >
              <span>Cancel</span>
            </Button>
          </p>
        )}
        <div className="absolute z-1 flex flex-col -right-14 top-0">
          <Tooltip content="FullScreen" side="right">
            <Button
              onClick={toggleFullscreen}
              type="button"
              variant="ghost"
              size="icon"
            >
              <Expand className="w-7 h-7" />
            </Button>
          </Tooltip>

          <Tooltip content="Follow Logs" side="right">
            <Button
              className="mt-4"
              onClick={scrollToBottom}
              type="button"
              variant="ghost"
              size="icon"
              disabled={isAtBottom}
            >
              <ArrowDown className="w-7 h-7" />
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
