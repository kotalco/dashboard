import { IPFSClusterPeer } from "@/types";

import { Heading } from "@/components/ui/heading";

interface SecurityProps {
  node: IPFSClusterPeer;
}

export const Security = ({ node }: SecurityProps) => {
  return (
    <>
      <Heading variant="h2" title="Security" id="security" />
      <ul className="space-y-3">
        <li className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            Cluster Secret Name
          </span>
          <span className="text-sm text-foreground/50">
            {node.clusterSecretName}
          </span>
        </li>
      </ul>
    </>
  );
};
