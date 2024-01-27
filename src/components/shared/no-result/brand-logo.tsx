"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface BrandLogoProps {
  src: string;
  checkTheme?: boolean;
}

export const BrandLogo = ({ src, checkTheme }: BrandLogoProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  let imageSrc = src;

  if (src.includes("aptos")) {
    imageSrc =
      theme === "dark" ? "/images/aptos-dark.svg" : "/images/aptos-light.svg";
  }

  if (src.includes("near")) {
    imageSrc =
      theme === "dark" ? "/images/near-dark.svg" : "/images/near-light.svg";
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Image
      width={64}
      height={64}
      alt="decoration"
      src={imageSrc}
      className="w-16 h-16 mb-3"
    />
  );
};
