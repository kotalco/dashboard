export interface IPAddress {
  ip_address: string;
}

export interface Settings {
  key: "registration" | "domain";
  value: string;
}
