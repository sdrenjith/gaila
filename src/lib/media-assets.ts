import { unlink } from "node:fs/promises";
import { connectDB } from "@/lib/db";
import { resolveUploadFilePath } from "@/lib/uploads-path";
import { MediaAsset } from "@/models/MediaAsset";

type DeleteMediaAssetResult =
  | { ok: true; title: string }
  | { ok: false; message: string };

export async function deleteMediaAssetById(id: string): Promise<DeleteMediaAssetResult> {
  if (!id) {
    return { ok: false, message: "Media asset id is required." };
  }

  await connectDB();
  const asset = await MediaAsset.findOne({ _id: id }).lean<{ title?: string; url?: string }>();
  if (!asset) {
    return { ok: false, message: "Media asset not found." };
  }

  const filePath = asset.url ? resolveUploadFilePath(asset.url) : null;
  if (filePath) {
    try {
      await unlink(filePath);
    } catch (error) {
      console.warn(`Failed to delete media file at ${filePath}:`, error);
    }
  }

  await MediaAsset.deleteOne({ _id: id });
  return { ok: true, title: asset.title || "asset" };
}
