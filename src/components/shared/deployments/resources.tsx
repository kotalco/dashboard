import { Roles } from "@/enums";
import { ResourcesInfo } from "@/types";

import { Slider } from "@/components/form/slider";
import { Heading } from "@/components/ui/heading";

interface ResourcesProps<T> {
  node: T;
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const Resources = <T extends ResourcesInfo>({
  node,
  role,
  errors,
}: ResourcesProps<T>) => {
  const { cpu, cpuLimit, memory, memoryLimit, storage } = node;

  return (
    <div className="space-y-4 max-w-xs">
      <Heading variant="h2" title="Resources" id="resources" />
      <Slider
        id="cpu"
        label="CPU"
        defaultValue={[cpu, cpuLimit]}
        min={1}
        max={16}
        step={1}
        unit="Cores"
        disabled={role === Roles.Reader}
        errors={errors}
      />

      <Slider
        id="memory"
        label="Memory"
        defaultValue={[memory, memoryLimit]}
        min={1}
        max={16}
        step={1}
        unit="Gigabytes"
        disabled={role === Roles.Reader}
        minStepsBetweenThumbs={1}
        errors={errors}
      />

      <Slider
        id="storage"
        label="Disk Space"
        defaultValue={[storage]}
        min={100}
        max={2000}
        step={50}
        unit="Gigabytes"
        disabled={role === Roles.Reader}
        errors={errors}
      />
    </div>
  );
};
