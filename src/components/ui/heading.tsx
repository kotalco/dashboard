import { cn } from "@/lib/utils";

interface HeadingProps {
  title: string;
  description?: string;
  className?: string;
  variant?: "h1" | "h2" | "h3";
}

export const Heading: React.FC<HeadingProps> = ({
  title,
  description,
  className,
  variant = "h1",
}) => {
  return (
    <div>
      {variant === "h1" && (
        <h1
          className={cn(
            "text-3xl font-bold tracking-tight font-nunito",
            className
          )}
        >
          {title}
        </h1>
      )}

      {variant === "h2" && (
        <h2
          className={cn(
            "text-2xl font-bold tracking-tight font-nunito",
            className
          )}
        >
          {title}
        </h2>
      )}

      {variant === "h3" && (
        <h2
          className={cn(
            "text-xl font-semibold tracking-tight font-nunito",
            className
          )}
        >
          {title}
        </h2>
      )}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};
