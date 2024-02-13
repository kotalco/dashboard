import { Heading } from "@/components/ui/heading";
import { getPaymentMethods } from "@/services/get-payment-methods";
import { CreditCard } from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardsList } from "./_components/cards-list";
import { AddPaymentCard } from "./_components/add-payment-card";

export default async function PaymentMethodsPage() {
  const { cards } = await getPaymentMethods();

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <Heading title="My Cards" />

          {!!cards.length && <AddPaymentCard />}
        </div>

        <CardsList cards={cards} />
        {!cards.length && (
          <Card className="flex flex-col items-center text-center">
            <CardHeader className="flex flex-col items-center">
              <CreditCard className="w-16 h-16" />
              <CardTitle>There is no any payment cards added yet!</CardTitle>
              <CardDescription>
                Add your card here to be able to create your subscription.
              </CardDescription>
            </CardHeader>

            <CardFooter>
              <AddPaymentCard />
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
