import { findUser } from "@/services/find-user";
import { ChangeEmailForm } from "@/components/change-email-form";
import { Heading } from "@/components/ui/heading";

export const Account = async () => {
  const { user } = await findUser();

  if (!user) return null;

  return (
    <div className="space-y-8">
      <Heading title="Change Email" />
      <p className="text-muted-foreground">
        Your current email is <strong>{user.email}</strong>. You can change it
        from here
      </p>
      <div className="max-w-xs">
        <ChangeEmailForm email={user.email} />
      </div>
    </div>
  );
};
