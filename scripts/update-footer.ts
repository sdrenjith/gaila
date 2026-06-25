import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { defaultFooterCta, footerMenuItems } from "../src/lib/default-content";
import { connectDB, disconnectDB } from "../src/lib/db";
import { NavigationMenu } from "../src/models/NavigationMenu";
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

const PHONE_DISPLAY = "+971 50 282 7279";
const PHONE_WHATSAPP = "+971567045314";

async function updateFooter() {
  await connectDB();

  const defaults = new SiteSettings().toObject();
  const social = defaults.social as Record<string, string>;
  const existingFooter = (await NavigationMenu.findOne({ location: "footer" }).lean()) as {
    items?: { label: string }[];
    cta?: Record<string, unknown>;
  } | null;

  const footerUpdate: Record<string, unknown> = {
    location: "footer",
    title: "Footer Menu",
  };

  if (!existingFooter?.items?.length) {
    footerUpdate.items = footerMenuItems;
    console.log("Seeding footer explore links (menu was empty).");
  } else {
    console.log(`Footer menu already has ${existingFooter.items.length} link(s); skipping items seed.`);
  }

  const storedCta = existingFooter?.cta;
  const needsCta =
    !storedCta?.label ||
    !storedCta?.href ||
    !storedCta?.headline ||
    !storedCta?.headlineAccent;

  if (needsCta) {
    footerUpdate.cta = { ...defaultFooterCta, ...storedCta };
    console.log("Seeding footer CTA copy (missing headline or button fields).");
  }

  const navResult = await NavigationMenu.updateOne(
    { location: "footer" },
    { $set: footerUpdate },
    { upsert: true },
  );

  const copyright = defaults.footer?.copyright ?? "© 2026 Gaila · All rights reserved.";
  const beforeCopyright = (
    await SiteSettings.findOne({}, { "footer.copyright": 1 }).lean<{ footer?: { copyright?: string } }>()
  )?.footer?.copyright;

  const settingsResult = await SiteSettings.updateOne(
    {},
    {
      $set: {
        "contact.phone": PHONE_DISPLAY,
        "contact.whatsapp": PHONE_WHATSAPP,
        "footer.copyright": copyright,
        "social.instagram": social.instagram,
        "social.linkedin": social.linkedin,
        "social.facebook": social.facebook,
        "social.x": social.x,
      },
      $setOnInsert: {
        "footer.tagline": "Built in Dubai · Made for the world",
      },
    },
    { upsert: true },
  );

  const aboutExists = await Page.exists({ slug: "about", status: "published" });

  console.log(
    `Footer menu updated — matched: ${navResult.matchedCount}, modified: ${navResult.modifiedCount}, upserted: ${navResult.upsertedCount ? "yes" : "no"}`,
  );
  console.log(`Footer copyright — before: ${beforeCopyright ?? "(no document)"}`);
  console.log(`Footer copyright — after: ${copyright}`);
  console.log(
    `Site settings (phone/social/copyright) updated — matched: ${settingsResult.matchedCount}, modified: ${settingsResult.modifiedCount}`,
  );
  console.log(`About page published in DB: ${aboutExists ? "yes" : "no — run seed or publish /about in admin"}`);

  await disconnectDB();
}

updateFooter().catch((error) => {
  console.error(error);
  process.exit(1);
});
