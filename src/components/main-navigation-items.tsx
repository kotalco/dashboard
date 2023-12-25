"use client";

import { NavigationItems } from "@/components/navigation-items";
import { useMainNavigation } from "@/hooks/useNavigation";
import { LogoutForm } from "@/components/ui/logout-form";

interface MainNavigationItemsProps {
  counts: Record<string, number>;
}

export const MainNavigationItems = ({ counts }: MainNavigationItemsProps) => {
  const { main } = useMainNavigation(counts);

  return (
    <NavigationItems items={main}>
      <li>
        <LogoutForm />
      </li>
    </NavigationItems>
  );
};
