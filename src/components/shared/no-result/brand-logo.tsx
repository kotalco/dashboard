"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface BrandLogoProps {
  src: string;
}

export const BrandLogo = ({ src }: BrandLogoProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Image
      width={64}
      height={64}
      alt="decoration"
      src={
        !src.includes("aptos")
          ? src
          : theme === "dark"
          ? "/images/aptos-dark.svg"
          : "/images/aptos-light.svg"
      }
      className="w-16 h-16 mb-3"
    />
  );
};
