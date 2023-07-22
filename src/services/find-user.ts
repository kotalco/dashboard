import "server-only";

import { cache } from "react";

import { User } from "@/types";
import { server } from "@/lib/server-instance";

export const findUser = cache(async () => {
  const { data } = await server.get<User>("/users/whoami");

  return data;
});
