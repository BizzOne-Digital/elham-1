import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { BlogPost } from "@/models";
import { BlogForm } from "@/components/admin/forms/BlogForm";
import { PageHeader } from "@/components/admin/PageHeader";

type Props = { params: Promise<{ postId: string }> };

export default async function EditBlogPostPage({ params }: Props) {
  const { postId } = await params;
  await connectDB();
  const post = await BlogPost.findById(postId).lean();
  if (!post) notFound();
  const data = JSON.parse(JSON.stringify(post));

  return (
    <div>
      <PageHeader title={data.title} description={`Editing /blog/${data.slug}`} />
      <BlogForm postId={postId} initial={data} />
    </div>
  );
}
