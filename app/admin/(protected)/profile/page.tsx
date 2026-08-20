import { requireAdmin } from "@/lib/auth/session";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProfileForm } from "@/components/admin/forms/ProfileForm";

export const metadata = { title: "Profile | Admin" };

export default async function AdminProfilePage() {
  const user = await requireAdmin();

  return (
    <div>
      <PageHeader title="Profile" description="Manage your admin account." />
      <ProfileForm user={{ name: user.name, email: user.email }} />
    </div>
  );
}
