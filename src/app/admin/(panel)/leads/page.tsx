import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { LeadsTable } from "@/components/admin/LeadsTable";
import { getLeads } from "@/lib/cms";

export default async function AdminLeadsPage() {
  const leads = await getLeads();
  return (
    <AdminPageFrame>
      <Breadcrumbs items={[{ label: "Audience", href: "/admin" }, { label: "Leads" }]} />
      <div className="mt-6">
        <LeadsTable leads={leads} />
      </div>
    </AdminPageFrame>
  );
}
