import { Suspense } from "react";
import Image from "next/image";

import { Roles } from "@/enums";
import { cn } from "@/lib/utils";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { ActionButton } from "./action-button";
import { BrandLogo } from "./brand-logo";

interface NoResultProps {
  imageUrl: string;
  title: string;
  role?: Roles;
  description: string;
  createUrl: string;
  buttonText: string;
  className?: string;
  workspaceId: string;
}

export const NoResult: React.FC<NoResultProps> = async ({
  imageUrl,
  title,
  description,
  createUrl,
  buttonText,
  className,
  workspaceId,
}) => {
  return (
    <Card
      className={cn(
        "flex flex-col items-center text-center border-0 col-span-12",
        className
      )}
    >
      <CardHeader className="flex flex-col items-center">
        <BrandLogo src={imageUrl} />
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <Suspense fallback={<Skeleton className="h-11 w-[200px] mb-6" />}>
        <ActionButton
          workspaceId={workspaceId}
          text={buttonText}
          createUrl={createUrl}
        />
      </Suspense>
    </Card>
  );
};
