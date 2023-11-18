import { InvoicesHistory } from "./_components/invoices-history";
import { ManagePlanCard } from "./_components/manage-plan-card";

export default async function PlanPage({
  searchParams,
}: {
  searchParams: { limit?: string };
}) {
  return (
    <div className="space-y-8">
      <ManagePlanCard />
      <InvoicesHistory limit={searchParams.limit} />
    </div>
  );
}
