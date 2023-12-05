import "server-only";

import { ClientVersions, Version } from "@/types";
import { delay } from "@/lib/utils";

interface Config {
  protocol: string;
  component: string;
  client?: string;
  network?: string;
}

export const getClientVersions = async (
  { protocol, component, client, network }: Config,
  image?: string
) => {
  await delay(3000);
  let versions: (Version & { disabled?: boolean })[] = [];

  const response = await fetch(
    "https://raw.githubusercontent.com/kotalco/images/master/releases.json",
    { method: "GET", next: { revalidate: 24 * 60 * 60 } }
  );
  const data = (await response.json()) as ClientVersions;
  const componentData = data.protocols[protocol].components[component];

  if (client) {
    versions =
      data.protocols[protocol].components[component].clients[client].versions;

    if (network) {
      versions = versions?.filter((version) => version.network === network);
    }
  }

  if (image) {
    versions = versions.map((version) => ({
      ...version,
      disabled: true,
    }));

    const selectedVersion = versions.find((version) => version.image === image);
    if (selectedVersion?.canBeDowngraded) {
      const previousIndex = versions.findIndex(
        (version) => version.name === selectedVersion.previous
      );

      versions[previousIndex].disabled = false;
    }

    if (selectedVersion?.canBeUpgraded) {
      const nextIndex = versions.findIndex(
        (version) => version.name === selectedVersion.next
      );

      versions[nextIndex].disabled = false;
    }
  }

  if (versions.length > 1) versions.reverse();

  return { versions, component: componentData };
};
