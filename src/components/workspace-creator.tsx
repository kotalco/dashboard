"use client";

import { Button } from "@/components/ui/button";
import { useWorkspaceModal } from "@/hooks/useWorkspaceModal";

export const WorkspaceCreator = () => {
  const { onOpen } = useWorkspaceModal();

  return (
    <Button
      onClick={onOpen}
      variant="outline"
      className="w-full h-14 rounded-md px-3 text-lg font-normal"
    >
      Create New Workspace
    </Button>
  );
};
