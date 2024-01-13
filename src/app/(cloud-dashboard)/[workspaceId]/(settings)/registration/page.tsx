import { RegistrationForm } from "./components/registration-form";
import { getSettings } from "@/services/get-domain-info";
import { Heading } from "@/components/ui/heading";

export default async function DomainPage() {
  const { registration } = await getSettings();

  return (
    <div className="space-y-8">
      <Heading title="Registration Settings" />
      <RegistrationForm isEnabled={registration === "true"} />
    </div>
  );
}
