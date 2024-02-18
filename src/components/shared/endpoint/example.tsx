"use client";

import { useState } from "react";
import { Copy, CheckCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Heading } from "@/components/ui/heading";

interface ExampleProps {
  example: string;
}

const Example = ({ example }: ExampleProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyExample = async () => {
    await navigator.clipboard.writeText(example);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div>
      <Heading variant="h3" title="Example" />
      <div className="relative">
        <div className="px-5 mt-2 overflow-x-scroll bg-muted text-muted-foreground text-xs font-mono rounded-md py-7">
          {example}

          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger className="absolute top-0 right-2" asChild>
                <Button onClick={copyExample} type="button" variant="ghost">
                  {isCopied ? (
                    <CheckCheck
                      className="w-5 h-5 text-success"
                      aria-hidden="true"
                    />
                  ) : (
                    <Copy className="w-5 h-5" aria-hidden="true" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};
export default Example;
