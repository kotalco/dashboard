import { Heading } from "@/components/ui/heading";

import { ProviderForm } from "./components/provider-form";

export default async function DomainPage() {
  return (
    <div className="space-y-8">
      <Heading title="Provider Settings" />
      <ProviderForm />
    </div>
  );
}
