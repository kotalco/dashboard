"use client";

import { useState } from "react";

import { PolkadotNode } from "@/types";
import { Roles } from "@/enums";

import { Input } from "@/components/form/input";
import { Toggle } from "@/components/form/toggle";
import { Heading } from "@/components/ui/heading";

interface TelemetryProps {
  node: PolkadotNode;
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const Telemetry = ({ node, role, errors }: TelemetryProps) => {
  const { telemetryURL, telemetry } = node;
  const [isTelemetry, setIsTelemetry] = useState(telemetry);

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Telemetry" />
      <Toggle
        id="telemetry"
        label="Telemetry"
        defaultChecked={isTelemetry}
        checked={isTelemetry}
        onCheckedChange={setIsTelemetry}
        errors={errors}
        disabled={role === Roles.Reader}
      />

      <Input
        className="max-w-xs"
        id="telemetryURL"
        label="Telemetry Service URL"
        disabled={role === Roles.Reader || !isTelemetry}
        errors={errors}
        defaultValue={telemetryURL}
      />
    </div>
  );
};
