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
      <pre className="px-5 mt-2 overflow-x-scroll relative bg-muted text-muted-foreground text-xs font-mono rounded-md py-7">
        {example}

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger className="absolute top-2 right-2">
              <Button
                onClick={copyExample}
                type="button"
                size="icon"
                variant="outline"
                asChild
              >
                <Copy className="w-4 h-4" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </pre>
    </div>
  );
};
export default Example;
