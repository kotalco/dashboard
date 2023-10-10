"use client";

import { useEffect, useState } from "react";

import { WorksapceModal } from "@/components/modals/workspace-modal";
import { ActivationModal } from "@/components/modals/activation-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <ActivationModal />
      <WorksapceModal />
    </>
  );
};
