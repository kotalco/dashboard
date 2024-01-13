import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";

import { SortingButton } from "@/components/ui/sorting-button";
import { Protocol } from "@/enums";
import { getEnumKey } from "@/lib/utils";
import Link from "next/link";

export type EndpointColumn = {
  protocol: Protocol;
  name: string;
  created_at: string;
  href: string;
};

export const columns: ColumnDef<EndpointColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortingButton column={column}>Name</SortingButton>,
    cell: ({ row }) => (
      <Link className="block absolute inset-0 p-4" href={row.original.href}>
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "protocol",
    header: ({ column }) => (
      <SortingButton column={column}>Protocol</SortingButton>
    ),
    cell: ({ row }) => (
      <Link href={row.original.href} className="flex items-center gap-x-2">
        <Image
          width={24}
          height={24}
          alt="decoration"
          src={`/images/${row.original.protocol}.svg`}
          className="w-6 h-6"
        />
        {getEnumKey(Protocol, row.original.protocol)}
      </Link>
    ),
  },
  { accessorKey: "network", header: "Network" },
  {
    accessorKey: "created_at",
    header: ({ column }) => <SortingButton column={column}>Date</SortingButton>,
    cell: ({ row }) => (
      <Link className="block absolute inset-0 p-4" href={row.original.href}>
        {row.original.created_at}
      </Link>
    ),
  },
];
