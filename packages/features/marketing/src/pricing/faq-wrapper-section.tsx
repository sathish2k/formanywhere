/**
 * FAQ Wrapper Section — lazy-loaded below fold.
 * Co-locates faqs data with FAQSection component.
 */
import { FAQSection } from "../faq-section";
import { faqs } from "./config";

export default function FAQWrapperSection() {
  return (
    <section
      style={{
        padding: "4rem 0",
        background: "var(--m3-color-surface-container-lowest, var(--m3-color-surface))",
      }}
    >
      <div
        style={{
          "max-width": "48rem",
          margin: "0 auto",
          padding: "0 1rem",
        }}
      >
        <FAQSection title="Frequently Asked Questions" faqs={faqs} />
      </div>
    </section>
  );
}
