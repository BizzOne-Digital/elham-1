import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Page } from "@/models";
import { PageForm } from "@/components/admin/forms/PageForm";
import { PageSectionsEditor } from "@/components/admin/forms/PageSectionsEditor";
import { PageHeader } from "@/components/admin/PageHeader";
import type { Section } from "@/models/shared";

type Props = { params: Promise<{ pageId: string }> };

export async function generateMetadata({ params }: Props) {
  const { pageId } = await params;
  await connectDB();
  const page = (await Page.findById(pageId).lean()) as { title?: string } | null;
  return { title: page ? `${page.title} | Pages` : "Page | Admin" };
}

export default async function EditPagePage({ params }: Props) {
  const { pageId } = await params;
  await connectDB();
  const page = await Page.findById(pageId).lean();
  if (!page) notFound();

  const data = JSON.parse(JSON.stringify(page));

  return (
    <div className="space-y-8">
      <PageHeader title={data.title} description={`Editing /${data.slug}`} />
      <PageForm pageId={pageId} initial={data} />
      <PageSectionsEditor
        pageId={pageId}
        pageSlug={data.slug}
        initialSections={(data.sections ?? []) as Section[]}
      />
    </div>
  );
}
