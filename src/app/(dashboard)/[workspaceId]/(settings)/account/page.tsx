import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { findUser } from "@/services/find-user";
import { ChangeEmailForm } from "./components/change-email-form";

export default async function AccountPage() {
  const { user } = await findUser();

  if (!user) return null;

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Change Email</CardTitle>
        <CardDescription>
          Your current email is <strong>{user.email}</strong>. You can change it
          from here
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChangeEmailForm email={user.email} />
      </CardContent>
    </Card>
  );
}
