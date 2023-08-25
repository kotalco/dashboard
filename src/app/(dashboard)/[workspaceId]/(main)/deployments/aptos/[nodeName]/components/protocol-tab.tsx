import { AptosNetworks, Roles } from "@/enums";
import { getEnumKey } from "@/lib/utils";
import { AptosNode } from "@/types";

interface ProtocolTabProps {
  node: AptosNode;
  role: Roles;
}

export const ProtocolTab: React.FC<ProtocolTabProps> = ({ node }) => {
  const { network } = node;
  return (
    <ul className="space-y-3">
      <li className="flex flex-col">
        <span className="text-sm font-medium text-foreground">Protocol</span>
        <span className="text-sm text-foreground/50">Aptos</span>
      </li>

      <li className="flex flex-col">
        <span className="text-sm font-medium text-foreground">Network</span>
        <span className="text-sm text-foreground/50">
          {getEnumKey(AptosNetworks, network)}
        </span>
      </li>

      <li className="flex flex-col">
        <span className="text-sm font-medium text-foreground">Client</span>
        <a
          href="https://github.com/aptos-labs/aptos-core"
          target="_blank"
          rel="noreferrer"
          className="text-primary hover:underline"
        >
          aptos-core
        </a>
      </li>
    </ul>
  );
};
