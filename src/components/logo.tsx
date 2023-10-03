import Image from "next/image";

export const Logo = () => {
  return (
    <div className="flex items-center space-x-2 font-nunito">
      <Image
        src="/images/logo.svg"
        alt="logo"
        width={80}
        height={80}
        priority
        className="w-20 h-20"
      />
      <p className="mt-3 text-4xl font-bold leading-4">
        Kotal <br />
        <span className="block mt-2 tracking-wider uppercase logo-slogan">
          Professional
        </span>
      </p>
    </div>
  );
};
