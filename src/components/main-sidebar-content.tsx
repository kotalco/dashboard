"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Cog, LogOut, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMainNavigation } from "@/hooks/useMainNavigation";
import { cn } from "@/lib/utils";

export const MainSidebarContent = () => {
  const pathname = usePathname();
  const navigations = useMainNavigation();
  const [open, setOpen] = useState(() => pathname.includes("deployments"));

  return (
    <div className="px-2">
      <nav>
        <ul className="flex flex-col mt-5 overflow-y-auto gap-y-1">
          {navigations.map(({ title, href, active, Icon, items }) =>
            href ? (
              <li key={title}>
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
                    {title}
                  </Link>
                </Button>
              </li>
            ) : (
              <li key={title}>
                <Button
                  onClick={() => setOpen((state) => !state)}
                  variant="ghost"
                  className={cn(
                    `justify-start w-full text-muted-foreground`,
                    active ? "bg-accent text-accent-foreground" : ""
                  )}
                >
                  <Icon className="w-6 h-6 mr-3" />
                  {title}
                  <ChevronRight
                    className={cn(
                      `w-4 h-4 ml-auto transition-transform`,
                      open ? "rotate-90" : ""
                    )}
                  />
                </Button>
                {open && (
                  <ul className="">
                    {items?.map(({ title, href, active }) => (
                      <li key={title}>
                        <Button
                          asChild
                          variant="ghost"
                          className={cn(
                            `justify-start pl-14 w-full text-muted-foreground`,
                            active ? "text-primary" : ""
                          )}
                        >
                          <Link href={href}>{title}</Link>
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          )}
        </ul>
      </nav>

      <div>
        <div className="mt-3 mb-1 text-xs font-normal text-gray-500">
          Account
        </div>
        <Button
          asChild
          variant="ghost"
          className="justify-start w-full text-muted-foreground"
        >
          <Link href="/settings">
            <Cog className="w-6 h-6 mr-3" />
            Settings
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="justify-start w-full text-muted-foreground"
        >
          <Link href="/logout">
            <LogOut className="w-6 h-6 mr-3" />
            Logout
          </Link>
        </Button>
      </div>
    </div>
  );
};
