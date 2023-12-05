import Image from "next/image";
import { Plus } from "lucide-react";

import { Roles } from "@/enums";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface NoResultProps {
  imageUrl: string;
  title: string;
  role?: Roles;
  description: string;
  createUrl: string;
  buttonText: string;
  className?: string;
}

export const NoResult: React.FC<NoResultProps> = ({
  imageUrl,
  title,
  role,
  description,
  createUrl,
  buttonText,
  className,
}) => {
  return (
    <Card className={cn("flex flex-col items-center text-center", className)}>
      <CardHeader className="flex flex-col items-center">
        <Image
          width={64}
          height={64}
          alt="decoration"
          src={imageUrl}
          className="w-16 h-16 mb-3"
        />
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {role === Roles.Reader && (
        <CardContent>
          <p>
            You do not have authorization to perform actions. Please contact
            your admin for more information.
          </p>
        </CardContent>
      )}
      {role !== Roles.Reader && (
        <CardFooter>
          <Button asChild>
            <Link href={createUrl}>
              <Plus className="w-4 h-4 mr-2" />
              {buttonText}
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
