import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import { Page } from "@/models";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Plus } from "lucide-react";

export const metadata = { title: "Pages | Admin" };

export default async function AdminPagesPage() {
  await connectDB();
  const pages = JSON.parse(JSON.stringify(await Page.find().sort({ sortOrder: 1, title: 1 }).lean()));

  return (
    <div>
      <PageHeader
        title="Pages"
        description="Manage site pages and content."
        actions={
          <Link
            href="/admin/pages/new"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            New Page
          </Link>
        }
      />
      <DataTable
        data={pages}
        columns={[
          { key: "title", header: "Title" },
          { key: "slug", header: "Slug" },
          {
            key: "sections",
            header: "Sections",
            render: (item) => String((item.sections as unknown[] | undefined)?.length ?? 0),
          },
          {
            key: "status",
            header: "Status",
            render: (item) => <StatusBadge status={item.status as string} />,
          },
          {
            key: "updatedAt",
            header: "Updated",
            render: (item) =>
              new Date(item.updatedAt as string).toLocaleDateString(),
          },
          {
            key: "_id",
            header: "",
            render: (item) => (
              <Link href={`/admin/pages/${item._id}`} className="text-blue-600 hover:underline">
                Edit
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
}
