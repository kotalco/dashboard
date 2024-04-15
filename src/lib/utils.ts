import {
  eachDayOfInterval,
  endOfMonth,
  format,
  formatDistance,
  parseISO,
  startOfMonth,
} from "date-fns";

import { FormDataResult } from "@/actions/create-secret/types";
import {
  BeaconNodeClients,
  ExecutionClientClients,
  NodeStatuses,
  Roles,
} from "@/enums";
import { Clients, Plan } from "@/types";
import { AxiosResponse, isAxiosError } from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function responseInterceptor(response: AxiosResponse<{ data: any }>) {
  if (response.config.responseType === "arraybuffer") {
    return response;
  }
  response.data = response.data.data;

  return response;
}

export function getEnumKey<T extends Record<string, string>>(
  enumObj: T,
  value: string
): keyof T {
  return (
    (Object.keys(enumObj).find((key) => enumObj[key] === value) as keyof T) ||
    value
  );
}

export function getSelectItems<T extends Record<string, string>>(
  enumObj: T
): { label: keyof T; value: (typeof enumObj)[keyof typeof enumObj] }[] {
  return Object.keys(enumObj).map((key) => ({
    label: key,
    value: enumObj[key as keyof typeof enumObj],
  }));
}

// if ws base url is absolute path, convert it to full url
// exmaple: /api/v1 will be converted to ws://domain/api/v1
export const getWsBaseURL = function () {
  let url = process.env.NEXT_PUBLIC_WS_API_URL;

  if (url?.startsWith("/") && typeof window !== "undefined") {
    const tls = location.protocol.endsWith("s:");
    const domain = location.host;
    url = (tls ? "wss" : "ws") + "://" + domain + url;
  }

  return url;
};

export const getBaseURL = () => {
  return `${location.protocol}//${location.host}`;
};

export const getStatusColor = (value: NodeStatuses) => {
  switch (value) {
    case NodeStatuses["Container Creating"]:
    case NodeStatuses["Pod Initializing"]:
    case NodeStatuses.Terminating:
      return "#F59E0B";
    case NodeStatuses.Pending:
    case NodeStatuses["Loading Info"]:
      return "#6B7280";
    case NodeStatuses.Running:
      return "#10B981";
    default:
      return "#EF4444";
  }
};

export const getLatestVersion = (
  data: Clients,
  client?: string,
  network?: string
) => {
  let versions = client && data.clients[client].versions;

  if (network && versions) {
    versions = versions.filter((version) => version.network === network);
  }

  if (versions && versions.length > 1) {
    versions.reverse();
  }

  return versions && versions[0].image;
};

export const getClientUrl = (client: string) => {
  switch (client) {
    case ExecutionClientClients["Go Ethereum"]:
      return "https://github.com/ethereum/go-ethereum";
    case ExecutionClientClients["Hyperledger Besu"]:
      return "https://github.com/hyperledger/besu";
    case ExecutionClientClients.Nethermind:
      return "https://github.com/NethermindEth/nethermind";
    case BeaconNodeClients["ConsenSys Teku"]:
      return "https://github.com/ConsenSys/teku";
    case BeaconNodeClients["Prysatic Labs Prysm"]:
      return "https://github.com/prysmaticlabs/prysm";
    case BeaconNodeClients["Sigma Prime Lighthouse"]:
      return "https://github.com/sigp/lighthouse";
    case BeaconNodeClients["Status.im Nimbus"]:
      return "https://github.com/status-im/nimbus-eth2";
    default:
      return "#";
  }
};

export function formatCurrency(valueInCents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(valueInCents / 100);
}

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const dispatchLocalStorageUpdate = (
  key: string,
  value: string | null
) => {
  window.dispatchEvent(
    new CustomEvent("local-storage", {
      detail: { key, value },
    })
  );
};

export const readSelectWithInputValue = (id: string, formData: FormData) => {
  const selectValue = formData.get(`${id}-select`) as string;
  const inputValue = formData.get(`${id}-input`) as string;
  return selectValue !== "other" ? selectValue : inputValue;
};

export const readFieldArray = <T extends Record<string, any>>(
  fieldArray: { [key: string]: (keyof T)[] },
  formData: FormData
) => {
  const values: Record<string, T> = {};
  const prefix = Object.keys(fieldArray)[0];
  const fields = fieldArray[prefix].join("|");
  const regex = new RegExp(`^${prefix}\\.(\\d+)\\.(${fields})$`);

  for (const [key, value] of Array.from(formData.entries())) {
    const match = key.match(regex);

    if (match) {
      const [, index, field] = match;

      if (!values[index]) {
        values[index] = fieldArray[prefix].reduce((obj, fieldName) => {
          obj[fieldName] = "" as any;
          return obj;
        }, {} as T);
      }

      values[index][field as keyof T] = value as T[keyof T];
    }
  }

  return Object.values(values);
};

export const readFileData = (
  id: string,
  formData: FormData
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const file = formData.get(id) as File;
    if (!file) {
      reject("File not found");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        const fileData = e.target.result.split(",")[1];
        resolve(fileData);
      } else {
        reject("Failed to read file");
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};

export const readSecretsForm = async (
  formData: FormData
): Promise<FormDataResult> => {
  let result: FormDataResult;
  const entries = Array.from(formData.entries());

  // Extract keys that start with 'data.' and map them to their nested keys
  const dataKeys = Array.from(formData.keys())
    .filter((key) => key.startsWith("data."))
    .map((key) => key.substring(5)); // Remove 'data.' prefix

  // Initialize nestedData with empty strings for each key
  result = dataKeys.reduce((acc, key) => {
    acc[key] = "";
    return acc;
  }, {} as Record<string, string>);

  for (let [key, value] of entries) {
    // Process only keys that start with 'data.'
    if (key.startsWith("data.")) {
      const nestedKey = key.substring(5); // Remove 'data.' prefix

      if (value instanceof File) {
        try {
          const fileData = await readFileData(key, formData);
          assignValue(result, nestedKey, fileData);
        } catch (error) {
          logger("ReadingFile", error);
        }
      } else {
        assignValue(result, nestedKey, value);
      }
    }
  }

  return result;
};

const assignValue = (
  obj: Record<string, any>,
  key: string,
  value: string
): void => {
  if (key.includes(".")) {
    const parts = key.split(".");
    let current: any = obj;

    for (let i = 0; i < parts.length; i++) {
      if (i === parts.length - 1) {
        current[parts[i]] = value;
      } else {
        current[parts[i]] = current[parts[i]] || {};
        current = current[parts[i]];
      }
    }
  } else {
    obj[key] = value;
  }
};

export const logger = (tag: string, e: unknown) => {
  if (isAxiosError(e)) {
    let hasSensitiveData = false;
    if (e.config?.data) {
      hasSensitiveData =
        JSON.parse(e.config.data).hasOwnProperty("password") ||
        JSON.parse(e.config.data).hasOwnProperty("password_confirmation");
    }

    const error = JSON.stringify({
      tag,
      name: e.name,
      message: e.message,
      code: e.code,
      mehtod: e.config?.method,
      url: e.config?.url,
      payload: hasSensitiveData ? "sensitive_data" : e.config?.data,
      response: e.response?.data,
      status: e.status,
    });
    console.error(error);
    return;
  }

  if (e instanceof Error) {
    console.error({
      tag,
      name: e.name,
      messege: e.message,
    });
  }
};

export const getDaysOfCurrentMonth = () => {
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());

  return eachDayOfInterval({ start, end }).map((date) => date.getDate());
};

export const getAuthorizedTabs = (
  allTabs: {
    label: string;
    value: string;
    description?: string;
    role?: Roles;
  }[],
  currentRole: Roles
) => {
  return allTabs
    .filter(({ role }) => (role ? role === currentRole : true))
    .map(({ label, value, description }) => ({ label, value, description }));
};

export const formatDate = (date: string, formatTemp?: string) => {
  return format(parseISO(date), formatTemp || "MMMM do, yyyy");
};

export const formatTimeDistance = (createdAt: string) => {
  const date = new Date(createdAt);

  return formatDistance(date, new Date(), { addSuffix: true });
};

export const getResourcesValues = (formData: FormData) => {
  const [cpu, cpuLimit] = formData.getAll("cpu[]") as string[];
  const [memory, memoryLimit] = formData.getAll("memory[]") as string[];
  const storage = formData.get("storage") as string;

  return {
    cpu,
    cpuLimit,
    memory: `${memory}Gi`,
    memoryLimit: `${memoryLimit}Gi`,
    storage: `${storage}Gi`,
  };
};

export const getCheckboxValue = (formData: FormData, name: string) => {
  return formData.get(name) === "on";
};
