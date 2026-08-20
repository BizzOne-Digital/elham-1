import { connectDB } from "@/lib/db/connect";
import { MediaAsset } from "@/models";
import { PageHeader } from "@/components/admin/PageHeader";
import { UploadsManager } from "@/components/admin/forms/UploadsManager";

export const metadata = { title: "Uploads | Admin" };

export default async function AdminUploadsPage() {
  await connectDB();
  const items = JSON.parse(
    JSON.stringify(await MediaAsset.find().sort({ createdAt: -1 }).limit(100).lean()),
  );

  return (
    <div>
      <PageHeader title="Uploads" description="Manage media library and uploaded files." />
      <UploadsManager items={items} />
    </div>
  );
}
