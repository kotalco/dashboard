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
      className="text-primary group font-normal hover:underline flex underline-offset-4"
    >
      {children}
      <ExternalLinkIcon className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 duration-150 transition-all" />
    </a>
  );
};
