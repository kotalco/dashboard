import "server-only";

import { server } from "@/lib/server-instance";
import { IPAddress, Settings } from "@/types";

const getIPAddress = async () => {
  const { data } = await server.get<IPAddress>("/settings/ip-address");

  return data.ip_address;
};

export const getSettings = async () => {
  const { data } = await server.get<Settings[]>("/settings");
  const domainName = data.find(({ key }) => key === "domain")?.value;
  const registration = data.find(
    ({ key }) => key === "registration_is_enabled"
  )?.value;
  const activationKey = data.find(({ key }) => key === "activation_key")?.value;

  return { domainName, registration, activationKey };
};

export const getDomainInfo = async () => {
  const ipData = getIPAddress();
  const settingsData = getSettings();

  const [ip, settings] = await Promise.all([ipData, settingsData]);

  return { ip, name: settings.domainName };
};
