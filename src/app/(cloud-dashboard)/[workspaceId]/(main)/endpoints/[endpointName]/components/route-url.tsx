"use client";

import { useRef } from "react";
import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface RouteURLProps {
  route: string;
}

export const RouteURL: React.FC<RouteURLProps> = ({ route }) => {
  const buttonRef = useRef<HTMLSpanElement>(null);

  const copyRoute = async () => {
    await navigator.clipboard.writeText(route);

    buttonRef.current && (buttonRef.current.textContent = "COPIED!");
    setTimeout(
      () => buttonRef.current && (buttonRef.current.textContent = "Copy"),
      2000
    );
  };

  return (
    <div className="flex items-center">
      <div className="px-3 max-w-xl border rounded-l-md h-10 truncate py-2 text-sm">
        {route}
      </div>
      <Button
        onClick={copyRoute}
        type="button"
        variant="outline"
        className="border rounded-none shrink-0 rounded-r-md border-l-0 overflow-hidden gap-x-2"
      >
        <Copy className="w-5 h-5" aria-hidden="true" />
        <span ref={buttonRef}>Copy</span>
      </Button>
    </div>
  );
};
