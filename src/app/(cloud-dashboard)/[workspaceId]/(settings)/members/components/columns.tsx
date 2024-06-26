"use client";

import { Roles } from "@/enums";
import { ColumnDef } from "@tanstack/react-table";
import { CellRole } from "./cell-role";
import { CellActions } from "./cell-actions";

export type TeamMemberColumn = {
  id: string;
  email: string;
  role: Roles;
  isCurrentUser: boolean;
  currentRole: Roles;
};

export const columns: ColumnDef<TeamMemberColumn>[] = [
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "role",
    header: () => <div className="pl-4">Role</div>,
    cell: ({ row }) => <CellRole data={row.original} />,
  },
  { id: "actions", cell: ({ row }) => <CellActions data={row.original} /> },
];
