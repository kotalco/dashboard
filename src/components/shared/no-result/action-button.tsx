import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Roles } from "@/enums";
import { getWorkspace } from "@/services/get-workspace";
import { Plus } from "lucide-react";
import Link from "next/link";

interface ActionButtonProps {
  workspaceId: string;
  createUrl: string;
  text: string;
}

export const ActionButton = async ({
  workspaceId,
  createUrl,
  text,
}: ActionButtonProps) => {
  const { role } = await getWorkspace(workspaceId);

  if (role === Roles.Reader) {
    return (
      <CardContent>
        You do not have authorization to perform actions. Please contact your
        admin for more information.
      </CardContent>
    );
  }

  return (
    <CardFooter>
      <Button size="lg" asChild>
        <Link href={createUrl}>
          <Plus className="w-4 h-4 mr-2" />
          {text}
        </Link>
      </Button>
    </CardFooter>
  );
};
