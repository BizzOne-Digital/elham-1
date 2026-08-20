import { connectDB } from "@/lib/db/connect";
import { SiteSettings } from "@/models";
import { PageHeader } from "@/components/admin/PageHeader";
import { SettingsForm } from "@/components/admin/forms/SettingsForm";

export const metadata = { title: "Settings | Admin" };

export default async function AdminSettingsPage() {
  await connectDB();
  let settings = await SiteSettings.findOne({ key: "global" }).lean();
  if (!settings) {
    const created = await SiteSettings.create({ key: "global", brand: { name: "Netbrandit" } });
    settings = created.toObject();
  }
  const data = JSON.parse(JSON.stringify(settings));

  return (
    <div>
      <PageHeader title="Settings" description="Configure site-wide settings and preferences." />
      <SettingsForm settings={data} />
    </div>
  );
}
