import "server-only";

import { cache } from "react";
import qs from "query-string";

import { server } from "@/lib/server-instance";
import { Secret } from "@/types";
import { SecretType } from "@/enums";

export const getSecrets = cache(
  async (workspace_id: string, type?: SecretType) => {
    const url = qs.stringifyUrl({
      url: "/core/secrets",
      query: { workspace_id, type },
    });

    const { data } = await server.get<Secret[]>(url);
    const options = data.map(({ name }) => ({ label: name, value: name }));
    return { data, options };
  }
);
