"use client";

import { NavigationItems } from "@/components/navigation-items";
import { useManagedNavigation } from "@/hooks/useManagedNavigation";

export const ManagedSettingsNavigationItems = () => {
  const { settings } = useManagedNavigation();

  return <NavigationItems items={settings} />;
};
