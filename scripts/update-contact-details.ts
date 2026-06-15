import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { defaultPages } from "../src/lib/default-content";
import { connectDB, disconnectDB } from "../src/lib/db";
import { Page } from "../src/models/Page";
import { SiteSettings } from "../src/models/SiteSettings";
import type { PageRecord, PageSection } from "../src/types/cms";

const productionEnv = resolve(process.cwd(), ".env.production.local");
const localEnv = resolve(process.cwd(), ".env.local");

if (existsSync(productionEnv)) {
  config({ path: productionEnv });
} else if (existsSync(localEnv)) {
  config({ path: localEnv });
}
config();

async function updateContactPageCopy() {
  const contactDefaults = defaultPages.find((page) => page.slug === "contact");
  if (!contactDefaults) {
    console.log("No contact page defaults found — skipping page copy update.");
    return;
  }

  const page = await Page.findOne({ slug: "contact" }).lean<PageRecord>();
  if (!page) {
    console.log("No contact page in database — skipping page copy update.");
    return;
  }

  const defaultSectionsById = new Map(
    contactDefaults.sections.map((section) => [section.id, section]),
  );

  const sections = page.sections.map((section: PageSection) => {
    const defaults = defaultSectionsById.get(section.id);
    if (!defaults) {
      return section;
    }

    if (section.id === "contact-imagetext") {
      const settings = defaults.settings as { imageAlt?: string; body?: string };
      return {
        ...section,
        settings: {
          ...section.settings,
          imageAlt: settings.imageAlt,
          body: settings.body,
        },
      };
    }

    if (section.id === "contact-faq") {
      const defaultSettings = defaults.settings as Record<string, unknown>;
      return {
        ...section,
        settings: {
          ...section.settings,
          faqs: defaultSettings.faqs,
        },
      };
    }

    return section;
  });

  const result = await Page.updateOne(
    { slug: "contact" },
    {
      $set: {
        seo: contactDefaults.seo,
        sections,
      },
    },
  );

  console.log(
    `Contact page copy updated — matched: ${result.matchedCount}, modified: ${result.modifiedCount}`,
  );
}

async function updateContactDetails() {
  await connectDB();

  const defaults = new SiteSettings().toObject();
  const contact = defaults.contact as {
    email: string;
    phone: string;
    address: string;
    whatsapp: string;
  };

  const before = await SiteSettings.findOne({}, { contact: 1 }).lean<{ contact?: typeof contact }>();
  const result = await SiteSettings.updateOne(
    {},
    {
      $set: {
        "contact.email": contact.email,
        "contact.phone": contact.phone,
        "contact.address": contact.address,
        "contact.whatsapp": contact.whatsapp,
      },
    },
    { upsert: true },
  );

  const after = await SiteSettings.findOne({}, { contact: 1 }).lean<{ contact?: typeof contact }>();

  console.log("Previous contact details:", before?.contact ?? "(no document)");
  console.log("Updated contact details:", after?.contact ?? "(missing after update)");
  console.log(
    `Site settings updated — matched: ${result.matchedCount}, modified: ${result.modifiedCount}, upserted: ${result.upsertedCount ? "yes" : "no"}`,
  );

  await updateContactPageCopy();

  await disconnectDB();
}

updateContactDetails().catch((error) => {
  console.error(error);
  process.exit(1);
});
