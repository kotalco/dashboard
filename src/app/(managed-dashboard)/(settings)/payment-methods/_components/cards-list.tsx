import Image from "next/image";
import { Suspense } from "react";
import { CreditCard } from "lucide-react";

import { getPaymentMethods } from "@/services/get-payment-methods";
import { cn } from "@/lib/utils";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { SetDefaultCard } from "./set-default-card";
import { DeleteCard } from "./delete-card";
import { AddPaymentCard } from "./add-payment-card";

export const paymentBrands = {
  visa: "/images/visa.svg",
  amex: "/images/amex.svg",
  diners: "/images/diners-club.svg",
  discover: "/images/discover.svg",
  jcb: "/images/jcb.png",
  mastercard: "/images/master-card.svg",
  unionppay: "/images/unionpay.svg",
  unknown: "/images/unkown-card.png",
};

export const CardsList = async () => {
  const { cards } = await getPaymentMethods();

  if (!cards.length) {
    return (
      <Card className="flex flex-col items-center text-center shadow-none border-0 col-span-12">
        <CardHeader className="flex flex-col items-center">
          <CreditCard strokeWidth={1} className="w-16 h-16" />
          <CardTitle>No cards has been added yet.</CardTitle>
          <CardDescription>
            Your default card will be billed at the beginning of every month.
          </CardDescription>
        </CardHeader>
        <Suspense fallback={<Skeleton className="h-11 w-[200px] mb-6" />}>
          <AddPaymentCard />
        </Suspense>
      </Card>
    );
  }

  return (
    <>
      <div className="col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3 justify-self-end">
        <Suspense fallback={<Skeleton className="w-full h-11" />}>
          <AddPaymentCard />
        </Suspense>
      </div>

      <div className="col-span-12 grid grid-cols-12 gap-4">
        {cards?.map(
          ({ id, exp_month, exp_year, last4, brand, default: defaultCard }) => (
            <div
              key={id}
              className={cn(
                "col-span-12 p-4 group relative transition-all border shadow border-secondary space-y-10 lg:col-span-6 xl:col-span-4 rounded-xl",
                defaultCard && "border-primary"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Image
                    alt={brand}
                    src={paymentBrands[brand]}
                    width={44}
                    height={44}
                  />
                  {defaultCard && (
                    <Badge className="absolute top-2 right-2">Default</Badge>
                  )}
                </div>
                <div className="flex space-x-2 absolute right-2 top-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <SetDefaultCard id={id} isDefault={defaultCard} />
                  <DeleteCard id={id} />
                </div>
              </div>

              <div className="flex justify-between">
                <p className="text-xl font-semibold leading-5">
                  <span className="align-sub">****</span>
                  {` `}
                  <span>{last4}</span>
                </p>
                <p className="text-xs font-normal leading-5">
                  {exp_month}/{exp_year}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};

export const CardListSkeleton = () => {
  return (
    <div className="col-span-12 grid grid-cols-12 gap-4">
      {Array.from({ length: 3 }, (_, i) => i).map((i) => (
        <Skeleton
          className="col-span-12 h-36 lg:col-span-6 xl:col-span-4 rounded-xl"
          key={i}
        />
      ))}
    </div>
  );
};
