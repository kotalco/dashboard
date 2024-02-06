import { BitcoinNode, StacksNode } from "@/types";
import { Roles } from "@/enums";

import { Select } from "@/components/form/select";
import { Heading } from "@/components/ui/heading";

interface BitcoinProps {
  node: StacksNode;
  bitcoinNodes: BitcoinNode[];
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const Bitcoin = ({ node, role, bitcoinNodes, errors }: BitcoinProps) => {
  const { bitcoinNode } = node;

  const nodes = bitcoinNodes
    .filter(({ rpc }) => rpc)
    .map((node) => ({ label: node.name, value: JSON.stringify(node) }));

  const defaultNode = JSON.stringify(
    bitcoinNodes.find(({ name }) => bitcoinNode.endpoint === name)
  );

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Bitcoin" />
      <Select
        id="bitcoinNode"
        label="Bitcoin Node"
        placeholder="Select a Node"
        options={nodes}
        errors={errors}
        description="Bitcoin nodes with JSON-RPC server enabled"
        disabled={role === Roles.Reader}
        defaultValue={defaultNode}
        className="max-w-xs"
      />
    </div>
  );
};
