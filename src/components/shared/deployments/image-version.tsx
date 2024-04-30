import { useState } from "react";

import { Roles } from "@/enums";
import { Version } from "@/types";

import { Select } from "@/components/form/select";
import { ExternalLink } from "@/components/ui/external-link";
import { Alert } from "@/components/ui/alert";

interface ImageVersionProps {
  role: Roles;
  versions: (Version & { disabled?: boolean })[];
  image: string;
  errors?: Record<string, string[] | undefined>;
}

export const ImageVersion = ({
  role,
  versions,
  image,
  errors,
}: ImageVersionProps) => {
  const [currentImage, setCurrentImage] = useState(image);

  const options = versions.map(({ name, image, disabled }) => ({
    label: name.toUpperCase(),
    value: image,
    disabled,
  }));

  return (
    <>
      <div>
        <Select
          id="image"
          label="Client Version"
          disabled={role === Roles.Reader}
          value={image}
          onValueChange={setCurrentImage}
          description="Latest version is recommended"
          options={options}
          className="max-w-xs"
          errors={errors}
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
    </>
  );
};
