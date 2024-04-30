"use client";

import { useState } from "react";

import { TwoFAModal } from "@/components/modals/2fa-modal";
import { Button } from "@/components/ui/button";
import { QRCodeModal } from "@/components/modals/qr-code-modal";

interface TwoFactorAuthFormProps {
  enabled: boolean;
}

export const TwoFactorAuthForm: React.FC<TwoFactorAuthFormProps> = ({
  enabled,
}) => {
  const [open, setOpen] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState("");

  return (
    <>
      <QRCodeModal
        isOpen={!!qrImageUrl}
        onClose={() => setQrImageUrl("")}
        qrImageUrl={qrImageUrl}
      />
      <TwoFAModal
        enabled={enabled}
        isOpen={open}
        onClose={() => setOpen(false)}
        setQrImageUrl={setQrImageUrl}
      />
      <Button
        variant={enabled ? "destructive" : "default"}
        onClick={() => setOpen(true)}
      >
        {enabled ? "Disable" : "Enable"} Two-Factor Authentication
      </Button>
    </>
  );
};
