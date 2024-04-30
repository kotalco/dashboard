import { Heading } from "@/components/ui/heading";

import { CreateSecretForm } from "./_components/create-secret-form";

export default async function CreateNewSecretPage() {
  return (
    <div className="space-y-8">
      <Heading title="New Secret" />
      <CreateSecretForm />
    </div>
  );
}
