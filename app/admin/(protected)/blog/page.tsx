import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import { BlogPost } from "@/models";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Plus } from "lucide-react";

export const metadata = { title: "Blog | Admin" };

export default async function AdminBlogPage() {
  await connectDB();
  const posts = JSON.parse(JSON.stringify(await BlogPost.find().sort({ createdAt: -1 }).lean()));

  return (
    <div>
      <PageHeader title="Blog" description="Manage blog posts." actions={
        <Link href="/admin/blog/new" className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">
          <Plus className="h-4 w-4" /> New Post
        </Link>
      } />
      <DataTable data={posts} columns={[
        { key: "title", header: "Title" },
        { key: "slug", header: "Slug" },
        { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status as string} /> },
        { key: "_id", header: "", render: (item) => <Link href={`/admin/blog/${item._id}`} className="text-blue-600 hover:underline">Edit</Link> },
      ]} />
    </div>
  );
}
