"use client";

import { useRouter } from "next/navigation";
import { Cpu, Globe, Link2 } from "lucide-react";

import { ListInfo } from "@/types";

import { Heading } from "@/components/ui/heading";
import { cn, formatTimeDistance } from "@/lib/utils";

interface DeployemntsListProps {
  data: ListInfo[];
}

export const DeploymentsList: React.FC<DeployemntsListProps> = async ({
  data,
}) => {
  const router = useRouter();

  const handleClick = (url: string) => {
    router.push(url);
  };

  return (
    <div className="col-span-12">
      <ul className="overflow-hidden border rounded-md shadow-sm divide-y divide-muted">
        {data.map(
          ({
            name,
            network,
            client,
            url,
            createdAt,
            version,
            protocol,
            type,
          }) => (
            <li key={name}>
              <div
                onClick={url ? () => handleClick(url) : undefined}
                className={cn(
                  "block",
                  url && "hover:bg-muted hover:cursor-pointer"
                )}
              >
                <div className="flex items-end px-4 py-4 sm:px-6">
                  <div className="flex-1 min-w-0 space-y-2">
                    <Heading variant="h3" title={name} />
                    <div className="flex text-sm gap-x-4 text-muted-foreground">
                      {network && (
                        <div className="flex items-center gap-x-1">
                          <Globe strokeWidth={1} className="w-5 h-5" />
                          {network}
                        </div>
                      )}

                      {client && version && (
                        <div className="flex items-center gap-x-1">
                          <Cpu strokeWidth={1} className="w-5 h-5" />
                          {client} ({version})
                        </div>
                      )}

                      {protocol && (
                        <div className="flex items-center gap-x-1">
                          <Link2 strokeWidth={1} className="w-5 h-5" />
                          {protocol}
                        </div>
                      )}

                      {type && (
                        <div className="flex items-center gap-x-1">{type}</div>
                      )}
                    </div>
                  </div>

                  <div className="ml-5 shrink-0 text-muted-foreground">
                    <div className="flex space-x-1 text-sm">
                      <span>Created </span>
                      <span>{formatTimeDistance(createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          )
        )}
      </ul>
    </div>
  );
};
