import { connectDB } from "@/lib/db/connect";
import { PricingPackage } from "@/models";
import { PageHeader } from "@/components/admin/PageHeader";
import { PricingManager } from "@/components/admin/forms/PricingManager";

export const metadata = { title: "Pricing | Admin" };

export default async function AdminPricingPage() {
  await connectDB();
  const items = JSON.parse(
    JSON.stringify(await PricingPackage.find().sort({ sortOrder: 1, name: 1 }).lean()),
  );

  return (
    <div>
      <PageHeader title="Pricing" description="Manage pricing packages." />
      <PricingManager items={items} />
    </div>
  );
}
