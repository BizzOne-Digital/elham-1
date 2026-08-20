import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { GalleryCategory, GalleryProject } from "@/models";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Plus } from "lucide-react";

type Props = { params: Promise<{ categoryId: string }> };

export default async function GalleryCategoryPage({ params }: Props) {
  const { categoryId } = await params;
  await connectDB();
  const category = await GalleryCategory.findById(categoryId).lean();
  if (!category) notFound();
  const projects = JSON.parse(JSON.stringify(await GalleryProject.find({ category: categoryId }).sort({ sortOrder: 1 }).lean()));
  const cat = JSON.parse(JSON.stringify(category));

  return (
    <div>
      <PageHeader
        title={cat.name}
        description={`Projects in ${cat.name}`}
        actions={
          <Link href={`/admin/gallery/projects/new?category=${categoryId}`} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">
            <Plus className="h-4 w-4" /> New Project
          </Link>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project: { _id: string; title: string; slug: string; status: string }) => (
          <Link key={project._id} href={`/admin/gallery/projects/${project._id}`} className="rounded-xl border bg-white p-5 hover:border-blue-200">
            <p className="font-medium">{project.title}</p>
            <p className="text-sm text-slate-500">/{project.slug}</p>
            <div className="mt-2"><StatusBadge status={project.status} /></div>
          </Link>
        ))}
        {projects.length === 0 && <p className="text-sm text-slate-500">No projects in this category yet.</p>}
      </div>
    </div>
  );
}
