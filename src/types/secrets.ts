import { SecretType } from "@/enums";

export interface Secret {
  createdAt: string;
  name: string;
  type: SecretType;
}
