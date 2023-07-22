import "server-only";

import { cache } from "react";

import { server } from "@/lib/server-instance";
import { IPAddress, Settings } from "@/types";

const getIPAddress = cache(async () => {
  const { data } = await server.get<IPAddress>("/settings/ip-address");

  return data.ip_address;
});

const getDomainName = cache(async () => {
  const { data } = await server.get<Settings[]>("/settings");
  const domainName = data.find(({ key }) => key === "domain")?.value;

  return domainName;
});

export const getDomainInfo = async () => {
  const ipData = getIPAddress();
  const domianNameData = getDomainName();

  const [ip, domainName] = await Promise.all([ipData, domianNameData]);

  return { ip, name: domainName };
};
