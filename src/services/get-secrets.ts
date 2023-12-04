import "server-only";

import qs from "query-string";
import { unstable_noStore as noStore } from "next/cache";

import { server } from "@/lib/server-instance";
import { Secret } from "@/types";
import { SecretType } from "@/enums";

export const getSecrets = async (workspace_id: string, type?: SecretType) => {
  noStore();
  const url = qs.stringifyUrl({
    url: "/core/secrets",
    query: { workspace_id, type },
  });

  const { data } = await server.get<Secret[]>(url);
  const options = data.map(({ name }) => ({ label: name, value: name }));
  return { data, options };
};
