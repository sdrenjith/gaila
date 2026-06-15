import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { Panel } from "@/components/admin/forms/Field";
import { MediaLibraryGrid } from "@/components/admin/MediaLibraryGrid";
import { MediaUploadForm } from "@/components/admin/MediaUploadForm";
import { getMediaAssets } from "@/lib/cms";

export default async function AdminMediaPage() {
  const assets = await getMediaAssets();
  const totalLabel = `${assets.length} ${assets.length === 1 ? "asset" : "assets"}`;

  return (
    <AdminPageFrame>
      <Breadcrumbs items={[{ label: "Library", href: "/admin" }, { label: "Media" }]} />
      <div className="mt-6 grid gap-6 xl:grid-cols-[0.4fr_0.6fr]">
        <Panel
          title="Upload"
          description="Images and videos are stored under public/uploads/ and indexed in MongoDB. Pick a video file to default the folder to “video”."
        >
          <MediaUploadForm />
        </Panel>
        <Panel title="Library" description={totalLabel}>
          <MediaLibraryGrid assets={assets} />
        </Panel>
      </div>
    </AdminPageFrame>
  );
}
