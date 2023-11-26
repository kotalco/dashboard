import "server-only";
import qs from "query-string";
import { unstable_noStore as noStore } from "next/cache";

import { server } from "@/lib/server-instance";
import { PaymentCard } from "@/types";

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

export const getPaymentMethods = async () => {
  noStore();
  const qUrl = qs.stringifyUrl({
    url: "/payment-methods",
    query: { provider: "stripe" },
  });
  const { data } = await server.get<PaymentCard[]>(qUrl);
  const defaultCard = data?.find((card) => Boolean(card.default));

  const cardsOptions = data?.map(
    ({ id, brand, last4, exp_year, exp_month }) => ({
      id,
      image: paymentBrands[brand],
      label: `**** ${last4} - ${exp_month}/${exp_year}`,
      value: id,
    })
  );

  const cardsOptionsForStripe = data?.map(
    ({ provider_id, brand, last4, exp_year, exp_month }) => ({
      id: provider_id,
      image: paymentBrands[brand],
      label: `**** ${last4} - ${exp_month}/${exp_year}`,
      value: provider_id,
    })
  );

  return { cards: data, cardsOptions, cardsOptionsForStripe, defaultCard };
};
