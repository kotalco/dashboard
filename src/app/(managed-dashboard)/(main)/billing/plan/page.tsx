import { InvoicesHistory } from "../_components/invoices-history";
import { ManagePlanCard } from "../_components/manage-plan-card";

export default async function PlanPage() {
  return (
    <div className="space-y-8">
      <ManagePlanCard />
      <InvoicesHistory />
    </div>
  );
}
