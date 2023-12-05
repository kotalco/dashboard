import { z } from "zod";

import { NEARNode } from "@/types";
import { ActionState } from "@/lib/create-action";

import {
  EditNetworking,
  EditPrometheus,
  EditRPC,
  EditTelemetry,
  EditValidator,
} from "./schema";

type NetworkingInputType = z.infer<typeof EditNetworking>;
type NetworkingReturnType = ActionState<NetworkingInputType, NEARNode>;

type PrometheusInputType = z.infer<typeof EditPrometheus>;
type PrometheusReturnType = ActionState<PrometheusInputType, NEARNode>;

type RPCInputType = z.infer<typeof EditRPC>;
type RPCReturnType = ActionState<RPCInputType, NEARNode>;

type TelemetryInputType = z.infer<typeof EditTelemetry>;
type TelemetryReturnType = ActionState<TelemetryInputType, NEARNode>;

type ValidatorInputType = z.infer<typeof EditValidator>;
type ValidatorReturnType = ActionState<ValidatorInputType, NEARNode>;

export type InputType =
  | NetworkingInputType
  | PrometheusInputType
  | RPCInputType
  | TelemetryInputType
  | ValidatorInputType;
export type ReturnType =
  | NetworkingReturnType
  | PrometheusReturnType
  | RPCReturnType
  | TelemetryReturnType
  | ValidatorReturnType;
