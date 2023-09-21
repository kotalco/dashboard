import Link from "next/link";
import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ButtonGroupProps {
  title: string;
  menu: { title: string; href: string }[];
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({ title, menu }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md bg-primary text-primary-foreground hover:bg-primary/90 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ">
        {title} <ChevronDown className="inline-block w-5 h-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {menu.map(({ title, href }) => (
          <DropdownMenuItem key={href}>
            <Link href={href}>{title}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
