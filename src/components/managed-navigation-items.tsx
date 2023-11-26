"use client";

import { NavigationItems } from "@/components/navigation-items";
import { useManagedNavigation } from "@/hooks/useManagedNavigation";

export const ManagedNavigationItems = () => {
  const { managed } = useManagedNavigation();

  return <NavigationItems items={managed} />;
};
