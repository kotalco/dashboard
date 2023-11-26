import "server-only";

import { cache } from "react";

import { server } from "@/lib/server-instance";
import { ProtocolsWithoutEthereum2 } from "@/enums";

export const getProtocols = cache(async () => {
  const { data } = await server.get<
    Record<ProtocolsWithoutEthereum2, string[]>
  >("/protocols");

  return { protocols: data };
});
