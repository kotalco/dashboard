"use server";

import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { cookies, headers } from "next/headers";

import { StorageItems } from "@/enums";

// if base url is absolute path, convert it to full url
// exmaple: /api/v1 will be converted to http://domain/api/v1
const getBaseURL = () => {
  let url = process.env.API_URL;

  if (url?.startsWith("/")) {
    const headersList = headers();
    const protocol = headersList.get("x-forwarded-proto");
    const domain = headersList.get("host");

    url = `${protocol}://${domain}${url}`;
  }

  return url;
};

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

export const server = axios.create();

server.interceptors.request.use((config) => {
  const key = getCacheKey(config);
  const now = Date.now();
  config.baseURL = getBaseURL();

  console.log("Base URL: ", config.baseURL);
  console.log("URL: ", config.url);

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
