import "server-only";

import { cache } from "react";

import { User } from "@/types";
import { server } from "@/lib/server-instance";
import { AxiosError, isAxiosError } from "axios";

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
