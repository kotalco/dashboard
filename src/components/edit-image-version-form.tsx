"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink } from "@/components/ui/external-link";

import { Select } from "@/components/form/select";
import { SubmitButton } from "@/components/form/submit-button";
import { SubmitError } from "@/components/form/submit-error";
import { SubmitSuccess } from "@/components/form/submit-success";

import { Roles } from "@/enums";
import { Version } from "@/types";
import { useAction } from "@/hooks/use-action";
import { editImageVersion } from "@/actions/edit-image-version";

interface EditImageVersionFormProps {
  role: Roles;
  versions: (Version & { disabled?: boolean })[];
  image: string;
  url: string;
}

export const EditImageVersionForm = ({
  role,
  versions,
  image,
  url,
}: EditImageVersionFormProps) => {
  const [currentImage, setCurrentImage] = useState(image);
  const pathname = usePathname();

  const { execute, fieldErrors, error, success } = useAction(editImageVersion);

  const options = versions.map(({ name, image, disabled }) => ({
    label: name.toUpperCase(),
    value: image,
    disabled,
  }));

  const onSubmit = (formData: FormData) => {
    const image = formData.get("image") as string;
    execute({ image }, { url, pathname });
  };

  return (
    <form action={onSubmit} className="mt-3 space-y-4">
      <div className="text-sm">
        <Select
          id="image"
          label="Client Version"
          disabled={role === Roles.Reader}
          defaultValue={image}
          onValueChange={setCurrentImage}
          description="Latest version is recommended"
          options={options}
          errors={fieldErrors}
          className="max-w-xs"
        />

        <ExternalLink
          href={
            versions.find((version) => version.image === currentImage)
              ?.releaseNotes!
          }
        >
          Release Notes
        </ExternalLink>
      </div>

      {versions?.find((version) => version.image === image)?.canBeUpgraded && (
        <Alert className="alert-info">
          New image version is avaliable. It is recommended to update to latest
          version.
        </Alert>
      )}

      <SubmitSuccess success={success}>
        Client version has been updated successfully.
      </SubmitSuccess>

      <SubmitError error={error} />

      {role !== Roles.Reader && (
        <SubmitButton disabled={currentImage === image} data-testid="submit">
          Save
        </SubmitButton>
      )}
    </form>
  );
};
