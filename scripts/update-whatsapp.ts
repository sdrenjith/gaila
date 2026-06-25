import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { connectDB, disconnectDB } from "../src/lib/db";
import { Page } from "../src/models/Page";
import { SiteSettings } from "../src/models/SiteSettings";

const productionEnv = resolve(process.cwd(), ".env.production.local");
const localEnv = resolve(process.cwd(), ".env.local");

if (existsSync(productionEnv)) {
  config({ path: productionEnv });
} else if (existsSync(localEnv)) {
  config({ path: localEnv });
}
config();

const WHATSAPP_STORED = "+971567045314";
const WHATSAPP_WA_ME = "https://wa.me/971567045314";
const OLD_WHATSAPP_PATTERNS = ["971502827279", "https://wa.me/971502827279"];

async function updateWhatsApp() {
  await connectDB();

  const beforeSettings = await SiteSettings.findOne({}, { contact: 1 }).lean<{ contact?: { whatsapp?: string } }>();
  const settingsResult = await SiteSettings.updateOne(
    {},
    { $set: { "contact.whatsapp": WHATSAPP_STORED } },
    { upsert: true },
  );

  const contactPage = await Page.findOne({ slug: "contact" }).lean<{ sections?: Array<{ id: string; settings?: Record<string, unknown> }> }>();
  let pageResult = { matchedCount: 0, modifiedCount: 0 };
  if (contactPage?.sections?.length) {
    const sections = contactPage.sections.map((section) => {
      if (section.id !== "contact-hero") {
        return section;
      }
      const ctaHref = section.settings?.ctaHref;
      if (typeof ctaHref !== "string" || !OLD_WHATSAPP_PATTERNS.some((pattern) => ctaHref.includes(pattern))) {
        return section;
      }
      return {
        ...section,
        settings: {
          ...section.settings,
          ctaHref: WHATSAPP_WA_ME,
        },
      };
    });

    pageResult = await Page.updateOne({ slug: "contact" }, { $set: { sections } });
  }

  const afterSettings = await SiteSettings.findOne({}, { contact: 1 }).lean<{ contact?: { whatsapp?: string } }>();
  const afterContactPage = await Page.findOne({ slug: "contact" }, { "sections.id": 1, "sections.settings.ctaHref": 1 }).lean<{
    sections?: Array<{ id: string; settings?: { ctaHref?: string } }>;
  }>();
  const afterHero = afterContactPage?.sections?.find((section) => section.id === "contact-hero")?.settings?.ctaHref;

  console.log("Previous WhatsApp:", beforeSettings?.contact?.whatsapp ?? "(no document)");
  console.log("Updated WhatsApp:", afterSettings?.contact?.whatsapp ?? "(missing after update)");
  console.log(
    `Site settings — matched: ${settingsResult.matchedCount}, modified: ${settingsResult.modifiedCount}`,
  );
  console.log(`Contact hero CTA — matched: ${pageResult.matchedCount}, modified: ${pageResult.modifiedCount}`);
  console.log("Contact hero ctaHref after update:", afterHero ?? "(contact page missing)");

  await disconnectDB();
}

updateWhatsApp().catch((error) => {
  console.error(error);
  process.exit(1);
});
