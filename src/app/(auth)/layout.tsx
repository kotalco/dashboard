import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-10">
      <div className="flex justify-center space-x-2 font-nunito">
        <Image src="/images/logo.svg" alt="logo" width={80} height={80} />
        <p className="mt-6 text-4xl font-bold leading-4">
          Kotal <br />
          <span className="block mt-2 tracking-wider uppercase logo-slogan">
            Professional
          </span>
        </p>
      </div>
      <div className="w-full px-3 sm:max-w-2xl">{children}</div>
    </div>
  );
}
