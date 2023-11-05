import Image from "next/image";

import { PaymentCard } from "@/types";
import { Badge } from "@/components/ui/badge";

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

interface CardsListProps {
  cards: PaymentCard[];
}

export const CardsList: React.FC<CardsListProps> = ({ cards }) => {
  return (
    <div className="grid grid-cols-12 gap-4">
      {cards?.map(
        ({ id, exp_month, exp_year, last4, brand, default: defaultCard }) => (
          <div
            key={id}
            className="col-span-12 p-5 transition-all bg-white border shadow border-secondary space-y-7 lg:col-span-6 hover:border-primary 2xl:col-span-3 xl:col-span-4 rounded-xl"
          >
            <div className="flex items-start justify-between">
              <Image
                alt={brand}
                src={paymentBrands[brand]}
                width={44}
                height={44}
              />
              {defaultCard && <Badge variant="secondary" content="Default" />}
              {/* {!defaultCard && <CardMenu cardId={id} />} */}
            </div>

            <div className="flex justify-between">
              <p className="text-xl font-semibold leading-5">
                <span className="align-sub">**** **** ****</span>
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
  );
};
