"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export type TCommandActions = {
  groupTitle: string;
  actions: { title: string; url: string; Icon?: LucideIcon }[];
}[];

interface CommandActionsProps {
  commands: TCommandActions;
}

export const CommandActions = ({ commands }: CommandActionsProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleItemSelect = (url: string) => {
    router.push(url);
    setOpen((open) => !open);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command..." />
      <CommandList>
        <CommandEmpty>No Commands found</CommandEmpty>
        {commands.map(({ groupTitle, actions }, i) => (
          <Fragment key={groupTitle}>
            <CommandGroup heading={groupTitle}>
              {actions.map(({ title, url, Icon }) => (
                <CommandItem
                  key={title}
                  value={url}
                  onSelect={handleItemSelect}
                >
                  {Icon && <Icon strokeWidth={1} className="mr-2 h-4 w-4" />}
                  <span>{title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  );
};
