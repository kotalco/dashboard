import axios, { AxiosResponse } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  // Check for client side
  if (typeof window === "undefined") return config;

  // If there is an authorization token use it
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

api.interceptors.response.use(
  function (response: AxiosResponse<{ data: any }>) {
    response.data = response.data.data;

    return response;
  }
  // async function (error: AxiosError<APIError>) {
  //   if (
  //     error.response?.status === 403 &&
  //     error.response.data.name === "INVALID_SUBSCRIPTION"
  //   ) {
  //     await Router.replace("/activate-key");
  //   }
  //   return Promise.reject(error);
  // }
);
