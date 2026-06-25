import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { Panel } from "@/components/admin/forms/Field";
import { MediaLibraryView } from "@/components/admin/MediaLibraryView";
import { MediaUploadForm } from "@/components/admin/MediaUploadForm";
import { getMediaAssets } from "@/lib/cms";

export default async function AdminMediaPage() {
  const assets = await getMediaAssets();
  const existingFolders = [...new Set(assets.map((asset) => asset.folder).filter(Boolean))];
  const totalLabel = `${assets.length} ${assets.length === 1 ? "asset" : "assets"} across uploads folders`;

  return (
    <AdminPageFrame>
      <Breadcrumbs items={[{ label: "Library", href: "/admin" }, { label: "Media" }]} />

      <div className="mt-6 grid gap-6">
        <Panel
          title="Upload"
          description="Images and videos are stored under public/uploads/ and indexed in MongoDB. Choose the category/folder where this asset should appear in the Media library filters."
        >
          <MediaUploadForm existingFolders={existingFolders} />
        </Panel>

        <Panel title="Media library" description={totalLabel}>
          <MediaLibraryView assets={assets} />
        </Panel>
      </div>
    </AdminPageFrame>
  );
}
