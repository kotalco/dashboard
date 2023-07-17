"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Cog,
  Home,
  LogOut,
  Link as LinkIcon,
  Key,
  KeyRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export const MainSidebarContent = () => {
  const { workspaceId } = useParams();

  return (
    <div className="px-2">
      <nav className="flex flex-col mt-5 overflow-y-auto gap-y-1">
        <Button
          asChild
          variant="ghost"
          className="justify-start w-full text-muted-foreground"
        >
          <Link href={`/${workspaceId}`}>
            <Home className="w-6 h-6 mr-3" />
            Dashboard
          </Link>
        </Button>

        <Button
          asChild
          variant="ghost"
          className="justify-start w-full text-muted-foreground"
        >
          <Link href={`/${workspaceId}/endpoints`}>
            <LinkIcon className="w-6 h-6 mr-3" />
            Endpoints
          </Link>
        </Button>

        <Button
          asChild
          variant="ghost"
          className="justify-start w-full text-muted-foreground"
        >
          <Link href={`/${workspaceId}/secrets`}>
            <KeyRound className="w-6 h-6 mr-3" />
            Secrets
          </Link>
        </Button>
      </nav>

      <div>
        <div className="mt-3 mb-1 text-xs font-normal text-gray-500">
          Account
        </div>
        <Button
          asChild
          variant="ghost"
          className="justify-start w-full text-muted-foreground"
        >
          <Link href="/settings">
            <Cog className="w-6 h-6 mr-3" />
            Settings
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="justify-start w-full text-muted-foreground"
        >
          <Link href="/logout">
            <LogOut className="w-6 h-6 mr-3" />
            Logout
          </Link>
        </Button>
      </div>
    </div>
  );
};
