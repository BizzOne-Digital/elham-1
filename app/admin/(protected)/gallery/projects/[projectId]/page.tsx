import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { GalleryProject } from "@/models";
import { GalleryProjectForm } from "@/components/admin/forms/GalleryProjectForm";
import { PageHeader } from "@/components/admin/PageHeader";

type Props = { params: Promise<{ projectId: string }>; searchParams: Promise<{ category?: string }> };

export default async function GalleryProjectPage({ params, searchParams }: Props) {
  const { projectId } = await params;
  const { category: categoryParam } = await searchParams;

  if (projectId === "new") {
    if (!categoryParam) notFound();
    return (
      <div>
        <PageHeader title="New Project" />
        <GalleryProjectForm categoryId={categoryParam} />
      </div>
    );
  }

  await connectDB();
  const project = await GalleryProject.findById(projectId).lean();
  if (!project) notFound();
  const data = JSON.parse(JSON.stringify(project));

  return (
    <div>
      <PageHeader title={data.title} description={`Editing project /${data.slug}`} />
      <GalleryProjectForm projectId={projectId} categoryId={String(data.category)} initial={data} />
    </div>
  );
}
