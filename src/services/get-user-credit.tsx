import "server-only";

import qs from "query-string";
import { unstable_noStore as noStore } from "next/cache";

import { server } from "@/lib/server-instance";
import { CreditBalance } from "@/types";

export const getUserCredit = async () => {
  noStore();
  const url = qs.stringifyUrl({
    url: "/invoice/credit-balance",
    query: { provider: "stripe" },
  });

  try {
    const { data } = await server.get<CreditBalance>(url);

    return { creditBalance: data };
  } catch (e) {
    return {
      message: "Something went wrong while getting your credit balance.",
    };
  }
};
