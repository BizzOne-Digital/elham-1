import { connectDB } from "@/lib/db/connect";
import { FAQ } from "@/models";
import { PageHeader } from "@/components/admin/PageHeader";
import { FAQManager } from "@/components/admin/forms/FAQManager";

export const metadata = { title: "FAQs | Admin" };

export default async function AdminFAQsPage() {
  await connectDB();
  const items = JSON.parse(JSON.stringify(await FAQ.find().sort({ sortOrder: 1 }).lean()));

  return (
    <div>
      <PageHeader title="FAQs" description="Manage frequently asked questions." />
      <FAQManager items={items} />
    </div>
  );
}
