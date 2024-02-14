import { Suspense } from "react";

import { Heading } from "@/components/ui/heading";

import { CardListSkeleton, CardsList } from "./_components/cards-list";

export default async function PaymentMethodsPage() {
  return (
    <div className="grid grid-cols-12 items-center gap-8 pr-10">
      <div className="col-span-12 md:col-span-7 lg:col-span-8 xl:col-span-9">
        <Heading title="My Cards" />
      </div>

      <Suspense fallback={<CardListSkeleton />}>
        <CardsList />
      </Suspense>
    </div>
  );
}
