import { EditImageVersionForm } from "@/components/edit-image-version-form";

import { BitcoinNetworks, Roles } from "@/enums";
import { getEnumKey } from "@/lib/utils";
import { getClientVersions } from "@/services/get-client-versions";
import { BitcoinNode } from "@/types";

interface ProtocolTabProps {
  node: BitcoinNode;
  role: Roles;
}

export const ProtocolTab: React.FC<ProtocolTabProps> = async ({
  node,
  role,
}) => {
  const { network, image, name } = node;
  const { versions } = await getClientVersions(
    {
      protocol: "bitcoin",
      component: "node",
      client: "bitcoin-core",
    },
    node.image
  );
  return (
    <>
      <ul className="space-y-3">
        <li className="flex flex-col">
          <span className="text-sm font-medium text-foreground">Protocol</span>
          <span className="text-sm text-foreground/50">Bitcoin</span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm font-medium text-foreground">Network</span>
          <span className="text-sm text-foreground/50">
            {getEnumKey(BitcoinNetworks, network)}
          </span>
        </li>

        <li className="flex flex-col">
          <span className="text-sm font-medium text-foreground">Client</span>
          <a
            href="https://github.com/bitcoin/bitcoin"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            Bitcoin Core
          </a>
        </li>
      </ul>
      <EditImageVersionForm
        role={role}
        versions={versions}
        image={image}
        url={`/bitcoin/nodes/${name}`}
      />
    </>
  );
};
