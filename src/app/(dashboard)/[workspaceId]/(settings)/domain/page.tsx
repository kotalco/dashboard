import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { DomainForm } from "./components/domain-form";
import { getDomainInfo } from "@/services/get-domain-info";

export default async function DomainPage() {
  const { ip, name } = await getDomainInfo();

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Domain Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <DomainForm ip={ip} domainName={name} />
      </CardContent>
    </Card>
  );
}
