import { AxiosResponse } from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function responseInterceptor(response: AxiosResponse<{ data: any }>) {
  if (response.config.responseType === "blob") {
    return response;
  }
  response.data = response.data.data;

  return response;
}

export function getEnumKey<T extends Record<string, string>>(
  enumObj: T,
  value: string
): keyof T {
  return Object.keys(enumObj).find((key) => enumObj[key] === value) as keyof T;
}

export function getSelectItems<T extends Record<string, string>>(
  enumObj: T
): { label: keyof T; value: (typeof enumObj)[keyof typeof enumObj] }[] {
  return Object.keys(enumObj).map((key) => ({
    label: key,
    value: enumObj[key as keyof typeof enumObj],
  }));
}
