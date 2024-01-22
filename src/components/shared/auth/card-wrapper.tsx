import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";

interface CardWrapperProps {
  children: React.ReactNode;
  title: string;
}

export const CardWrapper = ({ children, title }: CardWrapperProps) => {
  return (
    <>
      <Logo />
      <Card className="w-full px-3 sm:max-w-md">
        <CardHeader className="flex items-center justify-center">
          <CardTitle className="text-center pt-1 text-2xl font-normal tracking-tight font-nunito text-foreground/70">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">{children}</CardContent>
      </Card>
    </>
  );
};
