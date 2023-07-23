export interface IPAddress {
  ip_address: string;
}

export interface Settings {
  key: "registration_is_enabled" | "domain" | "activation_key";
  value: string;
}
