"use client";

import { Roles } from "@/enums";
import { ColumnDef } from "@tanstack/react-table";
import { CellRole } from "./cell-role";

export type TeamMemberColumn = {
  id: string;
  email: string;
  role: Roles;
  isCurrentUser: boolean;
};

export const columns: ColumnDef<TeamMemberColumn>[] = [
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <CellRole data={row.original} />,
  },
];
