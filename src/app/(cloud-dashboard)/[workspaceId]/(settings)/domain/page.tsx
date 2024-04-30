import { DomainForm } from "./components/domain-form";
import { getDomainInfo } from "@/services/get-domain-info";
import { Heading } from "@/components/ui/heading";

export default async function DomainPage() {
  const { ip, name } = await getDomainInfo();

  return (
    <div className="space-y-8">
      <Heading title="Domain Settings" />
      <DomainForm ip={ip} domainName={name} />
    </div>
  );
}
