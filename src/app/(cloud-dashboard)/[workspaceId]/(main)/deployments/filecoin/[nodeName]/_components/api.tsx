"use client";

import { useState } from "react";

import { FilecoinNode } from "@/types";
import { Roles } from "@/enums";

import { Toggle } from "@/components/form/toggle";
import { Heading } from "@/components/ui/heading";
import { Slider } from "@/components/form/slider";

interface ApiProps {
  node: FilecoinNode;
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const Api = ({ node, role, errors }: ApiProps) => {
  const { api, apiRequestTimeout } = node;
  const [apiState, setApiState] = useState(api);

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="API" id="api" />
      <Toggle
        id="api"
        label="REST"
        defaultChecked={api}
        checked={apiState}
        onCheckedChange={setApiState}
        disabled={role === Roles.Reader}
        errors={errors}
      />

      <div className="max-w-xs">
        <Slider
          id="apiRequestTimeout"
          label="API Request Timeout"
          defaultValue={[`${apiRequestTimeout}`]}
          min={10}
          max={60}
          step={1}
          unit="Seconds"
          disabled={role === Roles.Reader || !apiState}
          errors={errors}
        />
      </div>
    </div>
  );
};
