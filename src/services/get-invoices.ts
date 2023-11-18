import "server-only";

import qs from "query-string";
import { unstable_noStore as noStore } from "next/cache";

import { server } from "@/lib/server-instance";
import { Invoice } from "@/types";

export const getInvoices = async (limit: number) => {
  noStore();
  const url = qs.stringifyUrl({
    url: `/invoice`,
    query: { page: 0, limit },
  });

  const { data } = await server.get<Invoice[]>(url);
  return { invoices: data };
};
