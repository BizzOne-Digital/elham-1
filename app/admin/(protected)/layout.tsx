import { requireAdmin } from "@/lib/auth/session";
import { Sidebar } from "@/components/admin/Sidebar";
import { AdminToaster } from "@/components/admin/AdminToaster";
import { AuthSessionProvider } from "@/components/admin/SessionProvider";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <AuthSessionProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar userName={user.name} userEmail={user.email} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
      <AdminToaster />
    </AuthSessionProvider>
  );
}
