import { ArrowUpDown } from "lucide-react";
import { Column } from "@tanstack/react-table";

import { Button } from "./button";

interface SortingButtonProps<T> {
  children: React.ReactNode;
  column: Column<T>;
}

export const SortingButton = <T,>({
  children,
  column,
}: SortingButtonProps<T>): React.ReactElement => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="pl-0 hover:bg-transparent"
    >
      {children}
      <ArrowUpDown className="w-4 h-4 ml-2" />
    </Button>
  );
};
