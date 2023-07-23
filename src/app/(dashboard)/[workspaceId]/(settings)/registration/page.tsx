import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { RegistrationForm } from "./components/registration-form";
import { getSettings } from "@/services/get-domain-info";

export default async function DomainPage() {
  const { registration } = await getSettings();

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Registeration Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <RegistrationForm isEnabled={registration === "true"} />
      </CardContent>
    </Card>
  );
}
