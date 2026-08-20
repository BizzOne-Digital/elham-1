import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import { Lead } from "@/models";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDateTime } from "@/lib/admin/utils";

export const metadata = { title: "Leads | Admin" };

export default async function AdminLeadsPage() {
  await connectDB();
  const leads = JSON.parse(JSON.stringify(await Lead.find().sort({ createdAt: -1 }).lean()));

  return (
    <div>
      <PageHeader title="Leads" description="Manage incoming leads and inquiries." />
      <DataTable
        data={leads}
        columns={[
          { key: "name", header: "Name" },
          { key: "email", header: "Email" },
          { key: "source", header: "Source" },
          { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status as string} /> },
          { key: "createdAt", header: "Received", render: (item) => formatDateTime(item.createdAt as string) },
          { key: "_id", header: "", render: (item) => <Link href={`/admin/leads/${item._id}`} className="text-blue-600 hover:underline">View</Link> },
        ]}
      />
    </div>
  );
}
