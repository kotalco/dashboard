import { EditImageVersionForm } from "@/components/edit-image-version-form";
import { ExternalLink } from "@/components/ui/external-link";
import { Skeleton } from "@/components/ui/skeleton";
import { AptosNetworks, Roles } from "@/enums";
import { getEnumKey } from "@/lib/utils";
import { getClientVersions } from "@/services/get-client-versions";
import { AptosNode } from "@/types";

interface ProtocolTabProps {
  node: AptosNode;
  role: Roles;
}

export const ProtocolTab = async ({ node, role }: ProtocolTabProps) => {
  const { network, image, name } = node;

  const { versions } = await getClientVersions(
    {
      protocol: "aptos",
      component: "node",
      client: "aptos-core",
      network,
    },
    image
  );

  return (
    <>
      <ul className="space-y-4">
        <li className="flex flex-col">
          <span className="font-semibold text-neutral-700 leading-none">
            Protocol
          </span>
          <span className="text-foreground/50">Aptos</span>
        </li>

        <li className="flex flex-col">
          <span className="font-semibold text-neutral-700 leading-none">
            Network
          </span>
          <span className="text-foreground/50">
            {getEnumKey(AptosNetworks, network)}
          </span>
        </li>

        <li className="flex flex-col">
          <span className="font-semibold text-neutral-700 leading-none">
            Client
          </span>
          <ExternalLink href="https://github.com/aptos-labs/aptos-core">
            aptos-core
          </ExternalLink>
        </li>
      </ul>

      <EditImageVersionForm
        role={role}
        versions={versions}
        image={image}
        url={`/aptos/nodes/${name}`}
      />
    </>
  );
};

ProtocolTab.Skeleton = function SekeletonProtocl() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-10" />
      </div>

      <div className="space-y-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-10" />
      </div>

      <div className="space-y-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-10" />
      </div>

      <div className="space-y-1">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-5 w-80" />
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-5 w-12" />
      </div>
    </div>
  );
};
