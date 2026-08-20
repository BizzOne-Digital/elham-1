import { PageForm } from "@/components/admin/forms/PageForm";
import { PageHeader } from "@/components/admin/PageHeader";

export const metadata = { title: "New Page | Admin" };

export default function NewPagePage() {
  return (
    <div>
      <PageHeader title="New Page" description="Create a new site page." />
      <PageForm />
    </div>
  );
}
