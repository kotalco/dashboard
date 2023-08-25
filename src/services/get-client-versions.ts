import "server-only";

import { ClientVersions } from "@/types";

interface Config {
  protocol: string;
  node: string;
  client?: string;
  network?: string;
}

export const getClientVersions = async (
  { protocol, node, client, network }: Config,
  image?: string
) => {
  let versions;
  let versionOptions;

  const response = await fetch(
    "https://raw.githubusercontent.com/kotalco/images/master/releases.json",
    { method: "GET", next: { revalidate: 24 * 60 * 60 } }
  );
  const data = (await response.json()) as ClientVersions;

  if (client) {
    versions =
      data.protocols[protocol].components[node].clients[client].versions;

    if (network) {
      versions = versions?.filter((version) => version.network === network);
    }

    versionOptions = versions?.map(({ name, image }) => ({
      label: name,
      value: image,
    }));
  }

  if (image && versions && versionOptions) {
    versionOptions = versionOptions.map((version) => ({
      ...version,
      disabled: true,
    }));

    const selectedVersion = versions.find((version) => version.image === image);
    if (selectedVersion?.canBeDowngraded) {
      const previousIndex = versions.findIndex(
        (version) => version.name === selectedVersion.previous
      );

      if (typeof previousIndex === "number")
        versionOptions[previousIndex].disabled = false;
    }

    if (selectedVersion?.canBeUpgraded) {
      const nextIndex = versions.findIndex(
        (version) => version.name === selectedVersion.next
      );
      if (typeof nextIndex === "number")
        versionOptions[nextIndex].disabled = false;
    }
  }

  versionOptions?.reverse();
  const defaultValue = versionOptions?.[0].value;

  return { versions, versionOptions, defaultValue };
};
