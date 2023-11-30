import { z } from "zod";

import { PolkadotNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import {
  EditAPI,
  EditAccessControl,
  EditLogs,
  EditNetworking,
  EditPrometheus,
  EditTelemetry,
  EditValidator,
} from "./schema";

type APIInputType = z.infer<typeof EditAPI>;
type APIReturnType = ActionState<APIInputType, PolkadotNode>;

type AccessControlInputType = z.infer<typeof EditAccessControl>;
type AccessControlReturnType = ActionState<
  AccessControlInputType,
  PolkadotNode
>;

type LogsInputType = z.infer<typeof EditLogs>;
type LogsReturnType = ActionState<LogsInputType, PolkadotNode>;

type NetworkingInputType = z.infer<typeof EditNetworking>;
type NetworkingReturnType = ActionState<NetworkingInputType, PolkadotNode>;

type PrometheusInputType = z.infer<typeof EditPrometheus>;
type PrometheusReturnType = ActionState<PrometheusInputType, PolkadotNode>;

type TelemetryInputType = z.infer<typeof EditTelemetry>;
type TelemetryReturnType = ActionState<TelemetryInputType, PolkadotNode>;

type ValidatorInputType = z.infer<typeof EditValidator>;
type ValidatorReturnType = ActionState<ValidatorInputType, PolkadotNode>;

export type InputType =
  | APIInputType
  | AccessControlInputType
  | LogsInputType
  | NetworkingInputType
  | PrometheusInputType
  | TelemetryInputType
  | ValidatorInputType;
export type ReturnType =
  | APIReturnType
  | AccessControlReturnType
  | LogsReturnType
  | NetworkingReturnType
  | PrometheusReturnType
  | TelemetryReturnType
  | ValidatorReturnType;
