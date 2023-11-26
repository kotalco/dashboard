import { ColumnDef } from "@tanstack/react-table";

import { SortingButton } from "@/components/ui/sorting-button";
import { CellAction } from "./cell-action";

export type SecretColumn = {
  type: string;
  name: string;
  createdAt: string;
};

export const columns: ColumnDef<SecretColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortingButton column={column}>Name</SortingButton>,
  },
  {
    accessorKey: "type",
    header: ({ column }) => <SortingButton column={column}>Type</SortingButton>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortingButton column={column}>Date</SortingButton>,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
