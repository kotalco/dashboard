"use client";

import { usePathname, useSearchParams } from "next/navigation";

import Link from "next/link";

const INVOICES_LIMIT = 3;

export const LoadMoreInvoicesButton = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLimit = Number(searchParams.get("limit")) || INVOICES_LIMIT;

  const createPageURL = (limit: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", limit.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <Link
      className="text-sm text-primary hover:underline underline-offset-2"
      href={createPageURL(currentLimit + INVOICES_LIMIT)}
      scroll={false}
      replace
    >
      Load More
    </Link>
  );
};
