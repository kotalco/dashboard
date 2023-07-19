"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMainNavigation } from "@/hooks/useMainNavigation";
import { cn } from "@/lib/utils";

export const MainSidebarContent = () => {
  const pathname = usePathname();
  const navigations = useMainNavigation();
  const [open, setOpen] = useState(() => pathname.includes("deployments"));

  return (
    <div className="flex-1 px-2">
      <nav>
        <ul className="flex flex-col mt-5 overflow-y-auto gap-y-1">
          {navigations.map(({ title, label, href, active, Icon, items }) =>
            href ? (
              <li key={label}>
                {title && (
                  <div className="mt-3 mb-1 text-xs font-normal text-gray-500">
                    Account
                  </div>
                )}
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    `justify-start w-full text-muted-foreground`,
                    active ? "bg-accent text-accent-foreground" : ""
                  )}
                >
                  <Link href={href}>
                    <Icon className="w-6 h-6 mr-3" />
                    {label}
                  </Link>
                </Button>
              </li>
            ) : (
              <li key={label}>
                <Button
                  onClick={() => setOpen((state) => !state)}
                  variant="ghost"
                  className={cn(
                    `justify-start w-full text-muted-foreground`,
                    active ? "bg-accent text-accent-foreground" : ""
                  )}
                >
                  <Icon className="w-6 h-6 mr-3" />
                  {label}
                  <ChevronRight
                    className={cn(
                      `w-4 h-4 ml-auto transition-transform`,
                      open ? "rotate-90" : ""
                    )}
                  />
                </Button>
                <ul
                  className={cn(
                    "overflow-hidden transition-all",
                    open ? "max-h-full" : "max-h-0"
                  )}
                >
                  {items?.map(({ label, href, active }) => (
                    <li key={label}>
                      <Button
                        asChild
                        variant="ghost"
                        className={cn(
                          `justify-start pl-14 w-full text-muted-foreground`,
                          active ? "text-primary" : ""
                        )}
                      >
                        <Link href={href}>{label}</Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </li>
            )
          )}
        </ul>
      </nav>
    </div>
  );
};
