import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import { Service } from "@/models";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Plus } from "lucide-react";

export const metadata = { title: "Services | Admin" };

export default async function AdminServicesPage() {
  await connectDB();
  const services = JSON.parse(
    JSON.stringify(await Service.find().sort({ sortOrder: 1, title: 1 }).lean()),
  );

  return (
    <div>
      <PageHeader
        title="Services"
        description="Manage your service offerings."
        actions={
          <Link
            href="/admin/services/new"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            New Service
          </Link>
        }
      />
      <DataTable
        data={services}
        columns={[
          { key: "title", header: "Title" },
          { key: "slug", header: "Slug" },
          {
            key: "status",
            header: "Status",
            render: (item) => <StatusBadge status={item.status as string} />,
          },
          {
            key: "isFeatured",
            header: "Featured",
            render: (item) => (item.isFeatured ? "Yes" : "No"),
          },
          {
            key: "_id",
            header: "",
            render: (item) => (
              <Link href={`/admin/services/${item._id}`} className="text-blue-600 hover:underline">
                Edit
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
}
