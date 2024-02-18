import { findUser } from "@/services/find-user";

import { ChangePasswordForm } from "@/components/change-password-form";
import { Badge } from "@/components/ui/badge";
import { TwoFactorAuthForm } from "@/components/two-factor-auth-form";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

export const Security = async () => {
  const { user } = await findUser();

  if (!user) return null;

  return (
    <div className="space-y-8">
      <Heading title="Change Password" />
      <div className="max-w-xs">
        <ChangePasswordForm />
      </div>

      <Separator />

      <div className="relative">
        <Heading
          title="Two Factor Authentication"
          description="Two Factor authentication adds an additional layer of security to
            your account by requiring more than just password to sign in."
        />
        <Badge
          className="absolute top-0 left-96"
          variant={user.two_factor_enabled ? "default" : "destructive"}
        >
          {user.two_factor_enabled ? "Enabled" : "Disabled"}
        </Badge>
      </div>

      <TwoFactorAuthForm enabled={user.two_factor_enabled} />
    </div>
  );
};
