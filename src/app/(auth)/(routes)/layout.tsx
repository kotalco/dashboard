import { Logo } from "@/components/logo";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-10">
      <Logo />
      <div className="w-full px-3 sm:max-w-2xl">{children}</div>
    </div>
  );
}
