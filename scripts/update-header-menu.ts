import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { connectDB, disconnectDB } from "../src/lib/db";
import { headerMenuItems } from "../src/lib/default-content";
import { NavigationMenu } from "../src/models/NavigationMenu";

const productionEnv = resolve(process.cwd(), ".env.production.local");
const localEnv = resolve(process.cwd(), ".env.local");

if (existsSync(productionEnv)) {
  config({ path: productionEnv });
} else if (existsSync(localEnv)) {
  config({ path: localEnv });
}
config();

async function main() {
  await connectDB();

  const result = await NavigationMenu.updateOne(
    { location: "header" },
    {
      $set: {
        location: "header",
        title: "Header Menu",
        items: headerMenuItems,
      },
    },
    { upsert: true },
  );

  console.log(`Header menu updated (matched: ${result.matchedCount}, modified: ${result.modifiedCount}).`);
  await disconnectDB();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
