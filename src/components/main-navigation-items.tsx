"use client";

import { NavigationItems } from "@/components/navigation-items";
import { useMainNavigation } from "@/hooks/useMainNavigation";

export const MainNavigationItems = () => {
  const { main } = useMainNavigation();

  return <NavigationItems items={main} />;
};
