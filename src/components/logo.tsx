import Image from "next/image";

export const Logo = () => {
  return (
    <div className="flex items-center space-x-2 font-nunito">
      <Image
        src="/images/logo.svg"
        alt="logo"
        width={70}
        height={70}
        priority
        className="w-[70px] h-[70px]"
      />
      <p className="text-4xl font-bold leading-4">Kotal</p>
    </div>
  );
};
