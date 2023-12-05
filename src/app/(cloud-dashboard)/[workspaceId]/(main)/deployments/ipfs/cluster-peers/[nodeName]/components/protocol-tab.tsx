import { EditImageVersionForm } from "@/components/edit-image-version-form";
import { ConsensusAlgorithm, Roles } from "@/enums";
import { getEnumKey } from "@/lib/utils";
import { IPFSClusterPeer, Version } from "@/types";

interface ProtocolTabProps {
  node: IPFSClusterPeer;
  role: Roles;
  versions: Version[];
}

export const ProtocolTab: React.FC<ProtocolTabProps> = ({
  node,
  role,
  versions,
}) => {
  const { image, name, consensus, id, privatekeySecretName } = node;
  return (
    <>
      <ul className="space-y-3">
        <li className="flex flex-col">
          <span className="text-sm font-medium text-foreground">Protocol</span>
          <span className="text-sm text-foreground/50">IPFS</span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm font-medium text-foreground">Chain</span>
          <span className="text-sm text-foreground/50">public-swarm</span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm font-medium text-foreground">Client</span>
          <a
            href="https://github.com/ipfs/ipfs-cluster"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            ipfs-cluster-service
          </a>
        </li>

        <li className="flex flex-col">
          <span className="text-sm font-medium text-foreground">Consensus</span>
          <span className="text-sm text-foreground/50">
            {getEnumKey(ConsensusAlgorithm, consensus)}
          </span>
        </li>

        {id && (
          <li className="flex flex-col">
            <span className="text-sm font-medium text-foreground">ID</span>
            <span className="text-sm text-foreground/50">{id}</span>
          </li>
        )}

        {privatekeySecretName && (
          <li className="flex flex-col">
            <span className="text-sm font-medium text-foreground">From</span>
            <span className="text-sm text-foreground/50">
              {privatekeySecretName}
            </span>
          </li>
        )}
      </ul>
      <EditImageVersionForm
        role={role}
        versions={versions}
        image={image}
        url={`/ipfs/clusterpeers/${name}`}
      />
    </>
  );
};
