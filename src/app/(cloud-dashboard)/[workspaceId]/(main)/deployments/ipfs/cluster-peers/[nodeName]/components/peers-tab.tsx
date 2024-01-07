"use client";

import { useParams } from "next/navigation";

import { IPFSClusterPeer, IPFSPeer } from "@/types";
import { Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editPeers } from "@/actions/edit-cluster-peer";

import { SelectWithInput } from "@/components/form/select-with-input";
import { MultiSelect } from "@/components/form/multi-select";
import { Label } from "@/components/ui/label";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";
import { readSelectWithInputValue } from "@/lib/utils";

interface PeersTabProps {
  node: IPFSClusterPeer;
  role: Roles;
  peers: IPFSPeer[];
  clusterPeers: IPFSClusterPeer[];
}

export const PeersTab: React.FC<PeersTabProps> = ({
  node,
  role,
  peers,
  clusterPeers,
}) => {
  const { peerEndpoint, bootstrapPeers, trustedPeers, name } = node;
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error, success } = useAction(editPeers);

  const peerEndpoints = peers.map(({ name }) => ({
    label: name,
    value: `/dns4/${name}/tcp/5001`,
  }));

  const ipfsClusterPeers = clusterPeers.map(({ name, id }) => ({
    label: name,
    value: `/dns4/${name}/tcp/9096/p2p/${id}`,
  }));

  const onSubmit = (formData: FormData) => {
    const peerEndpoint = readSelectWithInputValue("peerEndpoint", formData);
    const bootstrapPeers = formData.getAll("bootstrapPeers") as string[];
    execute(
      { peerEndpoint, bootstrapPeers },
      { name, workspaceId: workspaceId as string }
    );
  };

  return (
    <form action={onSubmit} className="relative space-y-8">
      <SelectWithInput
        id="peerEndpoint"
        label="IPFS Peer"
        placeholder="Select a Peer"
        options={peerEndpoints}
        otherLabel="Use External Peer"
        className="max-w-xs"
        errors={fieldErrors}
        disabled={role === Roles.Reader}
        defaultValue={peerEndpoint}
      />

      <MultiSelect
        id="bootstrapPeers"
        label="Bootstrap Cluster Peers"
        placeholder="Select bootstrap peers"
        options={ipfsClusterPeers}
        allowCustomValues
        className="max-w-xs"
        errors={fieldErrors}
        disabled={role === Roles.Reader}
        defaultValue={bootstrapPeers}
      />

      {!!trustedPeers && (
        <div className="max-w-xs mt-4">
          <Label>Trusted Cluster Peers</Label>
          <ul className="ml-5 text-sm">
            {trustedPeers.map((peer) => (
              <li key={peer} className="text-foreground/50 list-disc">
                {peer}
              </li>
            ))}
          </ul>
        </div>
      )}

      <SubmitSuccess success={success}>
        Peers settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Save</SubmitButton>}
    </form>
  );
};
