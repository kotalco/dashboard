import { Alert, AlertDescription } from "@/components/ui/alert";

interface SubmitSuccessProps {
  success: boolean;
  children: React.ReactNode;
}

export const SubmitSuccess = ({ success, children }: SubmitSuccessProps) => {
  if (!success) return null;

  return (
    <Alert variant="success" className="text-center">
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
};
