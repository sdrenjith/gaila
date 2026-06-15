import { saveHeroVideoAction, saveLogoAction, saveSettingsAction } from "@/app/actions/admin";
import { ActionForm } from "@/components/admin/ActionForm";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { Field, Panel, TextArea } from "@/components/admin/AdminFields";
import { GoogleReviewsEditor } from "@/components/admin/GoogleReviewsEditor";
import { ImageSourceInput } from "@/components/admin/ImageSourceInput";
import { VideoSourceInput } from "@/components/admin/VideoSourceInput";
import { getSiteSettings } from "@/lib/cms";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <AdminPageFrame>
      <div className="mb-8">
        <h1 className="text-4xl font-semibold">Site details</h1>
        <p className="mt-2 text-stone-500">Control brand, contact details, social links, footer copy, and default SEO.</p>
      </div>
      <div className="grid gap-6">
        <Panel
          title="Site logo"
          description="The logo shown in the site header, admin sidebar, and login screen. Upload a PNG, JPG, or WebP. Saving replaces any previous uploaded logo file."
        >
          <ActionForm action={saveLogoAction} className="grid gap-4">
            <ImageSourceInput
              label="Logo"
              name="logo"
              defaultValue={settings.logo || ""}
              folder="brand"
              description="Recommended: transparent PNG or WebP on a dark background. Max 5 MB."
            />
          </ActionForm>
        </Panel>
        <Panel
          title="Homepage hero video"
          description="The looping background video that plays behind the homepage hero. Saving replaces the previous file on disk and clears CDN caches."
        >
          <ActionForm action={saveHeroVideoAction} className="grid gap-4">
            <VideoSourceInput
              label="Hero video"
              name="heroVideo"
              defaultValue={settings.heroVideo || ""}
              folder="video"
              description="MP4/WebM. Uploads replace the previous file. Max 250 MB."
            />
          </ActionForm>
        </Panel>
        <Panel title="Global settings">
          <ActionForm action={saveSettingsAction} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Site name" name="siteName" defaultValue={settings.siteName} />
              <Field label="Logo text" name="logoText" defaultValue={settings.logoText} />
              <Field label="Tagline" name="tagline" defaultValue={settings.tagline} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Email" name="email" defaultValue={settings.contact.email} />
              <Field label="Phone" name="phone" defaultValue={settings.contact.phone} />
              <Field label="WhatsApp" name="whatsapp" defaultValue={settings.contact.whatsapp} required={false} />
              <Field label="Address" name="address" defaultValue={settings.contact.address} />
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <Field label="Instagram" name="instagram" defaultValue={settings.social.instagram} required={false} />
              <Field label="LinkedIn" name="linkedin" defaultValue={settings.social.linkedin} required={false} />
              <Field label="Facebook" name="facebook" defaultValue={settings.social.facebook} required={false} />
              <Field label="X/Twitter" name="x" defaultValue={settings.social.x} required={false} />
            </div>
            <TextArea label="Footer description" name="footerDescription" defaultValue={settings.footer.description} />
            <Field label="Copyright" name="copyright" defaultValue={settings.footer.copyright} />
            <Field
              label="Footer tagline"
              name="footerTagline"
              defaultValue={settings.footer.tagline || "Built in Dubai · Made for the world"}
              required={false}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Default SEO title" name="seoTitle" defaultValue={settings.seoDefaults.title} />
              <Field label="Default SEO description" name="seoDescription" defaultValue={settings.seoDefaults.description} />
            </div>
            <GoogleReviewsEditor
              initialReviews={Array.isArray(settings.googleReviews) ? settings.googleReviews : []}
            />
          </ActionForm>
        </Panel>
      </div>
    </AdminPageFrame>
  );
}
