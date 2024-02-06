"use client";

import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ExampleProps {
  example: string;
}

const Example = ({ example }: ExampleProps) => {
  const copyExample = async () => {
    await navigator.clipboard.writeText(example);
  };

  return (
    <div>
      <h3 className="text-base">Example</h3>
      <div className="relative">
        <div className="px-5 mt-2 overflow-x-scroll bg-muted text-muted-foreground text-xs font-mono rounded-md py-7">
          {example}

          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger className="absolute top-0 right-2" asChild>
                <Button onClick={copyExample} type="button" variant="ghost">
                  <Copy className="w-5 h-5" aria-hidden="true" />
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
