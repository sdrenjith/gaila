"use client";

import { AdminTable, type AdminTableColumn } from "@/components/admin/AdminTable";
import { LeadStatusForm } from "@/components/admin/LeadStatusForm";
import type { LeadRecord } from "@/types/cms";

export function LeadsTable({ leads }: { leads: LeadRecord[] }) {
  const columns: AdminTableColumn<LeadRecord>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      sortValue: (lead) => lead.name.toLowerCase(),
      width: "minmax(0, 1.2fr)",
      render: (lead) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-stone-950">{lead.name}</p>
          <p className="truncate text-xs text-stone-500">{lead.email}</p>
        </div>
      ),
    },
    {
      key: "service",
      header: "Service",
      sortable: true,
      sortValue: (lead) => (lead.service || "").toLowerCase(),
      width: "minmax(0, 1fr)",
      render: (lead) => (
        <span className="truncate text-stone-600">{lead.service || "General enquiry"}</span>
      ),
    },
    {
      key: "company",
      header: "Company",
      width: "minmax(0, 0.9fr)",
      render: (lead) => <span className="truncate text-stone-600">{lead.company || "—"}</span>,
    },
    {
      key: "message",
      header: "Message",
      width: "minmax(0, 1.4fr)",
      render: (lead) => <p className="truncate text-xs text-stone-500">{lead.message}</p>,
    },
    {
      key: "status",
      header: "Status",
      width: "9rem",
      sortable: true,
      sortValue: (lead) => lead.status,
      render: (lead) => <LeadStatusForm lead={lead} />,
    },
  ];

  return (
    <AdminTable
      rows={leads}
      columns={columns}
      getRowKey={(lead) => lead._id}
      searchPlaceholder="Search by name, email, or service…"
      filterRow={(lead, term) =>
        [lead.name, lead.email, lead.service, lead.company, lead.message]
          .filter((value): value is string => Boolean(value))
          .some((value) => value.toLowerCase().includes(term))
      }
      emptyState="No leads yet. Public form submissions will appear here."
    />
  );
}
