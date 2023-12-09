import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChangePasswordForm } from "@/components/change-password-form";
import { Badge } from "@/components/ui/badge";
import { findUser } from "@/services/find-user";
import { TwoFactorAuthForm } from "@/components/two-factor-auth-form";

export default async function AccountPage() {
  const { user } = await findUser();

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="relative">
          <CardTitle>Two Factor Authentication</CardTitle>
          <Badge
            className="absolute top-4 right-5"
            variant={user.two_factor_enabled ? "default" : "destructive"}
          >
            {user.two_factor_enabled ? "Enabled" : "Disabled"}
          </Badge>
          <CardDescription>
            Two Factor authentication adds an additional layer of security to
            your account by requiring more than just password to sign in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TwoFactorAuthForm enabled={user.two_factor_enabled} />
        </CardContent>
      </Card>
    </div>
  );
}
