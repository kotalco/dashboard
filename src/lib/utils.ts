import { AxiosResponse } from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function responseInterceptor(response: AxiosResponse<{ data: any }>) {
  response.data = response.data.data;

  return response;
}
