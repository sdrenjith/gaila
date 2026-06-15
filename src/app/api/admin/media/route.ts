import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { slugify } from "@/lib/slug";
import {
  MAX_FILE_BYTES,
  MAX_VIDEO_BYTES,
  resolveAssetExtension,
  type AssetKind,
} from "@/lib/upload";
import { deleteMediaAssetById } from "@/lib/media-assets";
import { MediaAsset } from "@/models/MediaAsset";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const assets = await MediaAsset.find()
    .sort({ createdAt: -1 })
    .lean<
      Array<{
        _id: { toString(): string };
        title: string;
        url: string;
        alt: string;
        folder: string;
        mimeType: string;
        size: number;
        createdAt?: Date;
      }>
    >();

  return NextResponse.json({
    ok: true,
    assets: assets.map((asset) => ({
      id: asset._id.toString(),
      title: asset.title,
      url: asset.url,
      alt: asset.alt,
      folder: asset.folder,
      mimeType: asset.mimeType,
      size: asset.size,
      createdAt: asset.createdAt,
    })),
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const alt = String(formData.get("alt") || "");
  const folder = slugify(String(formData.get("folder") || "general")) || "general";
  const responseFormat = String(formData.get("responseFormat") || "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required." }, { status: 400 });
  }

  const mime = file.type.toLowerCase();
  const isImage = mime.startsWith("image/");
  const isVideo = mime.startsWith("video/");

  if (!isImage && !isVideo) {
    return NextResponse.json(
      { error: "Only image and video uploads are allowed." },
      { status: 400 },
    );
  }

  if (mime === "image/svg+xml" || mime.includes("svg")) {
    return NextResponse.json({ error: "SVG uploads are not allowed." }, { status: 400 });
  }

  const kind: AssetKind = isVideo ? "video" : "image";
  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_FILE_BYTES;
  const maxLabel = isVideo ? "250 MB" : "5 MB";

  if (file.size > maxBytes) {
    return NextResponse.json(
      { error: `File exceeds the ${maxLabel} upload limit.` },
      { status: 413 },
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  if (arrayBuffer.byteLength > maxBytes) {
    return NextResponse.json(
      { error: `File exceeds the ${maxLabel} upload limit.` },
      { status: 413 },
    );
  }

  const extension = resolveAssetExtension(file.name, file.type, kind);
  const safeName = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${extension}`;
  const bytes = Buffer.from(arrayBuffer);
  const uploadDir = join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, safeName), bytes);

  const url = `/uploads/${folder}/${safeName}`;
  await connectDB();
  const asset = await MediaAsset.create({
    title: file.name,
    url,
    alt,
    folder,
    mimeType: file.type,
    size: bytes.byteLength,
  });

  if (responseFormat === "json") {
    return NextResponse.json({
      ok: true,
      url,
      asset: {
        id: asset._id.toString(),
        title: file.name,
        url,
        alt,
        folder,
        mimeType: file.type,
        size: bytes.byteLength,
      },
    });
  }

  return NextResponse.redirect(new URL(`/admin/media?uploaded=${asset._id.toString()}`, request.url));
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim() ?? "";
  const result = await deleteMediaAssetById(id);

  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: result.message.includes("not found") ? 404 : 400 });
  }

  return NextResponse.json({ ok: true, message: `Deleted “${result.title}”.` });
}
