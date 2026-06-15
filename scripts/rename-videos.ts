import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { connectDB, disconnectDB } from "../src/lib/db";
import { MediaAsset } from "../src/models/MediaAsset";
import { SiteSettings } from "../src/models/SiteSettings";

const localEnv = resolve(process.cwd(), ".env.local");
if (existsSync(localEnv)) {
  config({ path: localEnv });
}
config();

type RenameEntry = {
  oldUrl: string;
  newUrl: string;
  title: string;
};

const renames: RenameEntry[] = [
  {
    oldUrl: "/uploads/video/12479102_3840_2160_24fps.mp4",
    newUrl: "/uploads/video/cinematic-wide.mp4",
    title: "Cinematic wide",
  },
  {
    oldUrl: "/uploads/video/15429436_1920_1080_30fps.mp4",
    newUrl: "/uploads/video/motion-clip.mp4",
    title: "Motion clip",
  },
  {
    oldUrl: "/uploads/video/6153453-uhd_4096_2160_25fps.mp4",
    newUrl: "/uploads/video/editorial-loop.mp4",
    title: "Editorial loop",
  },
  {
    oldUrl: "/uploads/video/8084620-uhd_3840_2160_25fps.mp4",
    newUrl: "/uploads/video/brand-ambient.mp4",
    title: "Brand ambient",
  },
];

async function renameVideos() {
  await connectDB();

  let totalMediaUpdated = 0;
  for (const { oldUrl, newUrl, title } of renames) {
    const result = await MediaAsset.updateMany(
      { url: oldUrl },
      { $set: { url: newUrl, title } },
    );
    totalMediaUpdated += result.modifiedCount ?? 0;
    console.log(
      `MediaAsset ${oldUrl} → ${newUrl}: matched ${result.matchedCount ?? 0}, modified ${result.modifiedCount ?? 0}`,
    );
  }

  const renameMap: Record<string, string> = Object.fromEntries(
    renames.map(({ oldUrl, newUrl }) => [oldUrl, newUrl]),
  );

  const settings = await SiteSettings.findOne();
  if (settings && typeof settings.heroVideo === "string" && renameMap[settings.heroVideo]) {
    const oldHero = settings.heroVideo;
    const newHero = renameMap[oldHero];
    await SiteSettings.updateOne({}, { $set: { heroVideo: newHero } });
    console.log(`SiteSettings.heroVideo: ${oldHero} → ${newHero}`);
  } else {
    console.log(
      `SiteSettings.heroVideo unchanged (current: ${settings?.heroVideo ?? "<no settings doc>"})`,
    );
  }

  console.log(`Done. Total MediaAsset rows modified: ${totalMediaUpdated}.`);
}

renameVideos()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDB();
  });
