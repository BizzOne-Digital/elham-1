import { connectDB } from "@/lib/db/connect";
import { GalleryCategory } from "@/models";
import { PageHeader } from "@/components/admin/PageHeader";
import { GalleryCategoryManager } from "@/components/admin/forms/GalleryCategoryManager";

export const metadata = { title: "Gallery | Admin" };

export default async function AdminGalleryPage() {
  await connectDB();
  const categories = JSON.parse(JSON.stringify(await GalleryCategory.find().sort({ sortOrder: 1 }).lean()));

  return (
    <div>
      <PageHeader title="Gallery / Work" description="Manage portfolio categories and projects." />
      <GalleryCategoryManager categories={categories} />
    </div>
  );
}
