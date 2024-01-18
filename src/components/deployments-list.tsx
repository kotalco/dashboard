import Link from "next/link";
import { ChevronRight, Cpu, Globe } from "lucide-react";

import { MainNodeInfo } from "@/types";

import { Heading } from "@/components/ui/heading";

interface DeployemntsListProps {
  data: MainNodeInfo[];
}

export const DeploymentsList: React.FC<DeployemntsListProps> = ({ data }) => {
  return (
    <div className="col-span-12">
      <ul className="overflow-hidden border max-w-sm rounded-md shadow-sm divide-y divide-muted">
        {data.map(({ name, network, client, url }) => (
          <li key={name}>
            <Link href={url} className="block hover:bg-muted">
              <div className="flex items-center px-4 py-4 sm:px-6">
                <div className="flex-1 min-w-0 space-y-2">
                  <Heading variant="h3" title={name} />
                  <div className="flex text-sm gap-x-4">
                    <div className="flex items-center gap-x-1">
                      <Globe
                        strokeWidth={1}
                        className="w-5 h-6 text-muted-foreground"
                      />
                      {network}
                    </div>
                    <div className="flex items-center gap-x-1">
                      <Cpu
                        strokeWidth={1}
                        className="w-5 h-6 text-muted-foreground"
                      />
                      {client}
                    </div>
                  </div>
                </div>

                <div className="ml-5 shrink-0">
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
