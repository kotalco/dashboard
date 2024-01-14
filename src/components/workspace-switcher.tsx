"use client";

import axios from "axios";
import { useEffect, useTransition } from "react";
import { useParams, usePathname } from "next/navigation";
import { Boxes, Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { WorksapcesList } from "@/types";
import { StorageItems } from "@/enums";
import { setCurrentWorkspace } from "@/actions/set-current-workspace";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface WorkspaceSwitcherProps extends PopoverTriggerProps {
  workspaces: WorksapcesList;
  userId: string;
}

export const WorkspaceSwitcher: React.FC<WorkspaceSwitcherProps> = ({
  className,
  workspaces,
  userId,
}) => {
  const [pending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  const currentWorkspace = workspaces.find(
    ({ id }) => id === params.workspaceId
  );

  useEffect(() => {
    async function setWorkspace() {
      await axios.post("/set-cookie", {
        name: StorageItems.LAST_WORKSPACE_ID,
        value: currentWorkspace?.id,
      });
    }

    setWorkspace();
  }, [currentWorkspace?.id]);

  const onWorkspaceSelect = (workspaceId: string) => {
    startTransition(() => {
      setCurrentWorkspace(workspaceId, pathname);
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          size="lg"
          aria-label="Select a wrokspace"
          className={cn("justify-between px-3 text-lg font-normal", className)}
        >
          <Boxes className="w-8 h-8 mr-3" />
          {currentWorkspace?.name}
          <span className="ml-1 text-sm font-light">
            ({currentWorkspace?.user_id === userId ? "Owner" : "Member"})
          </span>
          <ChevronsUpDown className="w-4 h-4 ml-auto opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandList>
            <CommandInput disabled={pending} placeholder="Search..." />
            <CommandEmpty>No Workspaces Found.</CommandEmpty>
            <CommandGroup>
              {workspaces.map((workspace) => (
                <CommandItem
                  disabled={pending}
                  key={workspace.id}
                  onSelect={() => onWorkspaceSelect(workspace.id)}
                  className="text-sm hover:cursor-pointer"
                >
                  {workspace.name} (
                  <span className="text-sm font-light">
                    {workspace.user_id === userId ? "Owner" : "Member"})
                  </span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4 text-primary",
                      currentWorkspace?.id === workspace.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
