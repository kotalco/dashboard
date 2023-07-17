import { Loader2 } from "lucide-react";

export default async function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-full text-primary animate-spin">
      <Loader2 className="w-6 h-6" />
    </div>
  );
}
