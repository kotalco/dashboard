import { Content } from "@radix-ui/react-tooltip";

import {
  TooltipProvider,
  Tooltip as CNTooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface TooltipProps extends React.ComponentPropsWithoutRef<typeof Content> {
  children: React.ReactNode;
  content: string;
}

export const Tooltip = ({ children, content, ...props }: TooltipProps) => {
  return (
    <TooltipProvider delayDuration={0}>
      <CNTooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent {...props}>{content}</TooltipContent>
      </CNTooltip>
    </TooltipProvider>
  );
};
