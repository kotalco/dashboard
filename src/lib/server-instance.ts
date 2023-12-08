"use server";

import axios from "axios";
import { cookies } from "next/headers";

import { StorageItems } from "@/enums";
import { responseInterceptor } from "@/lib/utils";

export const server = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

server.interceptors.request.use((config) => {
  const token = cookies().get(StorageItems.AUTH_TOKEN);
  console.log(config.url);
  if (token?.value) config.headers.Authorization = `Bearer ${token.value}`;

  return config;
});

server.interceptors.response.use(responseInterceptor);
