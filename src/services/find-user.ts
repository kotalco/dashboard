import "server-only";

import { AxiosError, isAxiosError } from "axios";
import { unstable_cache as cache } from "next/cache";

import { User } from "@/types";
import { server } from "@/lib/server-instance";

type APIError = { message: string; status: number; name: string };

export const findUser = cache(async () => {
  let user: User | undefined;
  let error: AxiosError<APIError> | undefined;
  try {
    const { data } = await server.get<User>("/users/whoami");
    user = data;
  } catch (e) {
    if (isAxiosError(e)) {
      error = e;
    }
  }

  return { user, error };
});
