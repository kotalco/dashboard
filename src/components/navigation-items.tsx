import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SidebarNavItem } from "@/types";

interface NavigationItemsProps {
  items: SidebarNavItem[];
}

export const NavigationItems: React.FC<NavigationItemsProps> = ({ items }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(() => pathname.includes("deployments"));

  return (
    <>
      {items.map(
        ({ title, label, href, active, Icon, prefetch, items }, index) =>
          href ? (
            <li key={index}>
              {title && (
                <div className="mt-3 mb-1 text-xs font-normal text-gray-500">
                  Account
                </div>
              )}
              <Button
                asChild
                variant="ghost"
                className={cn(
                  `justify-start text-muted-foreground`,
                  active ? "bg-accent text-accent-foreground" : "",
                  label ? "w-full" : ""
                )}
              >
                <Link href={href} prefetch={prefetch}>
                  <Icon className={cn(`w-6 h-6`, label ? "mr-3" : "")} />
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
                  "overflow-y-auto transition-all",
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
                        active ? "text-primary hover:text-primary" : ""
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
    </>
  );
};
