/**
 * Enterprise Section — lazy-loaded below fold.
 * Co-locates enterpriseFeatures data with ContactSalesCard component.
 */
import { ContactSalesCard } from "../contact-sales-card";
import { enterpriseFeatures } from "./config";

export default function EnterpriseSection() {
  return (
    <section
      style={{
        padding: "4rem 0",
        background: "var(--m3-color-surface)",
      }}
    >
      <div
        style={{
          "max-width": "56rem",
          margin: "0 auto",
          padding: "0 1rem",
        }}
      >
        <ContactSalesCard
          badge="Enterprise"
          title="For organizations with custom requirements"
          features={enterpriseFeatures}
          ctaLabel="Contact Sales"
          ctaHref="mailto:enterprise@formanywhere.com"
          iconName="building"
        />
      </div>
    </section>
  );
}
