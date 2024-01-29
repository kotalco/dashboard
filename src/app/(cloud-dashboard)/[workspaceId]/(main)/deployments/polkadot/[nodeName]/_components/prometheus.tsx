"use client";

import { useState } from "react";

import { PolkadotNode } from "@/types";
import { Roles } from "@/enums";

import { Input } from "@/components/form/input";
import { Toggle } from "@/components/form/toggle";
import { Heading } from "@/components/ui/heading";

interface PrometheusProps {
  node: PolkadotNode;
  role: Roles;
  errors?: Record<string, string[] | undefined>;
}

export const Prometheus = ({ node, role, errors }: PrometheusProps) => {
  const { prometheusPort, prometheus } = node;
  const [isPrometheus, setIsPrometheus] = useState(prometheus);

  return (
    <div className="space-y-4">
      <Heading variant="h2" title="Prometheus" />{" "}
      <Toggle
        id="prometheus"
        label="Prometheus"
        disabled={role === Roles.Reader}
        defaultChecked={isPrometheus}
        checked={isPrometheus}
        onCheckedChange={setIsPrometheus}
        errors={errors}
      />
      <Input
        id="prometheusPort"
        label="Prometheus Port"
        disabled={role === Roles.Reader || !isPrometheus}
        errors={errors}
        defaultValue={prometheusPort}
        className="max-w-xs"
      />
    </div>
  );
};
