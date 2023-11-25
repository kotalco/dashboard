"use client";

import { usePathname } from "next/navigation";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { InputWithUnit } from "@/components/form/input-with-unit";
import { TabsFooter } from "@/components/ui/tabs";
import { SubmitButton } from "@/components/form/submit-button";

import { Roles, StorageUnits } from "@/enums";
import { ResourcesInfo } from "@/types";
import { getSelectItems } from "@/lib/utils";
import { useAction } from "@/hooks/use-action";
import { editResources } from "@/actions/edit-resources";

interface ResourcesFormProps<T> {
  node: T;
  url: string;
  role: Roles;
}

export function ResourcesForm<T extends ResourcesInfo>({
  node,
  url,
  role,
}: ResourcesFormProps<T>) {
  const { cpu, cpuLimit, memory, memoryLimit, storage } = node;
  const pathname = usePathname();
  const { execute, fieldErrors, error, data } = useAction(editResources);

  const onSubmit = (formData: FormData) => {
    const cpu = formData.get("cpu-amount") as string;
    const cpuLimit = formData.get("cpuLimit-amount") as string;
    const memoryAmount = formData.get("memory-amount");
    const memoryUnit = formData.get("memory-unit");
    const memory = `${memoryAmount}${memoryUnit}`;
    const memoryLimitAmount = formData.get("memoryLimit-amount");
    const memoryLimitUnit = formData.get("memoryLimit-unit");
    const memoryLimit = `${memoryLimitAmount}${memoryLimitUnit}`;
    const storageAmount = formData.get("storage-amount");
    const storageUnit = formData.get("storage-unit");
    const storage = `${storageAmount}${storageUnit}`;
    execute({ cpu, cpuLimit, memory, memoryLimit, storage }, { url, pathname });
  };

  return (
    <form action={onSubmit} className="relative space-y-4">
      <div className="max-w-xs space-y-4">
        <InputWithUnit
          label="CPU Cores Required"
          disabled={role === Roles.Reader}
          unit="Core"
          defaultValue={cpu}
          errors={fieldErrors}
          id="cpu"
        />

        <InputWithUnit
          label="Maximum CPU Cores"
          disabled={role === Roles.Reader}
          unit="Core"
          defaultValue={cpuLimit}
          errors={fieldErrors}
          id="cpuLimit"
        />

        <InputWithUnit
          label="Memory Required"
          disabled={role === Roles.Reader}
          unit={getSelectItems(StorageUnits)}
          defaultValue={memory}
          errors={fieldErrors}
          id="memory"
        />

        <InputWithUnit
          label="MAX Memory"
          disabled={role === Roles.Reader}
          unit={getSelectItems(StorageUnits)}
          defaultValue={memoryLimit}
          errors={fieldErrors}
          id="memoryLimit"
        />

        <InputWithUnit
          label="Disk Space Required"
          disabled={role === Roles.Reader}
          unit={getSelectItems(StorageUnits)}
          defaultValue={storage}
          errors={fieldErrors}
          id="storage"
        />
      </div>

      {!!data && (
        <Alert variant="success" className="text-center">
          <AlertDescription>
            Resources settings have been updated successfully.
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
}
