"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import useSWRSubscription from "swr/subscription";
import type { SWRSubscription } from "swr/subscription";
import { AlertTriangle, Expand } from "lucide-react";

import { getWsBaseURL } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

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

  const logsElement = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const counterRef = useRef<NodeJS.Timeout>();

  const subscription: SWRSubscription<[string, number], string[], string> = (
    [url, count],
    { next }
  ) => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      next(null, (prev) => {
        const prevData = prev || [];
        if (prevData.length > MAX_LENGTH) {
          return [...prevData.slice(1), OPEN_CONNECTION_MSG];
        }

        return [...prevData, OPEN_CONNECTION_MSG];
      });
    };

    socket.onmessage = (event: MessageEvent<string>) => {
      next(null, (prev) => {
        const prevData = prev || [];
        if (prevData.length > MAX_LENGTH) {
          return [...prevData.slice(1), event.data];
        }
        return [...prevData, event.data];
      });
    };

    socket.onclose = () => {
      next(null, (prev) => {
        const prevData = prev || [];
        setCounter(TIME_INTERVAL);
        timeoutRef.current = setTimeout(() => {
          setCount((c) => c + 1);
        }, TIME_INTERVAL);

        return [...prevData, CLOSE_CONNECTION_MSG];
      });
    };

    return () => socket.close();
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
        {Array.from({ length: 5 }, (_, i) => i).map((i) => {
          return (
            <Fragment key={i}>
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-40 h-4" />
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
        <div
          ref={logsElement}
          className="relative px-3 overflow-y-auto text-sm text-white bg-black border border-black peer h-96 overscroll-container"
        >
          <ul>
            {data?.map((log, i) => (
              <li
                className={`${
                  log === OPEN_CONNECTION_MSG
                    ? "text-green-500"
                    : log === CLOSE_CONNECTION_MSG
                    ? "text-red-500"
                    : ""
                }`}
                key={i}
              >
                <span>{log}</span>
              </li>
            ))}
            {!!counter && (
              <li>
                <span>
                  {`Will retry to connect in ${counter / 1000} seconds. `}

                  <button
                    type="button"
                    onClick={cancelReconnect}
                    className={`underline hover:no-underline text-xs text-red-500 disabled:sr-only`}
                  >
                    Cancel
                  </button>
                </span>
              </li>
            )}
          </ul>
        </div>
        <button
          onClick={toggleFullscreen}
          type="button"
          className="absolute z-10 hidden text-white hover:block peer-hover:block right-3 top-3"
        >
          <Expand className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};
