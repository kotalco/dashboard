import { IPFSClusterPeer } from "@/types";

interface SecurityTabProps {
  node: IPFSClusterPeer;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({ node }) => {
  return (
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
  );
};
