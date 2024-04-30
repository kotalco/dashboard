import { ExternalLinkIcon } from "lucide-react";

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
}

export const ExternalLink = ({ href, children }: ExternalLinkProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group font-normal underline inline-flex hover:text-muted-foreground"
    >
      {children}
      <ExternalLinkIcon className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 duration-150 transition-all" />
    </a>
  );
};
