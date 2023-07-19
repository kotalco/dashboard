"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Boxes, Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { WorksapcesList, Workspace } from "@/types";
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
import { StorageItems } from "@/enums";

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
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

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

  const onWorkspaceSelect = (workspace: Omit<Workspace, "role">) => {
    setOpen(false);
    const segments = pathname.split("/");
    segments[1] = workspace.id;
    const route = segments.join("/");
    router.refresh();
    router.push(route);
  };

  return (
    <div className="px-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            size="lg"
            aria-expanded={open}
            aria-label="Select a wrokspace"
            className={cn(
              "justify-between px-3 text-lg font-normal",
              className
            )}
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
              <CommandInput placeholder="Search a Workspace" />
              <CommandEmpty>No Workspaces Found.</CommandEmpty>
              <CommandGroup>
                {workspaces.map((workspace) => (
                  <CommandItem
                    key={workspace.id}
                    onSelect={() => onWorkspaceSelect(workspace)}
                    className="text-sm"
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
    </div>
  );
};
