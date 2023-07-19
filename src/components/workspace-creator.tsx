"use client";

import { Button } from "@/components/ui/button";
import { useWorkspaceModal } from "@/hooks/useWorkspaceModal";

export const WorkspaceCreator = () => {
  const { onOpen } = useWorkspaceModal();

  return (
    <Button onClick={onOpen} variant="outline" size="xl" className="w-full">
      Create New Workspace
    </Button>
  );
};
