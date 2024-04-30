interface FormErrorsProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

export const FormErrors: React.FC<FormErrorsProps> = ({ id, errors }) => {
  if (!errors) return null;

  return (
    <div
      id={`${id}-error`}
      aria-live="polite"
      className="mt-2 text-sm text-destructive"
    >
      {errors?.[id]?.map((error) => (
        <div key={error} className="flex items-center font-medium">
          {error}
        </div>
      ))}
    </div>
  );
};
