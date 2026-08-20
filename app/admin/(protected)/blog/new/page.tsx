import { BlogForm } from "@/components/admin/forms/BlogForm";
import { PageHeader } from "@/components/admin/PageHeader";

export const metadata = { title: "New Post | Admin" };

export default function NewBlogPostPage() {
  return (
    <div>
      <PageHeader title="New Blog Post" />
      <BlogForm />
    </div>
  );
}
