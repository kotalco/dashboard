"use server";

import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { cookies } from "next/headers";

import { StorageItems } from "@/enums";

interface CustomAxiosResponse extends AxiosResponse {
  config: InternalAxiosRequestConfig & {
    fromCache?: boolean;
  };
}

interface CacheEntry {
  timestamp: number;
  response: AxiosResponse;
}

interface Cache {
  [key: string]: CacheEntry;
}

const responseCache: Cache = {};

const getCacheKey = (config: AxiosRequestConfig): string => {
  return `${config.method}:${config.url}`;
};

export const server = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

server.interceptors.request.use((config) => {
  console.log("URL: ", config.url);
  const key = getCacheKey(config);
  const now = Date.now();

  const token = cookies().get(StorageItems.AUTH_TOKEN);
  if (token?.value) config.headers.Authorization = `Bearer ${token.value}`;

  if (responseCache[key] && now - responseCache[key].timestamp < 2000) {
    return Promise.resolve({
      ...responseCache[key].response,
      ...config,
      fromCache: true,
    });
  }

  return config;
});

server.interceptors.response.use((response: CustomAxiosResponse) => {
  if (!response.config.fromCache) {
    const key = getCacheKey(response.config);
    responseCache[key] = {
      timestamp: Date.now(),
      response: response,
    };
  }

  if (response.config.responseType === "arraybuffer") {
    return response;
  }

  response.data = response.data.data;

  return response;
});
