import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { findUser } from "@/services/find-user";
import { ChangePasswordForm } from "./components/change-email-form";

export default async function AccountPage() {
  const user = await findUser();

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <ChangePasswordForm />
      </CardContent>
    </Card>
  );
}
