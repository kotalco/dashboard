"use client";

import { NavigationItems } from "@/components/navigation-items";
import { useMainNavigation } from "@/hooks/useNavigation";

export const SettingsNavigationItems = () => {
  const { settings } = useMainNavigation();

  return <NavigationItems items={settings} />;
};
