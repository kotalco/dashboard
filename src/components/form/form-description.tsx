interface FormDescriptionProps {
  description?: string | React.ReactNode;
}

export const FormDescription = ({ description }: FormDescriptionProps) => {
  if (typeof description === "string") {
    return <p className="text-sm text-foreground/70">{description}</p>;
  }
  return description;
};
