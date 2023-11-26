"use client";

import { Button } from "@/components/ui/button";

export const DownloadInvoice: React.FC<{ invoicePDF: string }> = ({
  invoicePDF,
}) => {
  return (
    <Button onClick={() => window.open(invoicePDF, "_blank")} variant="outline">
      Download
    </Button>
  );
};
