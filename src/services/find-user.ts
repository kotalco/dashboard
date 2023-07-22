import "server-only";

import { cache } from "react";

import { User } from "@/types";
import { server } from "@/lib/server-instance";

export const findUser = cache(async () => {
  const { data } = await server.get<User>("/users/whoami");

  return data;
});

// export const findUser = async () => {
//   const token = cookies().get(StorageItems.AUTH_TOKEN);
//   const URL = `${process.env.API_URL}/users/whoami`;
//   const res = await fetch(URL, {
//     next: { tags: ["user"] },
//     headers: { Authorization: `Bearer ${token?.value}` },
//   });

//   return res.json();
// };
