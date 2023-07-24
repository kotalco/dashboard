import { AxiosError } from "axios";
import useSWR from "swr";

import { client } from "@/lib/client-instance";
import { Workspace } from "@/types";

export function useWorkspace(id: string) {
  const fetcher = async (url: string) => {
    const { data } = await client.get(url);
    return data;
  };

  const { data, ...rest } = useSWR<Workspace, AxiosError>(
    `/workspaces/${id}`,
    fetcher
  );

  return { workspace: data, ...rest };
}
