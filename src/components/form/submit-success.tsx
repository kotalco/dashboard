import { Alert, AlertDescription } from "@/components/ui/alert";

interface SubmitSuccessProps {
  success: boolean;
  children: React.ReactNode;
}

export const SubmitSuccess = ({ success, children }: SubmitSuccessProps) => {
  if (!success) return null;

  return (
    <Alert className="text-center alert-success">
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
};
