import { Alert, AlertDescription } from "@/components/ui/alert";

interface SubmitError {
  error?: string;
}

export const SubmitError: React.FC<SubmitError> = ({ error }) => {
  if (!error) return null;

  return (
    <Alert variant="destructive" className="text-center">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};
