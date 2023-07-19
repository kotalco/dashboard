import axios from "axios";

import { StorageItems } from "@/enums";
import { responseInterceptor } from "@/lib/utils";

export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem(StorageItems.AUTH_TOKEN);
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

client.interceptors.response.use(responseInterceptor);
