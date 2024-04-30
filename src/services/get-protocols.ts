import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import { server } from "@/lib/server-instance";
import { ProtocolsWithoutEthereum2 } from "@/enums";

export const getProtocols = async () => {
  noStore();
  const { data } = await server.get<
    Record<ProtocolsWithoutEthereum2, string[]>
  >("/protocols");

  return { protocols: data };
};
