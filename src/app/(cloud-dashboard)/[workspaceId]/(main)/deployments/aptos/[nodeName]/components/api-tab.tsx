"use client";

import { useParams } from "next/navigation";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { TabsFooter } from "@/components/ui/tabs";
import { Toggle } from "@/components/form/toggle";
import { SubmitButton } from "@/components/form/submit-button";

import { AptosNode } from "@/types";
import { Roles } from "@/enums";
import { useAction } from "@/hooks/use-action";
import { editAptosNode } from "@/actions/edit-aptos";

interface APITabProps {
  node: AptosNode;
  role: Roles;
}

export const APITab: React.FC<APITabProps> = ({ node, role }) => {
  const { workspaceId } = useParams();
  const { execute, fieldErrors, error, data } = useAction(editAptosNode);
  const { api, name } = node;

  const onSubmit = (formData: FormData) => {
    const api = formData.get("api") === "on";
    execute({ api }, { name, workspaceId: workspaceId as string });
  };

  return (
    <form action={onSubmit} className="relative space-y-4">
      <Toggle
        id="api"
        label="REST"
        disabled={role === Roles.Reader}
        errors={fieldErrors}
        defaultChecked={api}
      />

      {!!data && (
        <Alert variant="success" className="text-center">
          <AlertDescription>
            API settings have been updated successfully.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="text-center">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {role !== Roles.Reader && (
        <TabsFooter>
          <SubmitButton data-testid="submit" type="submit">
            Save
          </SubmitButton>
        </TabsFooter>
      )}
    </form>
  );
};
