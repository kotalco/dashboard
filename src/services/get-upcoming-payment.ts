import "server-only";

import qs from "query-string";

import { server } from "@/lib/server-instance";
import { Invoice } from "@/types";
import { unstable_noStore as noStore } from "next/cache";
import { isAxiosError } from "axios";

export const getUpcomingInvoice = async (subscription_id: string) => {
  noStore();
  const url = qs.stringifyUrl({
    url: `/invoice/upcoming/${subscription_id}`,
    query: { provider: "stripe" },
  });

  try {
    const { data } = await server.get<Invoice>(url);

    return { invoice: data };
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 404) {
      return { invoice: null, message: null };
    }

    return {
      invoice: null,
      message: "Something went wrong while getting your next payment date.",
    };
  }
};
