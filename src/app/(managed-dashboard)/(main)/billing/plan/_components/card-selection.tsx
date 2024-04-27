import Image from "next/image";
import { CreditCard } from "lucide-react";

import { getPaymentMethods } from "@/services/get-payment-methods";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import AddNewCardButton from "./add-new-card-button";

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

export const CardSelection = async () => {
  const { cards, defaultCard } = await getPaymentMethods();

  if (!cards.length) {
    return (
      <div className="flex flex-col items-center pb-6 text-center">
        <CreditCard className="w-12 h-12" />
        <h3 className="mt-5 text-sm font-semibold">
          There is no any payment cards added as yet!
        </h3>
        <p className="mt-2 text-xs font-normal leading-5 opacity-50">
          Add your card here to be able to create your subscription.
        </p>

        <AddNewCardButton>Add New Payment Card</AddNewCardButton>
      </div>
    );
  }

  return (
    <>
      <RadioGroup
        name="cardId"
        defaultValue={defaultCard?.provider_id}
        className="mb-2 space-y-2"
      >
        {cards.map(
          ({
            id,
            brand,
            exp_month,
            exp_year,
            last4,
            provider_id,
            default: defaultCard,
          }) => (
            <Label
              className="flex items-center p-6 transition-all border rounded-lg cursor-pointer"
              key={id}
            >
              <RadioGroupItem value={provider_id} />
              <div className="flex items-start justify-between ml-3 mr-4">
                <Image
                  alt={brand}
                  src={paymentBrands[brand]}
                  width={25}
                  height={18}
                />
              </div>
              <p className="text-sm font-semibold leading-5">
                <span className="align-sub">**** **** ****</span>
                {` `}
                <span>{last4}</span>
              </p>
              <p className="ml-auto text-xs font-normal leading-5 mr-7">
                {exp_month}/{exp_year}
              </p>
              {defaultCard ? (
                <Badge variant="secondary">Default</Badge>
              ) : (
                <div className="ml-16" />
              )}
            </Label>
          )
        )}
      </RadioGroup>
      <AddNewCardButton>Use Another Payment Card</AddNewCardButton>
    </>
  );
};
