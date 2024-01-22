import Link from "next/link";
import { Cpu, Globe } from "lucide-react";

import { MainNodeInfo } from "@/types";

import { Heading } from "@/components/ui/heading";
import { formatDate, formatTimeDistance } from "@/lib/utils";

interface DeployemntsListProps {
  data: MainNodeInfo[];
}

export const DeploymentsList: React.FC<DeployemntsListProps> = async ({
  data,
}) => {
  return (
    <div className="col-span-12">
      <ul className="overflow-hidden border rounded-md shadow-sm divide-y divide-muted">
        {data.map(({ name, network, client, url, createdAt, version }) => (
          <li key={name}>
            <Link href={url} className="block hover:bg-muted">
              <div className="flex items-end px-4 py-4 sm:px-6">
                <div className="flex-1 min-w-0 space-y-2">
                  <Heading variant="h3" title={name} />
                  <div className="flex text-sm gap-x-4 text-muted-foreground">
                    <div className="flex items-center gap-x-1">
                      <Globe strokeWidth={1} className="w-5 h-6" />
                      {network}
                    </div>
                    <div className="flex items-center gap-x-1">
                      <Cpu strokeWidth={1} className="w-5 h-6" />
                      {client} ({version})
                    </div>
                  </div>
                </div>

                <div className="ml-5 shrink-0 text-muted-foreground">
                  {/* <ChevronRight className="w-5 h-5" /> */}
                  <div className="flex space-x-1 text-sm">
                    <span>Created at</span>
                    <span className="font-medium">{formatDate(createdAt)}</span>
                    <span>({formatTimeDistance(createdAt)})</span>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
