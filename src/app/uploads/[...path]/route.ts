import { readFile, stat } from "node:fs/promises";
import { NextResponse } from "next/server";
import { mimeTypeForUploadPath, resolveUploadFilePath } from "@/lib/uploads-path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { path } = await context.params;
  const relativePath = `uploads/${path.join("/")}`;
  const absolutePath = resolveUploadFilePath(relativePath);

  if (!absolutePath) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  try {
    const fileStat = await stat(absolutePath);
    if (!fileStat.isFile()) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const body = await readFile(absolutePath);
    return new NextResponse(body, {
      headers: {
        "Content-Type": mimeTypeForUploadPath(relativePath),
        "Cache-Control": "public, max-age=3600",
        "Content-Length": String(fileStat.size),
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
}
