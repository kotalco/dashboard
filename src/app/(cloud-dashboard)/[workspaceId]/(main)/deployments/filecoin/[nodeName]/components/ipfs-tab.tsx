"use client";

import { useParams } from "next/navigation";

import { FilecoinNode, IPFSPeer } from "@/types";
import { Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editIPFS } from "@/actions/edit-filecoin";
import { readSelectWithInputValue } from "@/lib/utils";

import { SelectWithInput } from "@/components/form/select-with-input";
import { Toggle } from "@/components/form/toggle";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitButton } from "@/components/form/submit-button";

interface IPFSTabProps {
  node: FilecoinNode;
  role: Roles;
  peers: IPFSPeer[];
}

export const IPFSTab: React.FC<IPFSTabProps> = ({ node, role, peers }) => {
  const { ipfsForRetrieval, ipfsOnlineMode, ipfsPeerEndpoint, name } = node;
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error, success } = useAction(editIPFS);

  const peersOptions = peers.map(({ name }) => ({
    label: name,
    value: `/dns4/${name}/tcp/5001`,
  }));

  const onSubmit = (formData: FormData) => {
    const ipfsForRetrieval = formData.get("ipfsForRetrieval") === "on";
    const ipfsOnlineMode = formData.get("ipfsOnlineMode") === "on";
    const ipfsPeerEndpoint = readSelectWithInputValue(
      "ipfsPeerEndpoint",
      formData
    );
    execute(
      {
        ipfsForRetrieval,
        ipfsOnlineMode,
        ipfsPeerEndpoint,
      },
      { name, workspaceId: workspaceId as string }
    );
  };

  return (
    <form action={onSubmit} className="relative space-y-8">
      <div className="px-3 py-2 rounded-lg border max-w-xs flex">
        <Toggle
          id="ipfsForRetrieval"
          label="Use IPFS For Retrieval"
          defaultChecked={ipfsForRetrieval}
          disabled={role === Roles.Reader}
          errors={fieldErrors}
          className="justify-between"
        />
      </div>

      <div className="px-3 py-2 rounded-lg border max-w-xs flex">
        <Toggle
          id="ipfsOnlineMode"
          label="IPFS Online Mode"
          defaultChecked={ipfsOnlineMode}
          disabled={role === Roles.Reader}
          errors={fieldErrors}
          className="justify-between"
        />
      </div>

      <SelectWithInput
        id="ipfsPeerEndpoint"
        label="IPFS Peer Endpoint"
        disabled={role === Roles.Reader}
        defaultValue={ipfsPeerEndpoint}
        options={peersOptions}
        otherLabel="Use External Peer"
        errors={fieldErrors}
        placeholder="Select a peer"
        allowClear
        className="max-w-xs"
      />

      <SubmitSuccess success={success}>
        IPFS settings have been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && <SubmitButton>Save</SubmitButton>}
    </form>
  );
};
