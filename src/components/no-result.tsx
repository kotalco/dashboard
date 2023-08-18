import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Roles } from "@/enums";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface NoResultProps {
  imageUrl: string;
  title: string;
  role: Roles;
  description: string;
  createUrl: string;
  buttonText: string;
}

export const NoResult: React.FC<NoResultProps> = ({
  imageUrl,
  title,
  role,
  description,
  createUrl,
  buttonText,
}) => {
  const router = useRouter();
  return (
    <Card className="flex flex-col items-center text-center">
      <CardHeader className="flex flex-col items-center">
        <Image
          width={64}
          height={64}
          alt="decoration"
          src={imageUrl}
          className="mb-3"
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
          <Button
            onClick={() => router.push(createUrl)}
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
            {buttonText}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
