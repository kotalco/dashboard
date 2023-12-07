"use client";

import { NavigationItems } from "@/components/navigation-items";
import { useManagedNavigation } from "@/hooks/useManagedNavigation";

interface ManagedNavigationItemsProps {
  endpointCount: number;
}

export const ManagedNavigationItems = ({
  endpointCount,
}: ManagedNavigationItemsProps) => {
  const { managed } = useManagedNavigation(endpointCount);

  return <NavigationItems items={managed} />;
};
