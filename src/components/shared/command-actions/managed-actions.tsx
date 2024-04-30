"use client";

import { Link, Lock, User2, CreditCard, Zap } from "lucide-react";

import { CommandActions, TCommandActions } from "./command-actions";

export const getManagedActions: () => TCommandActions = () => [
  {
    groupTitle: "Endpoints",
    actions: [
      {
        title: "Endpoints",
        url: `/virtual-endpoints`,
        Icon: Link,
      },
    ],
  },
  {
    groupTitle: "Billing",
    actions: [
      {
        title: "My Plan",
        url: `/billing/plan`,
        Icon: Zap,
      },
    ],
  },
  {
    groupTitle: "Settings",
    actions: [
      {
        title: "Account",
        url: `/account`,
        Icon: User2,
      },
      {
        title: "Security",
        url: `/account-security`,
        Icon: Lock,
      },
      {
        title: "Cards",
        url: `/payment-methods`,
        Icon: CreditCard,
      },
    ],
  },
];

export const ManagedActions = () => {
  const commands = getManagedActions();

  return <CommandActions commands={commands} />;
};
