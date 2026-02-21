/**
 * Pricing Table Section — lazy-loaded below fold.
 * Co-locates pricingPlans data with PricingTable component.
 */
import { PricingTable } from "../pricing-table";
import { pricingPlans } from "./config";

export default function PricingTableSection() {
  return (
    <section
      style={{
        "padding-bottom": "4rem",
        padding: "0 1rem 4rem 1rem",
      }}
    >
      <PricingTable plans={pricingPlans} showBillingToggle={true} savingsPercent={17} />
    </section>
  );
}
