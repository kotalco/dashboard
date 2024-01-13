import { Logo } from "@/components/logo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-10">
      <Card className="w-full px-3 sm:max-w-md">
        <CardHeader className="flex items-center justify-center">
          <Logo />
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
