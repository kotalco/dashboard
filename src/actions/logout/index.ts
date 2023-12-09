"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { StorageItems } from "@/enums";

export const logout = () => {
  cookies().delete(StorageItems.AUTH_TOKEN);
  redirect("/sign-in");
};
