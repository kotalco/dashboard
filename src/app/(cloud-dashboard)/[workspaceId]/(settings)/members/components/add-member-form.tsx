"use client";

import { UserPlus } from "lucide-react";
import { useParams } from "next/navigation";

import { Roles } from "@/enums";
import { getSelectItems } from "@/lib/utils";
import { useAction } from "@/hooks/use-action";
import { addMember } from "@/actions/add-member";

import { Input } from "@/components/form/input";
import { Select } from "@/components/form/select";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitError } from "@/components/form/submit-error";
import { useRef } from "react";

export const AddMemberForm = () => {
  const { workspaceId } = useParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const { execute, success, error, fieldErrors } = useAction(addMember, {
    onSuccess: () => {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
  });

  const onSubmit = (formData: FormData) => {
    const email = formData.get("email") as string;
    const role = formData.get("role") as Roles;

    execute({ email, role }, { workspaceId: workspaceId as string });
  };

  return (
    <form
      data-testid="add-member-form"
      action={onSubmit}
      className="w-full space-y-6"
    >
      <div className="grid items-start grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-6 xl:col-span-4">
          <Input
            ref={inputRef}
            id="email"
            placeholder="Email Address"
            errors={fieldErrors}
          />
        </div>

        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <Select
            id="role"
            placeholder="Select a Role"
            options={getSelectItems(Roles)}
            errors={fieldErrors}
          />
        </div>

        <div className="col-span-12 md:col-span-6 lg:col-span-3 xl:col-span-2">
          <SubmitButton>
            <UserPlus className="w-6 h-6 mr-2" />
            Add Member
          </SubmitButton>
        </div>
      </div>

      <SubmitSuccess success={success}>
        New team memeber has been added to this workspace.
      </SubmitSuccess>

      <SubmitError error={error} />
    </form>
  );
};
