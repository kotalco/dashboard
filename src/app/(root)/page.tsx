"use client";

import { useEffect } from "react";

import { useActivationModal } from "@/hooks/useActivationModal";

export default function Page() {
  const onOpen = useActivationModal((state) => state.onOpen);
  const isOpen = useActivationModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) onOpen();
  }, [isOpen, onOpen]);

  return null;
}
