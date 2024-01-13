"use client";

import { useParams } from "next/navigation";

import { useAction } from "@/hooks/use-action";
import { editRegister } from "@/actions/edit-register";

import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";
import { SubmitButton } from "@/components/form/submit-button";
import { Toggle } from "@/components/form/toggle";

interface RegistrationFormProps {
  isEnabled?: boolean;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  isEnabled,
}) => {
  const { workspaceId } = useParams();
  const { execute, success, error, fieldErrors } = useAction(editRegister);

  const onSubmit = (formData: FormData) => {
    const enable_registration = formData.get("enable_registration") === "on";

    execute({ enable_registration }, { workspaceId: workspaceId as string });
  };

  return (
    <form
      data-testid="registration-form"
      action={onSubmit}
      className="space-y-4"
    >
      <div className="p-4 border rounded-lg max-w-xl">
        <Toggle
          id="enable_registration"
          label="Enable Registration"
          description="If disabled, users will not be able to register their own accounts."
          defaultChecked={isEnabled}
          errors={fieldErrors}
          className="justify-between"
        />
      </div>

      <SubmitButton>Save</SubmitButton>

      <SubmitSuccess success={success}>
        Your registration settings have been saved successfuly
      </SubmitSuccess>

      <SubmitError error={error} />
    </form>
  );
};
