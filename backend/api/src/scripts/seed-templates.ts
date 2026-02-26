/**
 * Seed Templates Script
 *
 * Populates the `template` table with the 5 production-grade form templates
 * derived from the domain's complex form fixtures.
 *
 * Usage:
 *   cd backend/api
 *   bun run src/scripts/seed-templates.ts
 */
import { db } from '../db';
import { template } from '../db/schema';
import { eq } from 'drizzle-orm';

// ── Import fixture generators from domain package ─────────────────────────────
// Relative path from backend/api/src/scripts → workspace root → packages/domain
import {
    createEmployeeOnboardingForm,
    createEcommerceCheckoutForm,
    createHealthcareIntakeForm,
    createEventRegistrationForm,
    createSurveyFeedbackForm,
} from '../../../../packages/domain/form/__tests__/complex-forms.fixtures';

// ── Template metadata ─────────────────────────────────────────────────────────

const TEMPLATE_METADATA = [
    {
        id: 'tpl-employee-onboarding',
        fixtureId: 'form-employee-onboarding',
        category: 'HR & Onboarding',
        icon: 'person',
        description: 'Collect all required information from new hires — personal details, employment info, documents, and digital signature. Includes conditional sections for managers.',
        sortOrder: 1,
        createFn: createEmployeeOnboardingForm,
    },
    {
        id: 'tpl-ecommerce-checkout',
        fixtureId: 'form-ecommerce-checkout',
        category: 'E-Commerce',
        icon: 'credit-card',
        description: 'Full checkout flow with shipping, billing, and payment method selection. Includes dynamic state loading workflow and payment processing automation.',
        sortOrder: 2,
        createFn: createEcommerceCheckoutForm,
    },
    {
        id: 'tpl-healthcare-intake',
        fixtureId: 'form-healthcare-intake',
        category: 'Healthcare',
        icon: 'heart',
        description: 'Patient intake form for clinics and hospitals — medical history, allergies, appointment details, insurance documents, and consent signature.',
        sortOrder: 3,
        createFn: createHealthcareIntakeForm,
    },
    {
        id: 'tpl-event-registration',
        fixtureId: 'form-event-registration',
        category: 'Events',
        icon: 'calendar',
        description: 'Full event sign-up with attendee info, session selection, dietary requirements, and payment. Includes early-bird pricing logic and automated confirmation.',
        sortOrder: 4,
        createFn: createEventRegistrationForm,
    },
    {
        id: 'tpl-survey-feedback',
        fixtureId: 'form-survey-feedback',
        category: 'Research & Feedback',
        icon: 'star',
        description: 'Customer satisfaction survey with star ratings, NPS, issue reporting, and optional contact fields. Includes conditional complaint sections.',
        sortOrder: 5,
        createFn: createSurveyFeedbackForm,
    },
] as const;

// ── Seed function ─────────────────────────────────────────────────────────────

async function seedTemplates() {
    console.log('🌱 Seeding form templates...\n');

    for (const meta of TEMPLATE_METADATA) {
        try {
            // Generate the form schema from the fixture function
            const formSchema = meta.createFn();

            // Check if template already exists
            const [existing] = await db
                .select({ id: template.id })
                .from(template)
                .where(eq(template.id, meta.id));

            const schemaJson = JSON.parse(JSON.stringify(formSchema));

            if (existing) {
                // Update existing template
                await db
                    .update(template)
                    .set({
                        name: formSchema.name,
                        description: meta.description,
                        category: meta.category,
                        icon: meta.icon,
                        schema: schemaJson,
                        sortOrder: meta.sortOrder,
                        isPublic: true,
                        updatedAt: new Date(),
                    })
                    .where(eq(template.id, meta.id));

                console.log(`  ✅ Updated: "${formSchema.name}" (${meta.category})`);
            } else {
                // Insert new template
                await db.insert(template).values({
                    id: meta.id,
                    name: formSchema.name,
                    description: meta.description,
                    category: meta.category,
                    icon: meta.icon,
                    schema: schemaJson,
                    sortOrder: meta.sortOrder,
                    isPublic: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                console.log(`  ✅ Inserted: "${formSchema.name}" (${meta.category})`);
            }
        } catch (err) {
            console.error(`  ❌ Failed to seed "${meta.id}":`, err);
        }
    }

    console.log('\n🎉 Template seeding complete!');
    process.exit(0);
}

seedTemplates();
