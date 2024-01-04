import { EditImageVersionForm } from "@/components/edit-image-version-form";
import { Roles } from "@/enums";
import { IPFSPeer, Version } from "@/types";

interface ProtocolTabProps {
  node: IPFSPeer;
  role: Roles;
  versions: Version[];
}

export const ProtocolTab: React.FC<ProtocolTabProps> = ({
  node,
  role,
  versions,
}) => {
  const { image, name } = node;
  return (
    <>
      <ul className="space-y-3">
        <li>
          <span className="text-sm font-medium text-foreground">Protocol</span>
          <br />
          <span className="text-sm text-foreground/50">IPFS</span>
        </li>

        <li>
          <span className="text-sm font-medium text-foreground">Chain</span>
          <br />
          <span className="text-sm text-foreground/50">public-swarm</span>
        </li>

        <li>
          <span className="text-sm font-medium text-foreground">Client</span>
          <br />
          <a
            href="https://github.com/ipfs/kubo"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            Kubo
          </a>
        </li>
      </ul>
      <EditImageVersionForm
        role={role}
        versions={versions}
        image={image}
        url={`/ipfs/peers/${name}`}
      />
    </>
  );
};
